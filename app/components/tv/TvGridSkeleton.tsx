export default function TvGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={index} className="card bg-base-100 shadow-lg">
          <figure className="relative aspect-[2/3] overflow-hidden">
            <div className="skeleton w-full h-full"></div>
          </figure>
          
          <div className="card-body p-4 space-y-2">
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-3 w-2/3"></div>
            <div className="skeleton h-3 w-full"></div>
            <div className="skeleton h-3 w-4/5"></div>
            
            <div className="card-actions justify-end mt-3">
              <div className="skeleton h-6 w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
