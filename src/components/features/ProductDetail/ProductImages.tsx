import Image from 'next/image'

interface ProductImagesProps {
  images: string[]
  productName: string
}

// ProductImages: Galeria de imagenes del producto.
// Server Component - muestra la primera imagen grande y thumbnails.
// Para una galeria interactiva, usar ImageGallery (Client Component).
export function ProductImages({ images, productName }: ProductImagesProps) {
  const mainImage = images[0] ?? '/placeholder.svg'

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="bg-card border-border relative aspect-square overflow-hidden rounded-lg border">
        <Image
          src={mainImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className="bg-card border-border relative aspect-square overflow-hidden rounded-md border"
            >
              <Image
                src={image}
                alt={`${productName} - imagen ${index + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 12vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
