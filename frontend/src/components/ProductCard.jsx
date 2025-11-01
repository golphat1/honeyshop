import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext)
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <img src={product.image || '/placeholder.png'} alt={product.name} className="h-44 object-cover rounded mb-3" />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-600 flex-1 mt-2">{product.description?.slice(0,120)}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="font-bold">${product.price}</div>
        <div className="flex gap-2">
          <button onClick={()=>addToCart(product,1)} className="px-3 py-1 bg-yellow-400 text-white rounded">Add</button>
          <Link to={`/product/${product.id || product._id}`} className="px-3 py-1 border rounded">View</Link>
        </div>
      </div>
    </div>
  )
}
