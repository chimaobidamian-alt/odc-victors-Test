 "use client";
import { createContext,useContext,useEffect,useMemo,useState } from "react";
import { Product,seedProducts } from "@/lib/products";
type CartLine={product:Product;quantity:number;size?:number;color?:string};
type Store={cart:CartLine[];wishlist:string[];add:(p:Product,size?:number)=>void;remove:(id:string)=>void;qty:(id:string,n:number)=>void;toggleWish:(id:string)=>void;clear:()=>void};
const C=createContext<Store|null>(null);
export function StoreProvider({children}:{children:React.ReactNode}){
 const [cart,setCart]=useState<CartLine[]>([]),[wishlist,setWishlist]=useState<string[]>([]);
 useEffect(()=>{try{setCart(JSON.parse(localStorage.getItem("odc-cart")||"[]"));setWishlist(JSON.parse(localStorage.getItem("odc-wish")||"[]"));}catch{}},[]);
 useEffect(()=>{localStorage.setItem("odc-cart",JSON.stringify(cart));},[cart]);
 useEffect(()=>{localStorage.setItem("odc-wish",JSON.stringify(wishlist));},[wishlist]);
 const value=useMemo(()=>({cart,wishlist,add:(p:Product,size?:number)=>setCart(old=>{const found=old.find(x=>x.product.id===p.id&&x.size===size);return found?old.map(x=>x===found?{...x,quantity:Math.min(x.quantity+1,p.stock)}:x):[...old,{product:p,quantity:1,size,color:p.color}]}),remove:(id:string)=>setCart(old=>old.filter(x=>x.product.id!==id)),qty:(id:string,n:number)=>setCart(old=>old.map(x=>x.product.id===id?{...x,quantity:Math.max(1,Math.min(n,x.product.stock))}:x)),toggleWish:(id:string)=>setWishlist(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]),clear:()=>setCart([])}),[cart,wishlist]);
 return <C.Provider value={value}>{children}</C.Provider>;
}
export function useStore(){const c=useContext(C);if(!c)throw new Error("useStore must be inside StoreProvider");return c;}
