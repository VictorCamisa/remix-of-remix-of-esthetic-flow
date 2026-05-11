import { useState } from "react";
import { TopTreatmentsChart } from "@/components/dashboard/TopTreatmentsChart";
import { RevenueOriginPieChart } from "@/components/dashboard/RevenueOriginPieChart";
import { MonthlyRevenueChart } from "@/components/dashboard/MonthlyRevenueChart";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { UpcomingPayments } from "@/components/dashboard/UpcomingPayments";
import { PageHeader } from "@/components/PageHeader";
import { Stat } from "@/components/ds";
import { useDashboardData } from "@/hooks/useDashboardData";
import { startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  const [period, setPeriod] = useState("month");

  const getPeriodDates = (p: string) => {
    const now = new Date();
    switch (p) {
      case "month": return { start: startOfMonth(now), end: endOfMonth(now) };
      case "quarter": return { start: subMonths(startOfMonth(now), 2), end: endOfMonth(now) };
      case "semester": return { start: subMonths(startOfMonth(now), 5), end: endOfMonth(now) };
      case "year": return { start: startOfYear(now), end: now };
      default: return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const { start, end } = getPeriodDates(period);
  const { kpis, charts } = useDashboardData({
    startDate: start, endDate: end, tratamentoIds: [], origemIds: [],
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Financeiro"
        title="Dashboard"
        description="Visão geral do desempenho financeiro"
        actions={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-8 w-[160px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mês atual</SelectItem>
              <SelectItem value="quarter">Últimos 3 meses</SelectItem>
              <SelectItem value="semester">Últimos 6 meses</SelectItem>
              <SelectItem value="year">Ano atual</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        <Stat label="Receita total" value={formatCurrency(kpis.receitaTotal)} delta={{ value: kpis.taxaCrescimentoReceita }} hint="vs anterior" className="border-0" />
        <Stat label="Despesas" value={formatCurrency(kpis.despesaTotal)} className="border-0" />
        <Stat label="Lucro líquido" value={formatCurrency(kpis.lucroLiquido)} delta={{ value: kpis.taxaCrescimentoLucro }} className="border-0" />
        <Stat label="Ticket médio" value={formatCurrency(kpis.ticketMedio)} className="border-0" />
      </div>

      <MonthlyRevenueChart />

      <div className="grid lg:grid-cols-2 gap-4">
        <TopTreatmentsChart data={charts.topTratamentosReceita} title="Top 5 tratamentos por receita" dataKey="receita" />
        <RevenueOriginPieChart data={charts.receitaPorOrigem} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <UpcomingPayments />
        <LowStockAlert />
      </div>
    </div>
  );
};

export default Dashboard;
