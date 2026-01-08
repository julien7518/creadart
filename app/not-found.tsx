import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen mx-auto  py-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>404 - Not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Ah là tu t'es perdu(e) là, je reconnais</p>
          <Link href="/">
            <Button className="w-full mt-4">Retour à l'accueil</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
