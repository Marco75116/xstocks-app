import { Bell, ChevronRight, HelpCircle, Shield, User } from "lucide-react";
import { ContentLayout } from "@/components/ContentLayout";
import { Card, CardContent } from "@/components/ui/card";

const settingsItems = [
  { icon: User, label: "Account" },
  { icon: Shield, label: "Security" },
  { icon: Bell, label: "Notifications" },
  { icon: HelpCircle, label: "Help & Support" },
];

export default function SettingsPage() {
  return (
    <ContentLayout>
      <div className="space-y-4">
        <h1 className="text-lg font-semibold">Settings</h1>

        <Card>
          <CardContent className="divide-y divide-border p-0">
            {settingsItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
