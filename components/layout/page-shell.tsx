import { ReactNode } from "react";
import BackButton from "@/components/back-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export default function PageShell({
  pageName,
  children,
  isHome,
}: {
  pageName: string;
  children: ReactNode;
  isHome: boolean;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div
          className={cn(
            "flex w-full p-2",
            isHome ? "justify-end" : "justify-between"
          )}
        >
          {isHome ? null : <BackButton />}
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold">{pageName}</h1>
      </div>
      {children}
    </div>
  );
}
