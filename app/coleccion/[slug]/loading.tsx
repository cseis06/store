export default function ProductLoading() {
  return (
    <div className="min-h-screen">
      <div className="container-kiren py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Skeleton de galería */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-16 h-20 lg:w-20 lg:h-24 bg-black/5 animate-pulse"
                />
              ))}
            </div>
            {/* Imagen principal */}
            <div className="flex-1 aspect-[3/4] bg-black/5 animate-pulse" />
          </div>

          {/* Skeleton de información */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="h-4 w-48 bg-black/5 animate-pulse rounded" />

            {/* Título */}
            <div className="space-y-2">
              <div className="h-8 w-3/4 bg-black/5 animate-pulse rounded" />
              <div className="h-8 w-1/2 bg-black/5 animate-pulse rounded" />
            </div>

            {/* Precio */}
            <div className="h-8 w-32 bg-black/5 animate-pulse rounded" />

            {/* Descripción */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-black/5 animate-pulse rounded" />
              <div className="h-4 w-full bg-black/5 animate-pulse rounded" />
              <div className="h-4 w-2/3 bg-black/5 animate-pulse rounded" />
            </div>

            {/* Tallas */}
            <div className="space-y-3">
              <div className="h-4 w-16 bg-black/5 animate-pulse rounded" />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 bg-black/5 animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Cantidad */}
            <div className="space-y-3">
              <div className="h-4 w-20 bg-black/5 animate-pulse rounded" />
              <div className="w-36 h-12 bg-black/5 animate-pulse" />
            </div>

            {/* Botones */}
            <div className="space-y-4">
              <div className="h-14 w-full bg-black/10 animate-pulse" />
              <div className="h-14 w-full bg-black/5 animate-pulse" />
            </div>

            {/* Acordeones */}
            <div className="space-y-0 border-t border-black/10 pt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 border-b border-black/10 flex items-center"
                >
                  <div className="h-4 w-40 bg-black/5 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton de relacionados */}
      <div className="container-kiren py-16 border-t border-black/10">
        <div className="h-8 w-64 bg-black/5 animate-pulse rounded mx-auto mb-12" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-black/5 animate-pulse" />
              <div className="h-4 w-3/4 bg-black/5 animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-black/5 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}