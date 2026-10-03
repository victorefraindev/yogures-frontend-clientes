import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Skeleton className="mb-8 h-4 w-48" />
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-20 w-28 rounded-2xl" />
            <Skeleton className="h-20 w-28 rounded-2xl" />
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}