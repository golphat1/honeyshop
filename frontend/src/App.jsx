import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Product from './pages/Product'


export default function App(){
return (
<div className="min-h-screen bg-gray-50">
<nav className="bg-white shadow p-4">
<div className="container mx-auto flex justify-between items-center">
<Link to="/" className="font-bold text-xl">MyShop</Link>
<div className="space-x-4">
<Link to="/">Home</Link>
<Link to="/cart">Cart</Link>
</div>
</div>
</nav>
<main className="container mx-auto py-8">
<Routes>
<Route path="/" element={<Home/>} />
<Route path="/product/:slug" element={<Product/>} />
</Routes>
</main>
</div>
)
}