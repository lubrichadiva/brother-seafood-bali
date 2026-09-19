import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "@/lib/api";
import { BRAND } from "@/content/proposalContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const empty = { client_name: "", client_contact: "", contact_type: "WeChat", date: "", prepared_by: BRAND.preparedBy, notes: "" };

export default function ProposalForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) api.proposal(id).then((p) => setForm({ ...empty, ...p })).catch(() => toast.error("Proposal not found"));
  }, [id]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.client_name.trim()) return toast.error("Travel agent / PIC name is required");
    setSaving(true);
    try {
      const saved = id ? await api.updateProposal(id, form) : await api.createProposal(form);
      toast.success(id ? "Proposal updated" : "Proposal created");
      nav(`/proposals/${saved.id}`);
    } catch {
      toast.error("Failed to save proposal");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 rise">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#6E655F] hover:text-[#8B1A1A] mb-6" data-testid="back-to-dashboard">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <div className="text-xs uppercase tracking-[.25em] text-[#C9A227] font-bold mb-2">{id ? "Edit" : "New"} proposal</div>
      <h1 className="font-display text-4xl font-bold text-[#1A1513] mb-8">Who is this proposal for?</h1>

      <form onSubmit={submit} className="bg-white border border-[#E5DECF] rounded-xl p-6 sm:p-8 space-y-6" data-testid="proposal-form">
        <div className="space-y-2">
          <Label htmlFor="client_name">Travel Agent / PIC Name *</Label>
          <Input id="client_name" value={form.client_name} onChange={set("client_name")} placeholder="e.g. Mr. Xu" data-testid="input-client-name" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_type">Contact type</Label>
            <select id="contact_type" value={form.contact_type} onChange={set("contact_type")} className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm" data-testid="select-contact-type">
              {["WeChat", "WhatsApp", "Email", "Phone"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="client_contact">Contact</Label>
            <Input id="client_contact" value={form.client_contact} onChange={set("client_contact")} placeholder="e.g. KOABY805" data-testid="input-client-contact" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Proposal date</Label>
            <Input id="date" type="date" value={form.date} onChange={set("date")} data-testid="input-date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prepared_by">Prepared by</Label>
            <Input id="prepared_by" value={form.prepared_by} onChange={set("prepared_by")} data-testid="input-prepared-by" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Special notes (optional, shown after T&C)</Label>
          <Textarea id="notes" rows={3} value={form.notes} onChange={set("notes")} placeholder="e.g. Loyalty bonus: extra 5% commission after 10 groups / month" data-testid="input-notes" />
        </div>
        <p className="text-xs text-[#6E655F]">Rates, commission, facilities and T&C are universal and included automatically.</p>
        <Button type="submit" disabled={saving} className="bg-[#8B1A1A] hover:bg-[#631010] text-white rounded-full px-8 h-11" data-testid="save-proposal-btn">
          <Save className="w-4 h-4 mr-2" /> {saving ? "Saving…" : "Save & Preview"}
        </Button>
      </form>
    </div>
  );
}
