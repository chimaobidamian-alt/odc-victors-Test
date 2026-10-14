"use client";
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_PASSWORD = "odc2024admin";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [pass, setPass] = useState("")
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem("odc_admin") === "yes") setIsAdmin(true)
  }, [])

  useEffect(() => {
    if(!isAdmin) return
    const fetchOrders = async () => {
      setLoading(true)
      const { data } = await supabase.from('orders').select('*').order('created_at', {ascending:false})
      setOrders(data || [])
      setLoading(false)
    }
    fetchOrders()
  }, [isAdmin])

  const handleLogin = () => {
    if(pass.trim() === ADMIN_PASSWORD) {
      localStorage.setItem("odc_admin", "yes")
      setIsAdmin(true)
    } else alert("Wrong password")
  }

  if(!isAdmin) {
    return (
      <div style={{padding:80, textAlign:'center'}}>
        <h1>ODC Admin</h1>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="odc2024admin" style={{padding:12, width:250}} />
        <br/><br/>
        <button onClick={handleLogin} style={{padding:'12px 25px', background:'black', color:'white'}}>Login</button>
      </div>
    )
  }

  return (
    <div style={{padding:20, maxWidth:1100, margin:'0 auto'}}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <h1>Store Management - {orders.length} Orders</h1>
        <button onClick={()=>{localStorage.removeItem("odc_admin"); setIsAdmin(false)}}>Logout</button>
      </div>
      {loading? <p>Loading...</p> : orders.length===0? <p>No orders yet. Customers orders will appear here.</p> :
        <table style={{width:'100%', borderCollapse:'collapse', marginTop:20}}>
          <thead><tr style={{background:'#f5f5f5', textAlign:'left'}}>
            <th style={{padding:10, border:'1px solid #ddd'}}>Date</th>
            <th style={{padding:10, border:'1px solid #ddd'}}>Customer</th>
            <th style={{padding:10, border:'1px solid #ddd'}}>Total</th>
            <th style={{padding:10, border:'1px solid #ddd'}}>Status</th>
          </tr></thead>
          <tbody>{orders.map((o:any)=>(
            <tr key={o.id}>
              <td style={{padding:10, border:'1px solid #ddd'}}>{new Date(o.created_at).toLocaleString()}</td>
              <td style={{padding:10, border:'1px solid #ddd'}}>{o.customer_email}</td>
              <td style={{padding:10, border:'1px solid #ddd'}}>₦{o.total_amount || o.total}</td>
              <td style={{padding:10, border:'1px solid #ddd'}}>{o.status}</td>
            </tr>
          ))}</tbody>
        </table>
      }
    </div>
  )
}