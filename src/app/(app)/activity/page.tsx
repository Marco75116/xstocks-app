import { ContentLayout } from "@/components/ContentLayout";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TRANSACTIONS } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/formatters";

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <Badge
        variant="secondary"
        className="border-positive/20 bg-positive/10 text-positive"
      >
        Completed
      </Badge>
    );
  }
  if (status === "pending") {
    return <Badge variant="secondary">Pending</Badge>;
  }
  return <Badge variant="destructive">Failed</Badge>;
}

export default function ActivityPage() {
  return (
    <ContentLayout>
      <div className="space-y-4">
        <h1 className="text-lg font-semibold">Activity</h1>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TRANSACTIONS.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-mono font-medium">
                  {tx.ticker}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={tx.type === "buy" ? "secondary" : "destructive"}
                    className={
                      tx.type === "buy"
                        ? "border-positive/20 bg-positive/10 text-positive"
                        : undefined
                    }
                  >
                    {tx.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(tx.date)}
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">
                  {tx.shares.toFixed(4)}
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {formatCurrency(tx.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <StatusBadge status={tx.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  );
}
