import React, { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import api from '../services/api'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(()=> {
    api.get('/store/products/').then(r=> setProducts(r.data)).catch(()=>{})
  }, [])

  return (
    <>
      <Hero />
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <div className="text-sm text-gray-600">Pure, Raw & Organic</div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(p=> <ProductCard key={p.id || p._id} product={p} />)}
        </div>
      </section>

      <section className="bg-yellow-500 text-white py-10">
        <div className="container text-center">
          <h3 className="text-2xl font-bold">We Export Honey Abroad</h3>
          <p className="mt-2 max-w-xl mx-auto">Supplying premium Kenyan honey and bee products to clients in the UK, Europe, and beyond. Contact our export team for wholesale pricing.</p>
        </div>
      </section>
    </>
  )
}
