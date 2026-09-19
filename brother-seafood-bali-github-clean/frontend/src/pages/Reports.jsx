import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileSpreadsheet, CalendarDays } from "lucide-react";
import { api, idr } from "@/lib/api";
import { Button } from "@/components/ui/button";

const thisMonth = () => new Date().toISOString().slice(0, 7);
const label = (m) => (m ? new Date(`${m}-01T00:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "All time");

export default function Reports() {
  const [month, setMonth] = useState(thisMonth());
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.monthlyReport(month).then(setReport).catch(() => toast.error("Failed to load report"));
  }, [month]);

  const months = Array.from(new Set([thisMonth(), ...(report?.available_months || [])])).sort().reverse();
  const t = report?.totals;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-[.25em] text-[#C9A227] font-bold mb-2">Monthly payout</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1A1513]">Commission Report</h1>
          <p className="text-[#6E655F] mt-2 max-w-xl">Rekap komisi per travel agent per bulan — siap diunduh sebagai Excel untuk pembayaran.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 bg-white border border-[#E5DECF] rounded-full px-4 h-11">
            <CalendarDays className="w-4 h-4 text-[#8B1A1A]" />
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="bg-transparent text-sm font-bold outline-none" data-testid="report-month-select">
              <option value="">All time</option>
              {months.map((m) => <option key={m} value={m}>{label(m)}</option>)}
            </select>
          </div>
          <Button asChild className="bg-[#16A34A] hover:bg-[#15803D] text-white rounded-full px-6 h-11" data-testid="download-xlsx-btn">
            <a href={api.monthlyReportXlsxUrl(month)}><FileSpreadsheet className="w-4 h-4 mr-2" /> Download Excel</a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[["Visits", t?.visits ?? 0, "report-kpi-visits"], ["Pax", t?.pax ?? 0, "report-kpi-pax"], ["Total Commission", idr(t?.commission), "report-kpi-commission"], ["Still Unpaid", idr(t?.unpaid), "report-kpi-unpaid"]].map(([l, v, id], i) => (
          <div key={l} className={`rounded-xl p-5 border rise ${i === 3 ? "bg-[#1A1513] border-[#C9A227] text-[#FAF8F5]" : "bg-white border-[#E5DECF]"}`} data-testid={id}>
            <div className="text-[11px] uppercase tracking-[.18em] text-[#C9A227] font-bold">{l}</div>
            <div className="font-display text-2xl font-bold mt-1">{v}</div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl font-bold text-[#8B1A1A] mb-3">{label(month)} — per Travel Agent</h2>
      {!report ? (
        <p className="text-[#6E655F]">Loading…</p>
      ) : report.agents.length === 0 ? (
        <div className="bg-white border border-dashed border-[#C9A227] rounded-xl p-10 text-center text-[#6E655F] text-sm" data-testid="report-empty">Tidak ada kunjungan di periode ini.</div>
      ) : (
        <div className="bg-white border border-[#E5DECF] rounded-xl overflow-x-auto">
          <table className="w-full text-sm" data-testid="report-table">
            <thead className="bg-[#FDFBF5] text-[11px] uppercase tracking-wider text-[#6E655F]">
              <tr>{["Travel Agent", "Visits", "Pax", "Food", "Beverage", "Total Bill", "Commission", "Paid", "Unpaid"].map((h) => <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>
              {report.agents.map((a) => (
                <tr key={a.ta_name} className="border-t border-[#E5DECF] hover:bg-[#FDFBF5]/60" data-testid={`report-row-${a.ta_name}`}>
                  <td className="px-4 py-3 font-bold text-[#1A1513]">{a.ta_name}</td>
                  <td className="px-4 py-3">{a.visits}</td>
                  <td className="px-4 py-3">{a.pax}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{idr(a.food_bill)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{idr(a.beverage_bill)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{idr(a.bill)}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-[#8B1A1A]">{idr(a.commission)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#16A34A]">{idr(a.paid)}</td>
                  <td className={`px-4 py-3 whitespace-nowrap font-bold ${a.unpaid > 0 ? "text-[#D97706]" : "text-[#6E655F]"}`}>{idr(a.unpaid)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#C9A227] bg-[#FDFBF5] font-bold" data-testid="report-total-row">
                <td className="px-4 py-3 text-[#8B1A1A]">TOTAL</td>
                <td className="px-4 py-3">{t.visits}</td>
                <td className="px-4 py-3">{t.pax}</td>
                <td className="px-4 py-3 whitespace-nowrap">{idr(t.food_bill)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{idr(t.beverage_bill)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{idr(t.bill)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-[#8B1A1A]">{idr(t.commission)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-[#16A34A]">{idr(t.paid)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-[#D97706]">{idr(t.unpaid)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
