import { ArrowRight, ChevronRight, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyVaultState() {
  return (
    <div className="flex flex-col items-center gap-6 pt-8">
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="rounded-xl bg-primary/10 p-5">
            <Lock className="size-8 text-primary" />
          </div>
        </div>
      </Card>

      <div className="space-y-1.5 text-center">
        <h2 className="text-lg font-semibold">Create your first Vault</h2>
        <p className="text-sm text-muted-foreground">
          Start growing your wealth on autopilot.
          <br />
          Secure your future with effortless strategies.
        </p>
      </div>

      <Button variant="outline" className="w-full max-w-xs gap-2" asChild>
        <Link href="/vault/new">
          Create a Vault
          <ArrowRight className="size-4" />
        </Link>
      </Button>

      <Card className="w-full">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Recommended for you
              </p>
              <p className="text-sm font-medium">Aggressive Growth Strategy</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
}
