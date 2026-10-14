"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft, MessageCircle, Truck, ShieldCheck, Minus, Plus } from "lucide-react";
import { getProductBySlug, money, Product } from "@/lib/products";
import { useStore } from "@/components/store-provider";

const POPULAR_COLORS = [
  { name: "Black", hex: "#111111" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Tan", hex: "#D2B48C" },
  { name: "Dark Brown", hex: "#3C2415" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Navy", hex: "#001F3F" },
  { name: "Olive", hex: "#556B2F" },
  { name: "Grey", hex: "#808080" },
];

export default function ProductPage(){
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<number | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState("");
  const [customColor, setCustomColor] = useState("");

  const {add,wishlist,toggleWish} = useStore();
  const whats = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348000000000";

  useEffect(() => {
    if (params.slug) {
      getProductBySlug(params.slug as string).then(p => {
        if (p) {
          setProduct(p);
          setSize(p.sizes[0]);
          setColor(p.color);
        }
      });
    }
  }, [params.slug]);

  if (!product) return <div className="wrap page-pad"><p>Loading product...</p></div>;

  function addAndGo(){
    for(let i=0;i<qty;i++) add(product!, size);
    router.push("/cart")
  }

  const isWishlisted = wishlist.some(w => w.id === product.id);

  return (
  <div className="wrap page-pad">
    <Link href="/shop" className="back-link"><ArrowLeft size={16}/> Back to collection</Link>
    <div className="product-detail">
      <div className="detail-image">
        <img src={product.image_url} alt={product.name}/>
        <span className="detail-image-note">ODC VICTORS · HANDMADE</span>
      </div>
      <div className="detail-info">
        <div className="eyebrow">{product.category.toUpperCase()} / {product.audience.toUpperCase()}</div>
        <h1>{product.name}</h1>
        <div className="detail-price">{money(product.price)}</div>
        <p className="detail-desc">{product.description}</p>

        <div className="detail-options" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {/* COLOR SECTION */}
          <div>
            <label style={{ fontWeight: 600, marginBottom: '10px', display: 'block' }}>Colour: <b style={{ color: '#000' }}>{color}</b></label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              {POPULAR_COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  title={c.name}
                  style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: c.hex, border: color === c.name? '3px solid #111' : '2px solid #e5e5e5',
                    outline: color === c.name? '2px solid #fff' : 'none',
                    outlineOffset: color === c.name? '-6px' : '0',
                    cursor: 'pointer', boxShadow: color === c.name? '0 0 0 2px #111' : 'none',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Type preferred color e.g. Wine Red"
                value={customColor}
                onChange={e=>setCustomColor(e.target.value)}
                style={{ flex: 1, padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
              />
              <button
                onClick={() => { if(customColor.trim()){ setColor(customColor.trim()); setCustomColor(""); } }}
                className="btn"
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #111', background: '#111', color: '#fff', cursor: 'pointer' }}
              >
                Use
              </button>
            </div>
            {color &&!POPULAR_COLORS.find(c=>c.name===color) && (
              <small style={{ marginTop: '6px', display: 'block', color: '#666' }}>Custom selected: <b>{color}</b></small>
            )}
          </div>

          {/* SIZE */}
          {product.sizes.length > 0 && (
            <div>
              <label style={{ fontWeight: 600, marginBottom: '10px', display: 'block' }}>Size</label>
              <div className="size-options" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {product.sizes.map(s=>(
                  <button key={s} className={size===s?"selected":""} onClick={()=>setSize(s)} style={{ minWidth: '44px', height: '44px', borderRadius: '8px' }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* QTY - FIXED SPACING */}
          <div>
            <label style={{ fontWeight: 600, marginBottom: '10px', display: 'block' }}>Quantity</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #ddd', borderRadius: '12px', width: 'fit-content', padding: '6px' }}>
              <button
                onClick={()=>setQty(q=>Math.max(1,q-1))}
                style={{ width: '42px', height: '42px', borderRadius: '10px', border: '1px solid #e5e5e5', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Minus size={18}/>
              </button>
              <span style={{ minWidth: '36px', textAlign: 'center', fontWeight: 700, fontSize: '18px' }}>{qty}</span>
              <button
                onClick={()=>setQty(q=>q+1)}
                style={{ width: '42px', height: '42px', borderRadius: '10px', border: '1px solid #111', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Plus size={18}/>
              </button>
            </div>
          </div>
        </div>

        <div className="detail-actions" style={{ marginTop: '28px' }}>
          <button className="btn btn-dark" onClick={addAndGo}><ShoppingBag size={18}/> Add to cart — {money(product.price * qty)}</button>
          <button className={`btn btn-icon ${isWishlisted?"wishlisted":""}`} onClick={()=>toggleWish(product)}><Heart size={18}/></button>
        </div>

        <div className="detail-meta" style={{ display: 'flex', gap: '18px', flexDirection: 'column', marginTop: '20px' }}>
  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Truck size={16}/> Delivery across Nigeria
  </span>
  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <ShieldCheck size={16}/> Handmade with care
  </span>
</div>
      </div>
    </div>
  </div>
  )
}