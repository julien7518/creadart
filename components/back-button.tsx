import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function BackButton({ href }: { href?: string }) {
  return (
    <Link href={href ?? "/"}>
      <Button variant="outline">
        <ArrowLeft />
        Retour
      </Button>
    </Link>
  );
}
