import Link from "next/link";
import { Drip } from "@/components/decor";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <span className="text-primary/20">
        <Drip className="size-24" />
      </span>
      <h1 className="mt-6 font-heading text-6xl font-bold text-foreground">
        404
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Se nos derramó la crema por aquí… La página que buscás no existe.
      </p>
      <Button size="lg" className="mt-8" render={<Link href="/" />}>
        Volver al inicio
      </Button>
    </div>
  );
}