import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, idr } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CONTRACT_PER_PAX = 5000;
const today = () => new Date().toISOString().slice(0, 10);
const empty = () => ({ ta_name: "", date: today(), pax: 10, rate_type: "contract", package: "A", food_bill: "", beverage_bill: 0, uang_hadir: 80000, paid: false, notes: "" });

export default function VisitForm({ open, onOpenChange, onSaved, prices = { A: 150000, B: 180000, C: 220000 }, existingNames }) {
  const [f, setF] = useState(empty());
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) setF(empty()); }, [open]);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const isContract = f.rate_type === "contract";
  const pax = Number(f.pax) || 0;
  const suggested = pax * (prices[f.package] || 0);
  const food = f.food_bill === "" ? (isContract ? suggested : 0) : Number(f.food_bill);
  const commission = isContract
    ? CONTRACT_PER_PAX * pax
    : Math.round(food * 0.35) + Math.round(Number(f.beverage_bill) * 0.1) + Number(f.uang_hadir);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.ta_name.trim()) return toast.error("Travel agent name is required");
    setSaving(true);
    try {
      await api.createVisit({ ...f, pax, food_bill: food, beverage_bill: Number(f.beverage_bill), uang_hadir: Number(f.uang_hadir) });
      toast.success("Visit recorded");
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error("Failed to save visit");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-lg" data-testid="visit-dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-[#8B1A1A]">Record Group Visit</DialogTitle>
          <DialogDescription>Contract rate: IDR 5.000/pax. À la carte: 35% food + 10% minuman + uang hadir.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Travel Agent / PIC</Label>
            <Input list="ta-names" value={f.ta_name} onChange={set("ta_name")} placeholder="e.g. Mr. Xu" data-testid="visit-ta-name" />
            <datalist id="ta-names">{existingNames.map((n) => <option key={n} value={n} />)}</datalist>
          </div>
          <div className="grid grid-cols-2 gap-2" data-testid="visit-rate-type">
            {[["contract", "Contract Rate (Paket)"], ["alacarte", "À la carte / Non-contract"]].map(([k, label]) => (
              <button type="button" key={k} onClick={() => setF((s) => ({ ...s, rate_type: k }))}
                className={`rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${f.rate_type === k ? "bg-[#8B1A1A] text-white border-[#8B1A1A]" : "bg-white border-[#E5DECF] text-[#6E655F] hover:bg-[#FDFBF5]"}`}
                data-testid={`rate-type-${k}`}>{label}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={f.date} onChange={set("date")} data-testid="visit-date" /></div>
            <div className="space-y-1.5"><Label>Pax</Label><Input type="number" min="1" value={f.pax} onChange={set("pax")} data-testid="visit-pax" /></div>
            <div className="space-y-1.5">
              <Label>Package</Label>
              <select value={f.package} onChange={set("package")} disabled={!isContract} className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm disabled:opacity-50" data-testid="visit-package">
                {Object.entries(prices).map(([k, v]) => <option key={k} value={k}>{k} — {idr(v)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Food bill (pre-tax)</Label>
              <Input type="number" min="0" value={f.food_bill} onChange={set("food_bill")} placeholder={isContract ? suggested.toLocaleString("en-US") : "0"} data-testid="visit-food-bill" />
              {isContract && <p className="text-[11px] text-[#6E655F]">Auto: {pax} × {idr(prices[f.package])}</p>}
            </div>
            <div className="space-y-1.5"><Label>Beverage bill</Label><Input type="number" min="0" value={f.beverage_bill} onChange={set("beverage_bill")} data-testid="visit-bev-bill" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="space-y-1.5">
              <Label>Uang hadir (guide/driver)</Label>
              <Input type="number" min="0" value={isContract ? 0 : f.uang_hadir} disabled={isContract} onChange={set("uang_hadir")} data-testid="visit-uang-hadir" />
            </div>
            <label className="flex items-center gap-2 text-sm h-10 cursor-pointer">
              <input type="checkbox" checked={f.paid} onChange={(e) => setF((s) => ({ ...s, paid: e.target.checked }))} className="accent-[#8B1A1A] w-4 h-4" data-testid="visit-paid" /> Commission already paid
            </label>
          </div>
          <div className="space-y-1.5"><Label>Notes</Label><Input value={f.notes} onChange={set("notes")} placeholder="Guide name, bus number…" data-testid="visit-notes" /></div>
          <div className="bg-[#1A1513] text-[#FAF8F5] rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[.18em] text-[#C9A227] font-bold">{isContract ? `Commission (${pax} × IDR 5,000)` : "Total commission"}</span>
            <span className="font-display text-xl font-bold" data-testid="visit-commission-preview">{idr(commission)}</span>
          </div>
          <Button type="submit" disabled={saving} className="w-full bg-[#8B1A1A] hover:bg-[#631010] text-white rounded-full h-11" data-testid="save-visit-btn">
            {saving ? "Saving…" : "Save Visit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
