import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Eye, Pencil, Trash2, Download, Users, Wallet, FileText, Footprints } from "lucide-react";
import { api, idr } from "@/lib/api";
import { Button } from "@/components/ui/button";

function Stat({ icon: Icon, label, value, testId }) {
  return (
    <div className="bg-white border border-[#E5DECF] rounded-xl p-5 flex items-center gap-4 rise" data-testid={testId}>
      <span className="w-11 h-11 rounded-full bg-[#FDFBF5] border border-[#C9A227]/40 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#8B1A1A]" />
      </span>
      <div>
        <div className="text-[11px] uppercase tracking-[.18em] text-[#C9A227] font-bold">{label}</div>
        <div className="font-display text-xl font-bold text-[#1A1513]">{value}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [proposals, setProposals] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [p, s] = await Promise.all([api.proposals(), api.summary()]);
      setProposals(p);
      setSummary(s);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (p) => {
    if (!window.confirm(`Delete proposal for ${p.client_name}?`)) return;
    await api.deleteProposal(p.id);
    toast.success("Proposal deleted");
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-xs uppercase tracking-[.25em] text-[#C9A227] font-bold mb-2">Kedonganan Beach · Bali</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1A1513]">Proposals</h1>
          <p className="text-[#6E655F] mt-2 max-w-xl">Buat proposal kerjasama per travel agent, lihat versi cetak A4, lalu unduh PDF atau DOCX.</p>
        </div>
        <Button asChild className="bg-[#8B1A1A] hover:bg-[#631010] text-white rounded-full px-6 h-11" data-testid="new-proposal-btn">
          <Link to="/proposals/new"><Plus className="w-4 h-4 mr-2" /> New Proposal</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Stat icon={FileText} label="Proposals" value={proposals.length} testId="stat-proposals" />
        <Stat icon={Footprints} label="Group Visits" value={summary?.totals.visits ?? 0} testId="stat-visits" />
        <Stat icon={Users} label="Total Pax" value={summary?.totals.pax ?? 0} testId="stat-pax" />
        <Stat icon={Wallet} label="Commission Unpaid" value={idr(summary?.totals.unpaid ?? 0)} testId="stat-unpaid" />
      </div>

      {loading ? (
        <div className="text-[#6E655F]" data-testid="proposals-loading">Loading…</div>
      ) : proposals.length === 0 ? (
        <div className="bg-white border border-dashed border-[#C9A227] rounded-xl p-12 text-center" data-testid="proposals-empty">
          <p className="font-display text-xl text-[#1A1513]">No proposals yet</p>
          <p className="text-[#6E655F] text-sm mt-1">Create your first travel agent proposal.</p>
        </div>
      ) : (
        <ul className="space-y-3" data-testid="proposals-list">
          {proposals.map((p, i) => (
            <li
              key={p.id}
              className="bg-white border border-[#E5DECF] rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 rise transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,162,39,.15)]"
              style={{ animationDelay: `${i * 50}ms` }}
              data-testid={`proposal-card-${p.id}`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase tracking-[.18em] text-[#C9A227] font-bold">Prepared for</div>
                <div className="font-display text-2xl font-bold text-[#1A1513] truncate" data-testid="proposal-client-name">{p.client_name}</div>
                <div className="text-sm text-[#6E655F]">
                  {p.client_contact ? `${p.contact_type}: ${p.client_contact} · ` : ""}
                  {p.date ? `Date: ${p.date}` : "Date: —"}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" className="rounded-full border-[#C9A227] text-[#1A1513]" data-testid={`view-proposal-${p.id}`}>
                  <Link to={`/proposals/${p.id}`}><Eye className="w-4 h-4 mr-1.5" /> View / PDF</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full" data-testid={`docx-proposal-${p.id}`}>
                  <a href={api.docxUrl(p.id)}><Download className="w-4 h-4 mr-1.5" /> DOCX</a>
                </Button>
                <Button asChild variant="ghost" className="rounded-full" data-testid={`edit-proposal-${p.id}`}>
                  <Link to={`/proposals/${p.id}/edit`}><Pencil className="w-4 h-4" /></Link>
                </Button>
                <Button variant="ghost" className="rounded-full text-[#8B1A1A] hover:bg-[#FDF2F2]" onClick={() => remove(p)} data-testid={`delete-proposal-${p.id}`}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
