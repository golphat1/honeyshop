import React, { createContext, useState, useEffect, useContext } from 'react'
import api from '../services/api'
import { AuthContext } from './AuthContext'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const { user } = useContext(AuthContext)

  // load server cart for authenticated users
  useEffect(() => {
    async function load() {
      if (user) {
        try {
          const res = await api.get('/store/cart/')
          // format: depends on backend: expect array of items or { items: [...] }
          const items = Array.isArray(res.data) ? res.data : res.data.items ?? []
          setCart(items.map(it => ({
            _id: it.id || it.product?.id || it.product_id,
            name: it.product?.name || it.name,
            price: it.product?.price || it.price,
            image: it.product?.image || it.image,
            qty: it.quantity || it.qty || 1
          })))
        } catch (e) {
          console.warn('Failed to load cart', e)
        }
      } else {
        // load from localStorage for guest
        const guest = JSON.parse(localStorage.getItem('guest_cart') || '[]')
        setCart(guest)
      }
    }
    load()
  }, [user])

  // save guest cart to localStorage when changes
  useEffect(() => {
    if (!user) localStorage.setItem('guest_cart', JSON.stringify(cart))
  }, [cart, user])

  const addToCart = async (product, qty = 1) => {
    if (user) {
      // send to server
      await api.post('/store/cart/add/', { product_id: product.id || product._id, quantity: qty })
      // reload server cart
      const res = await api.get('/store/cart/')
      const items = Array.isArray(res.data) ? res.data : res.data.items ?? []
      setCart(items.map(it => ({
        _id: it.id || it.product?.id || it.product_id,
        name: it.product?.name || it.name,
        price: it.product?.price || it.price,
        image: it.product?.image || it.image,
        qty: it.quantity || it.qty || 1
      })))
    } else {
      // guest cart in memory/localStorage
      setCart(prev => {
        const found = prev.find(p => p._id === (product.id || product._id))
        if (found) return prev.map(p => p._id === (product.id || product._id) ? { ...p, qty: p.qty + qty } : p)
        return [...prev, { _id: product.id || product._id, name: product.name, price: product.price, image: product.image, qty }]
      })
    }
  }

  const removeFromCart = async (id) => {
    if (user) {
      await api.delete('/store/cart/', { data: { id } })
      const res = await api.get('/store/cart/')
      const items = Array.isArray(res.data) ? res.data : res.data.items ?? []
      setCart(items.map(it => ({
        _id: it.id || it.product?.id || it.product_id,
        name: it.product?.name || it.name,
        price: it.product?.price || it.price,
        image: it.product?.image || it.image,
        qty: it.quantity || it.qty || 1
      })))
    } else {
      setCart(prev => prev.filter(p => p._id !== id))
      localStorage.setItem('guest_cart', JSON.stringify(cart.filter(p => p._id !== id)))
    }
  }

  const updateQty = async (id, qty) => {
    // naive: remove and re-add or expect server update endpoint; here we sync locally
    setCart(prev => prev.map(p => p._id === id ? { ...p, qty } : p))
    if (!user) localStorage.setItem('guest_cart', JSON.stringify(cart.map(p=>p._id===id?{...p,qty}:p)))
  }

  const clearCart = async () => {
    if (user) {
      // if backend had endpoint to clear then call; else delete items one-by-one
      const current = await api.get('/store/cart/')
      const items = Array.isArray(current.data) ? current.data : current.data.items ?? []
      for (const it of items) {
        await api.delete('/store/cart/', { data: { id: it.id } })
      }
      setCart([])
    } else {
      setCart([])
      localStorage.removeItem('guest_cart')
    }
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
