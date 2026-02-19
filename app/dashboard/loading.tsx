export default function Loading() {
  return (
    <div className="p-6 lg:p-8 w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-5 bg-gray-100 rounded w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-8 bg-gray-100 rounded w-16" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-8 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}
