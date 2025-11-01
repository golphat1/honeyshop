import React, { useEffect, useState } from 'react'
import API from '../services/api'
import { Link } from 'react-router-dom'

export default function ProductList(){
  const [products, setProducts] = useState([])
  useEffect(()=>{ API.get('/store/products/').then(r=>setProducts(r.data)).catch(console.error) },[])
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Honey & Bee Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(p=>(
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <img src={p.image || '/placeholder.png'} alt="" className="h-40 w-full object-cover mb-2" />
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-gray-600">${p.price}</p>
            <Link to={`/product/${p.slug}`} className="text-blue-600 mt-2 inline-block">View</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
