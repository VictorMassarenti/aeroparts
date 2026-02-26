import { InventoryKpiCards } from "./_components/inventory-kpi-cards";
import { InventoryTable } from "./_components/inventory-table";

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <InventoryKpiCards />
      <InventoryTable />
    </div>
  );
}
