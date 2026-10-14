import Link from "next/link";
import { ArrowUpRight, Check, Truck, ShieldCheck, HandHeart } from "lucide-react";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default async function Home(){
  const products = await getProducts();
  const heroProduct = products[0];

  return (
  <>
  <section className="hero wrap">
    <div className="hero-copy">
      <div className="eyebrow"><span/> THE ODC VICTORS COLLECTION</div>
      <h1>Handcrafted<br/>for <em>Comfort.</em></h1>
      <p>Leather essentials made with intention. Find your everyday pair, crafted by hand and made to move with you.</p>
      <div className="hero-actions">
        <Link className="btn btn-dark" href="/shop">Shop the collection <ArrowUpRight size={17}/></Link>
        <Link className="text-link" href="/about">Discover our story ↗</Link>
      </div>
      <div className="hero-proof"><span><b>01</b> Made by hand</span><span><b>02</b> Made for you</span></div>
    </div>
    <div className="hero-visual">
      <div className="hero-image">
        <img
          src={heroProduct?.images?.[0] || "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85"}
          alt={heroProduct?.name || "ODC Victors Handmade"}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="hero-stamp"><span>CRAFTED</span><b>WITH CARE</b><small>PORT HARCOURT · NIGERIA</small></div>
      <div className="image-caption">THE EVERYDAY EDIT <span>— 01 / 08</span></div>
    </div>
  </section>

  <section className="ticker"><div>MADE BY HAND <span>✳</span> BUILT FOR COMFORT <span>✳</span> LEATHER THAT LASTS <span>✳</span> MADE BY HAND <span>✳</span> BUILT FOR COMFORT <span>✳</span></div></section>

  <section className="section wrap">
    <div className="section-heading">
      <div><div className="eyebrow">A FEW FAVOURITES</div><h2>Considered essentials.</h2><p>Pieces you'll reach for, season after season.</p></div>
      <Link className="text-link" href="/shop">Shop all products <ArrowUpRight size={16}/></Link>
    </div>
    <div className="product-grid">{products.slice(0,4).map(p=><ProductCard key={p.id} product={p}/>)}</div>
  </section>

  <section className="category-band">
    <div className="wrap category-inner">
      <div>
        <div className="eyebrow light">YOUR NEXT EVERYDAY FAVOURITE</div>
        <h2>Good leather.<br/><em>Better living.</em></h2>
        <p>From the morning commute to the moments worth dressing up for.</p>
        <Link href="/shop" className="btn btn-cream">Explore the collection <ArrowUpRight size={17}/></Link>
      </div>
      <div className="category-list">
        {[
          ["01","Shoes","A sharper step"],
          ["02","Sandals & Pams","Easy, everyday comfort"],
          ["03","Belts & Wallets","The finishing touches"]
        ].map(([n,t,s])=>
          <Link href={`/shop?category=${encodeURIComponent(t.startsWith("Sandals")?"Sandals":t.startsWith("Belts")?"Belts":t)}`} key={n}>
            <span>{n}</span><div><b>{t}</b><small>{s}</small></div><ArrowUpRight/>
          </Link>
        )}
      </div>
    </div>
  </section>

  <section className="section wrap">
    <div className="section-heading">
      <div><div className="eyebrow">THE MOST LOVED</div><h2>Made to be worn.</h2><p>Customer favourites, crafted one piece at a time.</p></div>
      <Link href="/shop" className="text-link">View all <ArrowUpRight size={16}/></Link>
    </div>
    <div className="product-grid">{products.slice(4,8).map(p=><ProductCard key={p.id} product={p}/>)}</div>
  </section>

  <section className="why-section">
    <div className="wrap">
      <div className="eyebrow">THE ODC DIFFERENCE</div>
      <h2>Made thoughtfully.<br/><em>Worn confidently.</em></h2>
      <div className="why-grid">
        <div><HandHeart/><h3>Handmade with care</h3><p>Every piece gets a personal touch, with close attention to finish and detail.</p></div>
        <div><ShieldCheck/><h3>Quality that shows</h3><p>Carefully selected materials and timeless designs for repeat wear.</p></div>
        <div><Truck/><h3>Delivered to you</h3><p>We deliver from Port Harcourt to customers across Nigeria.</p></div>
        <div><Check/><h3>Here to help</h3><p>Need a fit check? Reach out and we'll help you choose with confidence.</p></div>
      </div>
    </div>
  </section>

  <section className="bottom-cta wrap">
    <div><div className="eyebrow">YOUR STYLE, YOUR STORY</div><h2>Find your next favourite.</h2></div>
    <Link className="btn btn-dark" href="/shop">Shop ODC VICTORS <ArrowUpRight size={17}/></Link>
  </section>
  </>
  )
}