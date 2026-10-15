// src/lib/products.ts - NOW USING REAL SUPABASE DATA - FIXED
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Product = {
  id: string
  name: string
  slug: string
  category: string
  audience: string
  description: string
  price: number
  color: string
  sizes: number[]
  stock: number
  image_url: string
  images: string[]
  is_active: boolean
  image: string
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  if (!data) return []

  return data.map((p: any) => ({
    ...p,
    image: p.image_url || p.image || '',
    images: p.images || (p.image_url ? [p.image_url] : []),
    sizes: p.sizes || [],
  }))
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) {
    console.error('Error fetching product:', error)
    return null
  }

  return {
    ...data,
    image: data.image_url || data.image || '',
    images: data.images || (data.image_url ? [data.image_url] : []),
    sizes: data.sizes || [],
  }
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n)

export const seedProducts: Product[] = []