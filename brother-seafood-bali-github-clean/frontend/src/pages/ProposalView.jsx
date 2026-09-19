import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Printer, Download, Pencil } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import ProposalDocument from "@/components/proposal/ProposalDocument";

export default function ProposalView() {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [settings, setSettings] = useState({ logo_path: null, gallery: [] });

  useEffect(() => {
    api.proposal(id).then(setProposal).catch(() => toast.error("Proposal not found"));
    api.settings().then(setSettings).catch(() => {});
  }, [id]);

  if (!proposal) return <div className="max-w-4xl mx-auto px-5 py-10 text-[#6E655F]" data-testid="proposal-loading">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-5 py-6 sm:py-10">
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#6E655F] hover:text-[#8B1A1A]" data-testid="back-to-dashboard">
          <ArrowLeft className="w-4 h-4" /> All proposals
        </Link>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-full border-[#C9A227]" data-testid="edit-proposal-btn">
            <Link to={`/proposals/${id}/edit`}><Pencil className="w-4 h-4 mr-1.5" /> Edit</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-[#C9A227]" data-testid="download-docx-btn">
            <a href={api.docxUrl(id)}><Download className="w-4 h-4 mr-1.5" /> Download DOCX</a>
          </Button>
          <Button onClick={() => window.print()} className="bg-[#8B1A1A] hover:bg-[#631010] text-white rounded-full" data-testid="print-pdf-btn">
            <Printer className="w-4 h-4 mr-1.5" /> Print / Save PDF
          </Button>
        </div>
      </div>
      <p className="no-print text-xs text-[#6E655F] mb-4">Tip: pada dialog print pilih "Save as PDF", ukuran A4, aktifkan "Background graphics".</p>
      <ProposalDocument proposal={proposal} settings={settings} />
    </div>
  );
}
