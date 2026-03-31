import { Plus } from "lucide-react";
import Link from "next/link";
import { BalanceHeader } from "@/components/BalanceHeader";
import { ContentLayout } from "@/components/ContentLayout";
import { CreateVaultCard } from "@/components/CreateVaultCard";

import { VaultCard } from "@/components/VaultCard";
import { VAULTS } from "@/lib/data";

export default function HomePage() {
  const totalBalance = VAULTS.reduce((sum, v) => sum + v.totalValue, 0);
  const totalDailyGain = VAULTS.reduce((sum, v) => sum + v.dailyGainAmount, 0);
  const totalDailyPercent =
    totalBalance > 0
      ? (totalDailyGain / (totalBalance - totalDailyGain)) * 100
      : 0;

  return (
    <ContentLayout>
      <div className="space-y-8">
        <BalanceHeader
          totalBalance={totalBalance}
          dailyGainAmount={totalDailyGain}
          dailyGainPercent={totalDailyPercent}
        />

        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Your Vaults</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VAULTS.map((vault) => (
              <VaultCard key={vault.id} vault={vault} />
            ))}
            <CreateVaultCard />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
