import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import API from '../api'


export default function Product(){
const {slug} = useParams()
const [product, setProduct] = useState(null)


useEffect(()=>{
API.get(`/products/?slug=${slug}`).then(res=>{
// API returns list, pick first
setProduct(res.data[0])
}).catch(console.error)
},[slug])


if(!product) return <div>Loading...</div>


return (
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<img src={product.image ? `http://127.0.0.1:8000${product.image}` : '/placeholder.png'} alt="" className="w-full"/>
<div>
<h1 className="text-2xl font-bold">{product.name}</h1>