import ProductDetailClient from './ProductDetailClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`,
      { next: { revalidate: 60 } }
    )

    const data = await res.json()
    const product = data?.data || data

const image =
  product?.images?.[0] && product.images[0].startsWith('http')
    ? product.images[0]
    : null

    return {
      title: `${product?.name || 'Product'} — Shop Ease`,
      description: product?.description || 'Luxury shopping experience',

     openGraph: {
 title: product?.name || 'Product',
description: product?.description || 'Luxury shopping experience',
  url: `https://shop-ease-eosin-kappa.vercel.app/shop/${params.id}`,
  images: image
  ? [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: product?.name,
      },
    ]
  : []
},

      twitter: {
        card: 'summary_large_image',
        title: product?.name || 'Shop Ease',
        description: product?.description || '',
        images: [image],
      },
    }
  } catch {
    return {
      title: 'Shop Ease',
      description: 'Luxury shopping experience',
    }
  }
}

export default function Page() {
  return <ProductDetailClient />
}