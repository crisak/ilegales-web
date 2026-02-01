import { fetchLiveStock } from '@/lib/api'

interface StockLevelProps {
  productId: string
  baseStock: number
}

// StockLevel: Componente que muestra el stock en "tiempo real".
// NO usa 'use cache', por lo que es dinamico y se renderiza como "hole" en PPR.
// Se streamea en cada request - ideal para datos que cambian frecuentemente.
// En produccion real, fetchLiveStock llamaria a una API de inventario.
export async function StockLevel({ productId, baseStock }: StockLevelProps) {
  // Llamar a la API de stock (simulada con delay)
  const { stock: liveStock, status } = await fetchLiveStock(
    productId,
    baseStock
  )

  // Configuracion visual segun estado
  const statusConfig = {
    out_of_stock: {
      label: 'Agotado',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      icon: '✕',
    },
    low_stock: {
      label: `¡Solo ${liveStock} unidades!`,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      icon: '⚠',
    },
    in_stock: {
      label: 'En stock',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      icon: '✓',
    },
  }

  const config = statusConfig[status]

  return (
    <div className="space-y-2">
      {/* Badge de estado */}
      {/* aria-live="polite": Anuncia cambios a lectores de pantalla */}
      <div
        aria-live="polite"
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${config.bgColor}`}
      >
        <span aria-hidden="true">{config.icon}</span>
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Cantidad disponible */}
      {liveStock > 0 && (
        <p className="text-muted-foreground text-xs">
          {liveStock} unidades disponibles
        </p>
      )}

      <p className="text-muted-foreground text-xs">
        📦 Stock actualizado en tiempo real
      </p>
    </div>
  )
}
