"use client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, ArrowUpDown } from "lucide-react";
import { getProducts, money, Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default function Shop(){
  const params = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [category,setCategory]=useState(params.get("category")||"All");
  const [audience,setAudience]=useState("All");
  const [color,setColor]=useState("All");
  const [size,setSize]=useState("All");
  const [max,setMax]=useState("45000");
  const [query,setQuery]=useState("");
  const [sort,setSort]=useState("featured");
  
  const categories=["All","Men","Women","Shoes","Sandals","Pams","Belts","Wallets"];

  // Fetch from Supabase
  useEffect(() => {
    getProducts().then(setAllProducts);
  }, []);

  const products=useMemo(()=>allProducts.filter(p=>
    (category==="All"||p.category===category||p.audience===category)&&
    (audience==="All"||p.audience===audience)&&
    (color==="All"||p.color.toLowerCase()===color.toLowerCase())&&
    (size==="All"||p.sizes.includes(Number(size)))&&
    p.price<=Number(max)&&
    p.name.toLowerCase().includes(query.toLowerCase())
  ).sort((a,b)=>sort==="low"?a.price-b.price:sort==="high"?b.price-a.price:0),
  [allProducts,category,audience,color,size,max,query,sort]);

  return (
  <div className="wrap page-pad">
    <div className="page-intro">
      <div className="eyebrow">THE FULL COLLECTION</div>
      <h1>Find your <em>fit.</em></h1>
      <p>Thoughtful leather pieces for wherever life takes you.</p>
    </div>

    <div className="shop-toolbar">
      <div className="search-box"><Search size={18}/><input placeholder="Search the collection..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
      <label className="sort-select"><ArrowUpDown size={16}/><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>
    </div>

    <div className="shop-layout">
      <aside className="filters">
        <h3><SlidersHorizontal size={17}/> Filters</h3>
        <label>Category</label>
        {categories.map(c=><button key={c} className={category===c?"filter-option selected":"filter-option"} onClick={()=>setCategory(c)}>{c}<span>{c=== "All"?allProducts.length:allProducts.filter(p=>p.category===c||p.audience===c).length}</span></button>)}
        <label>Colour</label>
        <select value={color} onChange={e=>setColor(e.target.value)}><option>All</option><option>Black</option><option>Brown</option><option>Tan</option></select>
        <label>Size</label>
        <select value={size} onChange={e=>setSize(e.target.value)}><option value="All">All sizes</option>{[40,41,42,43,44,45,46].map(s=><option key={s}>{s}</option>)}</select>
        <label>Maximum price</label>
        <input type="range" min="15000" max="45000" step="1000" value={max} onChange={e=>setMax(e.target.value)}/>
        <div className="price-range"><span>₦15,000</span><b>{money(Number(max))}</b></div>
        <button className="clear-filters" onClick={()=>{setCategory("All");setAudience("All");setColor("All");setSize("All");setMax("45000");setQuery("");}}>Clear all filters</button>
      </aside>

      <div className="shop-results">
        <div className="results-count">{products.length} pieces <span>· Handcrafted with care</span></div>
        {allProducts.length===0 ? <div className="empty-state"><h3>Loading collection...</h3></div> : products.length?<div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="empty-state"><h3>No pieces found</h3><p>Try changing your filters or search term.</p></div>}
      </div>
    </div>
  </div>
  )
}