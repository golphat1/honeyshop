import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { CartContext } from '../context/CartContext'

export default function ProductDetail(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { addToCart } = useContext(CartContext)

  useEffect(()=> {
    api.get(`/store/products/${id}/`).then(r=> setProduct(r.data)).catch(()=>{})
  }, [id])

  if(!product) return <div className="container py-12">Loading...</div>

  return (
    <div className="container py-12 grid md:grid-cols-2 gap-8">
      <img src={product.image || '/placeholder.png'} alt={product.name} className="rounded shadow" />
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-4 text-gray-700">{product.description}</p>
        <div className="mt-6 text-2xl font-semibold">${product.price}</div>
        <div className="mt-6 flex gap-4">
          <button onClick={()=>addToCart(product,1)} className="px-5 py-2 bg-yellow-400 rounded">Add to cart</button>
        </div>
      </div>
    </div>
  )
}
