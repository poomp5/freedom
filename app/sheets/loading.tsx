import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";

function SheetCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-28 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 bg-gray-100 rounded-full" />
        <div className="h-5 w-3/4 bg-gray-100 rounded" />
        <div className="h-3 w-1/2 bg-gray-100 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="pt-3 border-t border-gray-50 flex justify-between">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-3 w-16 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-3" />
          <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-1" />
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mb-6" />
          <div className="h-11 bg-gray-100 rounded-xl animate-pulse mb-6" />

          <div className="flex gap-6 items-start">
            <aside className="hidden lg:block w-64 flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-5 space-y-4 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-4/5 bg-gray-100 rounded" />
                </div>
              ))}
            </aside>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SheetCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Bottombar />
    </>
  );
}
