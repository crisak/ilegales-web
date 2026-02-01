import { fetchLivePrice } from '@/lib/api'
import { formatPrice } from '@/lib/utils/format'

interface LivePriceProps {
  productId: string
  basePrice: number
}

// LivePrice: Componente que muestra el precio en "tiempo real".
// NO usa 'use cache', por lo que es dinamico y se renderiza como "hole" en PPR.
// Se streamea en cada request - ideal para datos que cambian frecuentemente.
// En produccion real, fetchLivePrice llamaria a una API de precios en tiempo real.
export async function LivePrice({ productId, basePrice }: LivePriceProps) {
  // Llamar a la API de precios (simulada con delay)
  const { price: livePrice, variation } = await fetchLivePrice(
    productId,
    basePrice
  )

  // Determinar si hay descuento o aumento
  const priceDiff = livePrice - basePrice
  const hasDiscount = priceDiff < 0
  const hasIncrease = priceDiff > 0

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Precio actual:</span>
        {/* aria-live="polite": Anuncia cambios a lectores de pantalla */}
        <span aria-live="polite" className="text-2xl font-bold">
          {formatPrice(livePrice)}
        </span>
      </div>

      {/* Indicador de cambio */}
      {(hasDiscount || hasIncrease) && (
        <p
          className={`text-xs ${hasDiscount ? 'text-green-500' : 'text-red-500'}`}
        >
          {hasDiscount ? '↓' : '↑'} {formatPrice(Math.abs(priceDiff))} vs precio
          base ({(variation * 100).toFixed(1)}%)
        </p>
      )}

      <p className="text-muted-foreground text-xs">
        💡 El precio puede variar. Este es el precio en tiempo real.
      </p>
    </div>
  )
}
