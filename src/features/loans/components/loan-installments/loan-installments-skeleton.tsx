import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoanInstallmentsSkeleton() {
  return (
    <Card className="border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader className="gap-4 px-2 sm:px-6">
        <Skeleton className="h-9 w-40" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-2 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}
