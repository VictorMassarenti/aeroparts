import { BillingOverview } from "./_components/billing-overview";
import { FinancialKpiCards } from "./_components/financial-kpi-cards";
import { MarginAnalysis } from "./_components/margin-analysis";
import { PayablesAging } from "./_components/payables-aging";
import { ReceivablesAging } from "./_components/receivables-aging";

export default function FinancialPage() {
  return (
    <div className="flex flex-col gap-4">
      <FinancialKpiCards />
      <div className="grid gap-4 lg:grid-cols-2">
        <BillingOverview />
        <ReceivablesAging />
        <MarginAnalysis />
        <PayablesAging />
      </div>
    </div>
  );
}
