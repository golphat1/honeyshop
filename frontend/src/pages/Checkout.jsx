import React, { useContext, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import api from '../services/api'
import { CartContext } from '../context/CartContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '')

function CheckoutForm(){
  const { cart, clearCart } = useContext(CartContext)
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // create PaymentIntent or Checkout session on server
      const res = await api.post('/store/checkout/')
      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url
        return
      }
      const clientSecret = res.data.client_secret || res.data.clientSecret
      if (!clientSecret) { alert('No payment info returned'); setLoading(false); return }
      const card = elements.getElement(CardElement)
      const result = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } })
      if (result.error) alert(result.error.message)
      else if(result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        alert('Payment success — thank you!')
        clearCart()
        window.location.href = '/'
      }
    } catch (err) {
      console.error(err)
      alert('Payment failed')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
      <div className="mb-4">
        <CardElement />
      </div>
      <button disabled={!stripe || loading} className="px-4 py-2 bg-yellow-400 rounded">Pay</button>
    </form>
  )
}

export default function Checkout(){
  return (
    <Elements stripe={stripePromise}>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <CheckoutForm />
      </div>
    </Elements>
  )
}
