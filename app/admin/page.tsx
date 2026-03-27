import Link from "next/link"
import { getDashboardStats } from "@/lib/admin"

// Formatear precio
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Formatear fecha
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-PY", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Colores de estado
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
          Dashboard
        </h1>
        <p className="font-inter text-neutral-500 mt-1">
          Resumen de tu tienda
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Ingresos */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <span className="font-inter text-xs text-neutral-500 uppercase tracking-wider">
              Ingresos (30 días)
            </span>
          </div>
          <p className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
            {formatPrice(stats.revenue)}
          </p>
        </div>

        {/* Pedidos */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <span className="font-inter text-xs text-neutral-500 uppercase tracking-wider">
              Pedidos totales
            </span>
          </div>
          <p className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
            {stats.orders}
          </p>
        </div>

        {/* Productos */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </div>
            <span className="font-inter text-xs text-neutral-500 uppercase tracking-wider">
              Productos activos
            </span>
          </div>
          <p className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
            {stats.products}
          </p>
        </div>

        {/* Clientes */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <span className="font-inter text-xs text-neutral-500 uppercase tracking-wider">
              Clientes
            </span>
          </div>
          <p className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
            {stats.customers}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors"
        >
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="font-inter text-sm text-neutral-700">Nuevo producto</span>
        </Link>

        <Link
          href="/admin/pedidos"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors"
        >
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
          </div>
          <span className="font-inter text-sm text-neutral-700">Ver pedidos</span>
        </Link>

        <Link
          href="/admin/categorias/nueva"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors"
        >
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="font-inter text-sm text-neutral-700">Nueva categoría</span>
        </Link>

        <Link
          href="/admin/banners/nuevo"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors"
        >
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="font-inter text-sm text-neutral-700">Nuevo banner</span>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-oswald text-lg font-semibold text-neutral-900">
            Últimos pedidos
          </h2>
          <Link
            href="/admin/pedidos"
            className="font-inter text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        {stats.recentOrders.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {stats.recentOrders.map((order: any) => (
              <Link
                key={order.id}
                href={`/admin/pedidos/${order.order_number}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-inter text-sm font-medium text-neutral-900">
                      {order.order_number}
                    </p>
                    <p className="font-inter text-xs text-neutral-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[order.status] || 'bg-neutral-100 text-neutral-600'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                  <span className="font-inter text-sm font-medium text-neutral-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="font-inter text-neutral-500">No hay pedidos todavía</p>
          </div>
        )}
      </div>
    </div>
  )
}
