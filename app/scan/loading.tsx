export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="h-6 w-48 bg-muted rounded animate-pulse mb-6 mx-auto"></div>
        <div className="h-4 w-64 bg-muted rounded animate-pulse mb-6 mx-auto"></div>
        <div className="rounded-lg w-full h-96 bg-muted animate-pulse"></div>
      </div>
    </div>
  );
}