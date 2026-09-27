export default function Loading() {
  return (
    <div className="p-6 lg:p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">คำขอผู้เผยแพร่</h1>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-40 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-64" />
          </div>
        ))}
      </div>
    </div>
  );
}
