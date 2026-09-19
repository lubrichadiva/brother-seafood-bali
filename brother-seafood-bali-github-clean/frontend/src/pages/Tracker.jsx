import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Plus, FileSpreadsheet } from "lucide-react";
import { api, idr } from "@/lib/api";
import { Button } from "@/components/ui/button";
import VisitForm from "@/components/tracker/VisitForm";
import VisitsTable from "@/components/tracker/VisitsTable";

function Kpi({ label, value, testId, accent }) {
  return (
    <div className={`rounded-xl p-5 border rise ${accent ? "bg-[#1A1513] border-[#C9A227] text-[#FAF8F5]" : "bg-white border-[#E5DECF]"}`} data-testid={testId}>
      <div className="text-[11px] uppercase tracking-[.18em] text-[#C9A227] font-bold">{label}</div>
      <div className="font-display text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

export default function Tracker() {
  const [visits, setVisits] = useState([]);
  const [summary, setSummary] = useState(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const load = async () => {
    try {
      const [v, s] = await Promise.all([api.visits(), api.summary()]);
      setVisits(v);
      setSummary(s);
    } catch {
      toast.error("Failed to load tracker");
    }
  };
  useEffect(() => { load(); }, []);

  const togglePaid = async (v) => { await api.patchVisit(v.id, { paid: !v.paid }); load(); };
  const remove = async (v) => {
    if (!window.confirm("Delete this visit?")) return;
    await api.deleteVisit(v.id);
    toast.success("Visit deleted");
    load();
  };

  const t = summary?.totals || {};
  const shown = filter ? visits.filter((v) => v.ta_name === filter) : visits;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-[.25em] text-[#C9A227] font-bold mb-2">Loyalty & payouts</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1A1513]">Travel Agent Tracker</h1>
          <p className="text-[#6E655F] mt-2 max-w-xl">Catat setiap rombongan: TA mana, berapa pax, bill, dan komisi (contract rate IDR 5.000/pax, atau à la carte 35% food + 10% minuman + uang hadir).</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-full border-[#C9A227] h-11" data-testid="go-reports-btn">
            <Link to="/reports"><FileSpreadsheet className="w-4 h-4 mr-2" /> Monthly Report</Link>
          </Button>
          <Button onClick={() => setOpen(true)} className="bg-[#8B1A1A] hover:bg-[#631010] text-white rounded-full px-6 h-11" data-testid="add-visit-btn">
            <Plus className="w-4 h-4 mr-2" /> Add Visit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi label="Visits" value={t.visits ?? 0} testId="kpi-visits" />
        <Kpi label="Total Pax" value={t.pax ?? 0} testId="kpi-pax" />
        <Kpi label="Total Bill" value={idr(t.bill)} testId="kpi-bill" />
        <Kpi label="Commission Unpaid" value={idr(t.unpaid)} testId="kpi-unpaid" accent />
      </div>

      <h2 className="font-display text-2xl font-bold text-[#8B1A1A] mb-3">Per Travel Agent</h2>
      {summary?.agents?.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10" data-testid="ta-summary-grid">
          {summary.agents.map((a, i) => (
            <button
              key={a.ta_name}
              onClick={() => setFilter(filter === a.ta_name ? "" : a.ta_name)}
              className={`text-left bg-white rounded-xl p-5 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,162,39,.15)] rise ${filter === a.ta_name ? "border-[#8B1A1A] ring-2 ring-[#C9A227]/40" : "border-[#E5DECF]"}`}
              style={{ animationDelay: `${i * 40}ms` }}
              data-testid={`ta-card-${a.ta_name}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold text-[#1A1513]">{a.ta_name}</span>
                {i === 0 && <span className="text-[10px] uppercase tracking-widest bg-[#C9A227] text-[#1A1513] font-bold px-2 py-0.5 rounded-full">Top TA</span>}
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm mt-3">
                <dt className="text-[#6E655F]">Visits</dt><dd className="font-bold text-right">{a.visits}</dd>
                <dt className="text-[#6E655F]">Pax</dt><dd className="font-bold text-right">{a.pax}</dd>
                <dt className="text-[#6E655F]">Bill</dt><dd className="font-bold text-right">{idr(a.bill)}</dd>
                <dt className="text-[#6E655F]">Commission</dt><dd className="font-bold text-right text-[#8B1A1A]">{idr(a.commission)}</dd>
                <dt className="text-[#6E655F]">Unpaid</dt><dd className={`font-bold text-right ${a.unpaid > 0 ? "text-[#D97706]" : "text-[#16A34A]"}`}>{idr(a.unpaid)}</dd>
                <dt className="text-[#6E655F]">Last visit</dt><dd className="text-right">{a.last_visit}</dd>
              </dl>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#6E655F] mb-10" data-testid="ta-summary-empty">Belum ada kunjungan tercatat.</p>
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-2xl font-bold text-[#8B1A1A]">Visit Log {filter && <span className="text-base text-[#6E655F] font-normal">— {filter}</span>}</h2>
        {filter && <Button variant="ghost" size="sm" onClick={() => setFilter("")} data-testid="clear-filter-btn">Clear filter</Button>}
      </div>
      <VisitsTable visits={shown} onTogglePaid={togglePaid} onDelete={remove} />

      <VisitForm open={open} onOpenChange={setOpen} onSaved={load} prices={summary?.package_prices} existingNames={summary?.agents?.map((a) => a.ta_name) || []} />
    </div>
  );
}
