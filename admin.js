// pages/admin.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])

  const login = (e) => {
    if(e.target.password.value === 'odc2024admin') setIsAdmin(true)
  }

  useEffect(() => {
    if(isAdmin) {
      supabase.from('orders').select('*, order_items(*)').then(r=>setOrders(r.data))
      supabase.from('products').select('*').then(r=>setProducts(r.data))
    }
  }, [isAdmin])

  if(!isAdmin) return (
    <form onSubmit={login} className="p-10">
      <h1>ODC Admin Login</h1>
      <input name="password" type="password" placeholder="Admin password" />
      <button>Login</button>
    </form>
  )

  return (
    <div className="p-6">
      <h1>ODC Victors - Admin</h1>
      <h2>Orders ({orders.length})</h2>
      {orders.map(o => (
        <div key={o.id} className="border p-2 mb-2">
          {o.customer_email} - ₦{o.total} - {o.status} - {o.delivery_location}
        </div>
      ))}
      <h2>Products</h2>
      {/* Add product form here */}
    </div>
  )
}