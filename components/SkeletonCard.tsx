export function SkeletonCard({ type = 'product' }: { type?: 'product' | 'content' }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      {type === 'product' && (
        <div className="w-full aspect-square bg-gray-200" />
      )}
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        {type === 'product' && (
          <div className="h-8 bg-gray-200 rounded w-1/3" />
        )}
      </div>
    </div>
  );
}

export function SkeletonProfileHeader() {
  return (
    <div className="text-center mb-8 animate-pulse">
      <div className="mb-4 flex justify-center">
        <div className="w-[120px] h-[120px] rounded-full bg-gray-200" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2" />
      <div className="h-5 bg-gray-200 rounded w-64 mx-auto" />
    </div>
  );
}

export function SkeletonSocialButtons() {
  return (
    <div className="flex justify-center gap-4 mb-8 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-14 h-14 rounded-full bg-gray-200" />
      ))}
    </div>
  );
}
