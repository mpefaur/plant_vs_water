export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
        <div className="h-10 w-28 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg overflow-hidden border bg-card">
            <div className="h-48 w-full bg-muted animate-pulse"></div>
            <div className="p-4 space-y-2">
              <div className="h-5 w-3/4 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}