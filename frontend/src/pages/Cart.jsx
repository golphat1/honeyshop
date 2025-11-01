import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import CartItem from '../components/CartItem'

export default function Cart(){
  const { cart, removeFromCart, updateQty, clearCart } = useContext(CartContext)
  const nav = useNavigate()
  const total = cart.reduce((s,i)=> s + (i.price||0) * i.qty, 0)

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {cart.length===0 && <div className="bg-white p-6 rounded">Your cart is empty.</div>}
          {cart.map(item => <CartItem key={item._id} item={item} onRemove={removeFromCart} onUpdate={updateQty} />)}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div className="font-semibold">Order Summary</div>
          <div className="mt-4">Total: <span className="font-bold">${total.toFixed(2)}</span></div>
          <div className="mt-6 flex gap-3">
            <button onClick={()=>nav('/checkout')} className="px-4 py-2 bg-green-600 text-white rounded">Checkout</button>
            <button onClick={clearCart} className="px-4 py-2 border rounded">Clear</button>
          </div>
        </div>
      </div>
    </div>
  )
}
