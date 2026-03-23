"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function LoanLoadError() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <AlertCircle className="size-10 text-muted-foreground" aria-hidden />
        <div className="space-y-1">
          <p className="font-medium">No se pudo cargar el préstamo</p>
          <p className="text-sm text-muted-foreground">
            Comprueba la conexión o vuelve a la lista e inténtalo de nuevo.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/loans">Ir a préstamos</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
