export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="h-4 w-24 bg-muted rounded animate-pulse mb-4"></div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <div className="relative rounded-lg overflow-hidden aspect-square mb-4 bg-muted animate-pulse"></div>
            <div className="flex gap-2 justify-center">
              <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="border rounded-lg p-6 bg-card">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                  <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                </div>

                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="h-5 w-28 bg-muted rounded animate-pulse mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>

                <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}