import { createClient } from "@/lib/supabase/server"

// Formatear fecha
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-PY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

async function getCustomers() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      orders (count)
    `)
    .eq("role", "customer")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }

  return data || []
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
          Clientes
        </h1>
        <p className="font-inter text-neutral-500 mt-1">
          {customers.length} clientes registrados
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-inter font-medium text-neutral-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-inter font-medium text-neutral-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-inter font-medium text-neutral-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-inter font-medium text-neutral-500 uppercase tracking-wider">
                    Pedidos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-inter font-medium text-neutral-500 uppercase tracking-wider">
                    Registrado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customers.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center">
                          <span className="font-inter text-sm font-medium text-neutral-600">
                            {(customer.full_name || customer.email || "?").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-inter text-sm font-medium text-neutral-900">
                          {customer.full_name || "(Sin nombre)"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-inter text-sm text-neutral-600">
                        {customer.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-inter text-sm text-neutral-600">
                        {customer.phone || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-inter text-sm text-neutral-600">
                        {customer.orders?.[0]?.count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-inter text-sm text-neutral-600">
                        {formatDate(customer.created_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-neutral-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <p className="font-inter text-neutral-500">No hay clientes registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}
