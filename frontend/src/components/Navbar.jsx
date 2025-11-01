import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { cart } = useContext(CartContext)
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="bg-white shadow">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-400 flex items-center justify-center text-white font-bold">HS</div>
          <div className="font-bold text-lg">HoneyShop</div>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/shop" className="text-sm">Shop</Link>
          <Link to="/about" className="text-sm">About</Link>
          <Link to="/contact" className="text-sm">Contact</Link>
          <Link to="/cart" className="relative">
            Cart
            <span className="ml-2 inline-block bg-yellow-400 text-xs px-2 py-0.5 rounded-full">{cart.reduce((s,i)=>s+i.qty,0)}</span>
          </Link>
          {user ? (
            <button onClick={logout} className="text-sm">Logout</button>
          ) : (
            <Link to="/login" className="text-sm">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
