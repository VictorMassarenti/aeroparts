import { Badge } from "@/components/ui/badge";
import type { APStatus, ARStatus, InvoiceStatus, POStatus, QuoteStatus } from "@/stores/aero/types";

type Status = QuoteStatus | InvoiceStatus | POStatus | APStatus | ARStatus;

interface StatusConfig {
  variant: "default" | "secondary" | "destructive" | "outline";
}

const statusConfigs: Record<string, StatusConfig> = {
  // Quote statuses
  Draft: { variant: "outline" },
  Sent: { variant: "secondary" },
  Won: { variant: "default" },
  Lost: { variant: "destructive" },

  // Invoice statuses
  Issued: { variant: "secondary" },
  Paid: { variant: "default" },
  Overdue: { variant: "destructive" },
  Cancelled: { variant: "outline" },

  // PO statuses
  Shipped: { variant: "secondary" },
  Received: { variant: "default" },
  Closed: { variant: "outline" },

  // AP/AR statuses
  Pending: { variant: "outline" },
  Partial: { variant: "secondary" },
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfigs[status] || { variant: "outline" };
  return (
    <Badge variant={config.variant} className="px-1.5">
      {status}
    </Badge>
  );
}
