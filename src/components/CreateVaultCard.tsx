import { Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function CreateVaultCard() {
  return (
    <Link href="/vault/new" className="h-full">
      <Card className="h-full transition-colors hover:border-primary hover:bg-muted/50">
        <CardContent className="flex h-full items-center justify-center gap-3 p-6">
          <div className="rounded-xl bg-primary/10 p-3">
            <Plus className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Create Vault</p>
            <p className="text-xs text-muted-foreground">
              Build a new automated strategy
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
