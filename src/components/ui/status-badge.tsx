import { InvoiceStatus } from "@prisma/client";
import { CheckCircle2, Clock, Eye, DollarSign, AlertCircle, XCircle, FileText } from "lucide-react";

const statusConfig: Record<
  InvoiceStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
    dotColor: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    icon: FileText,
    className: "bg-gray-100 text-gray-700 border-gray-200",
    dotColor: "bg-gray-400",
  },
  SENT: {
    label: "Sent",
    icon: Clock,
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  VIEWED: {
    label: "Viewed",
    icon: Eye,
    className: "bg-purple-50 text-purple-700 border-purple-200",
    dotColor: "bg-purple-500",
  },
  PARTIALLY_PAID: {
    label: "Partially paid",
    icon: DollarSign,
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
  },
  PAID: {
    label: "Paid",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  OVERDUE: {
    label: "Overdue",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 border-red-200",
    dotColor: "bg-red-500",
  },
  VOID: {
    label: "Void",
    icon: XCircle,
    className: "bg-gray-100 text-gray-500 border-gray-200",
    dotColor: "bg-gray-400",
  },
};

interface StatusBadgeProps {
  status: InvoiceStatus;
  showIcon?: boolean;
  showDot?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({
  status,
  showIcon = false,
  showDot = true,
  size = "md",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  const iconSizes = {
    sm: "size-3",
    md: "size-3.5",
    lg: "size-4",
  };

  const dotSizes = {
    sm: "size-1.5",
    md: "size-2",
    lg: "size-2.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${config.className} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span
          className={`${config.dotColor} ${dotSizes[size]} rounded-full`}
          aria-hidden="true"
        />
      )}
      {showIcon && <Icon className={iconSizes[size]} aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
}
