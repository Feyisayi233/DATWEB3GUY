import { ListSkeleton } from "@/components/ui/ListSkeleton";

export default function AirdropsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-16">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
        <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
        <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="mb-8">
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="mb-6 flex justify-between">
        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <ListSkeleton count={12} />
    </div>
  );
}
