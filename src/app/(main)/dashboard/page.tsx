"use client";

import { DashboardStats } from "@/features/loans/components/dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-6 pb-10 p-2">
      <Card className="border-none shadow-none drop-shadow-none">
        <CardHeader className="px-4">
          <CardTitle className="line-clamp-1 text-xl">Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <DashboardStats />
        </CardContent>
      </Card>
    </div>
  );
}
