import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function BackButton() {
  return (
    <Link href="/">
      <Button variant="outline">
        <ArrowLeft />
        Retour
      </Button>
    </Link>
  );
}
