export default function Loading() {
  return (
    <div className="p-6 lg:p-8 w-full space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">อัปโหลดชีท</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
        <div className="space-y-3">
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-10 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
