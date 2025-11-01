# backend/store/views.py
from rest_framework import status, viewsets, generics, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, CartItem, Order, Category, BlogPost
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    CartItemSerializer,
    OrderSerializer,
    BlogPostSerializer,
)
import stripe, json

stripe.api_key = settings.STRIPE_SECRET_KEY


# ----------------------------- AUTHENTICATION -------------------------------- #
@api_view(["POST"])
def register_user(request):
    """
    Register a new user
    """
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "message": "User registered successfully",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        },
        status=201,
    )


@api_view(["POST"])
def login_user(request):
    """
    Return JWT tokens for valid user
    """
    from django.contrib.auth import authenticate

    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if not user:
        return Response({"error": "Invalid credentials"}, status=401)

    refresh = RefreshToken.for_user(user)
    return Response(
        {"refresh": str(refresh), "access": str(refresh.access_token)}, status=200
    )


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def logout_user(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "User logged out successfully"}, status=205)
    except Exception:
        return Response({"error": "Invalid token"}, status=400)


# ----------------------------- PRODUCTS -------------------------------- #
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get("q")
        if query:
            return Product.objects.filter(name__icontains=query)
        return super().get_queryset()


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


# ----------------------------- CART -------------------------------- #
class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def create(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))
        product = get_object_or_404(Product, id=product_id)

        cart_item, created = CartItem.objects.get_or_create(
            user=request.user, product=product
        )
        if not created:
            cart_item.quantity += quantity
        cart_item.save()
        return Response(CartItemSerializer(cart_item).data, status=201)

    def destroy(self, request, pk=None):
        item = get_object_or_404(CartItem, pk=pk, user=request.user)
        item.delete()
        return Response(status=204)


# ----------------------------- ORDERS & STRIPE -------------------------------- #
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def create_order(request):
    """
    Creates Stripe PaymentIntent and a local Order record.
    """
    try:
        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        total = sum(item.product.price * item.quantity for item in cart_items)

        # Create PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=int(total * 100),  # in cents
            currency="usd",
            metadata={"user_id": request.user.id},
        )

        order = Order.objects.create(user=request.user, total=total, status="pending")
        order.products.set(cart_items.values_list("product", flat=True))
        order.payment_intent = intent.id
        order.save()

        return Response(
            {"client_secret": intent.client_secret, "order_id": order.id}, status=201
        )
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@csrf_exempt
@api_view(["POST"])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except (ValueError, stripe.error.SignatureVerificationError):
        return Response(status=400)

    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        intent_id = payment_intent["id"]
        order = Order.objects.filter(payment_intent=intent_id).first()
        if order:
            order.status = "paid"
            order.save()

    return Response(status=200)


# ----------------------------- BLOG -------------------------------- #
class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().order_by("-created_at")
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            serializer.save()
