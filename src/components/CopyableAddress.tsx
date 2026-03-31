"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import { formatAddress } from "@/lib/formatters";

export function CopyableAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [address]);

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 font-mono font-medium transition-colors hover:text-muted-foreground"
    >
      <span>{formatAddress(address)}</span>
      {copied ? (
        <Check className="size-3.5 text-positive" />
      ) : (
        <Copy className="size-3.5 text-muted-foreground" />
      )}
    </button>
  );
}
