import React from 'react'

export default function CartItem({ item, onRemove, onUpdate }){
  return (
    <div className="flex items-center gap-4 bg-white p-3 rounded shadow">
      <img src={item.image || '/placeholder.png'} alt={item.name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <div className="font-semibold">{item.name}</div>
        <div className="text-sm text-gray-600">${item.price}</div>
      </div>
      <div className="flex items-center gap-2">
        <input type="number" value={item.qty} min="1" onChange={(e)=>onUpdate(item._id, parseInt(e.target.value||1))} className="w-16 p-1 border rounded" />
        <button onClick={()=>onRemove(item._id)} className="text-red-600">Remove</button>
      </div>
    </div>
  )
}
