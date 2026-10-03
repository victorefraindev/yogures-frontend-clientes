"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        No pudimos cargar este yogur
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Algo salió mal al traer el producto. Probá de nuevo.
      </p>
      <Button size="lg" className="mt-8" onClick={reset}>
        <RotateCcw data-icon="inline-start" />
        Intentar de nuevo
      </Button>
    </div>
  );
}