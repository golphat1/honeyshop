from mongoengine import Document, StringField, FloatField, IntField, ReferenceField, ListField, EmbeddedDocument, EmbeddedDocumentField, DateTimeField
from datetime import datetime
from django.db import models
from users.models import User

class Category(Document):
    name = StringField(required=True)
    description = StringField()

class Product(Document):
    name = StringField(required=True)
    description = StringField()
    price = FloatField(required=True)
    image = StringField()
    category = StringField()
    stock = IntField(default=0)
    created_at = DateTimeField(default=datetime.utcnow)

    def __str__(self):
        return self.name


class CartItem(EmbeddedDocument):
    product_id = StringField(required=True)
    quantity = IntField(default=1)


class Cart(Document):
    user = ReferenceField(User, required=True)
    items = ListField(EmbeddedDocumentField(CartItem))
    updated_at = DateTimeField(default=datetime.utcnow)


class Order(Document):
    user = ReferenceField(User, required=True)
    total = FloatField(required=True)
    payment_status = StringField(default="Pending")
    created_at = DateTimeField(default=datetime.utcnow)
    stripe_session_id = StringField()
    
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class BlogPost(Document):
    title = StringField(required=True)
    content = StringField(required=True)
    author = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)


