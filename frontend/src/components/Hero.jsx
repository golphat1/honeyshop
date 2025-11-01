import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <header className="bg-gradient-to-r from-yellow-50 to-white py-20">
      <div className="container text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Pure Kenyan Honey — Direct from the Hive</h1>
        <p className="text-lg text-gray-700 mb-6">Organic, raw honey and bee products. We export to the UK and abroad — wholesale & retail.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/shop" className="px-6 py-3 bg-yellow-500 text-white rounded shadow">Shop Now</Link>
          <Link to="/about" className="px-6 py-3 border rounded">Learn More</Link>
        </div>
      </div>
    </header>
  )
}
