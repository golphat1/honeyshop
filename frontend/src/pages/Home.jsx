import React, {useEffect, useState} from 'react'
import API from '../api'
import { Link } from 'react-router-dom'


export default function Home(){
const [products, setProducts] = useState([])
useEffect(()=>{
API.get('/products/').then(res=>setProducts(res.data)).catch(console.error)
},[])


return (
<div>
<h1 className="text-2xl font-bold mb-4">Products</h1>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
{products.map(p=> (
<div key={p.id} className="bg-white p-4 rounded shadow">
<img src={p.image ? `http://127.0.0.1:8000${p.image}` : '/placeholder.png'} alt="" className="h-40 w-full object-cover mb-2" />
<h2 className="font-semibold">{p.name}</h2>
<p className="text-gray-600">${p.price}</p>
<Link className="mt-2 inline-block text-blue-600" to={`/product/${p.slug}`}>View</Link>
</div>
))}
</div>
</div>
)
}