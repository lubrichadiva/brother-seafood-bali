import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Trash2, ImagePlus } from "lucide-react";
import { api, fileUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [s, setS] = useState({ logo_path: null, gallery: [] });
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const logoRef = useRef();
  const galRef = useRef();

  useEffect(() => { api.settings().then(setS).catch(() => toast.error("Failed to load settings")); }, []);

  const run = async (fn, ok) => {
    setBusy(true);
    try { setS(await fn()); toast.success(ok); } catch (e) { toast.error(e?.response?.data?.detail || "Upload failed"); } finally { setBusy(false); }
  };

  const onLogo = (e) => { const f = e.target.files?.[0]; if (f) run(() => api.uploadLogo(f), "Logo updated"); e.target.value = ""; };
  const onGallery = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    for (const f of files) await run(() => api.uploadGallery(f, caption), `Added ${f.name}`);
    setCaption("");
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="text-xs uppercase tracking-[.25em] text-[#C9A227] font-bold mb-2">Branding</div>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1A1513] mb-8">Logo & Gallery</h1>

      <section className="bg-white border border-[#E5DECF] rounded-xl p-6 sm:p-8 mb-6 rise" data-testid="logo-section">
        <h2 className="font-display text-2xl font-bold text-[#8B1A1A] mb-1">Restaurant Logo</h2>
        <p className="text-sm text-[#6E655F] mb-5">Tampil di halaman depan proposal (web, PDF & DOCX). PNG transparan disarankan.</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-40 h-40 rounded-xl bg-[#1A1513] border border-[#C9A227]/50 flex items-center justify-center overflow-hidden">
            {s.logo_path ? <img src={fileUrl(s.logo_path)} alt="logo" className="max-w-full max-h-full object-contain p-3" data-testid="logo-preview" /> : <span className="text-[10px] uppercase tracking-widest text-[#C9A227]" data-testid="logo-empty">No logo</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={onLogo} data-testid="logo-file-input" />
            <Button onClick={() => logoRef.current.click()} disabled={busy} className="bg-[#8B1A1A] hover:bg-[#631010] text-white rounded-full" data-testid="upload-logo-btn"><Upload className="w-4 h-4 mr-2" /> Upload Logo</Button>
            {s.logo_path && <Button variant="outline" onClick={() => run(api.removeLogo, "Logo removed")} disabled={busy} className="rounded-full" data-testid="remove-logo-btn"><Trash2 className="w-4 h-4 mr-2" /> Remove</Button>}
          </div>
        </div>
      </section>

      <section className="bg-white border border-[#E5DECF] rounded-xl p-6 sm:p-8 rise" data-testid="gallery-section">
        <h2 className="font-display text-2xl font-bold text-[#8B1A1A] mb-1">Photo Gallery</h2>
        <p className="text-sm text-[#6E655F] mb-5">Foto dinner setup, welcome dance, horse riding, suasana malam, tim & owner. Bisa pilih banyak foto sekaligus.</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end mb-6">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="caption">Caption (optional, applied to selected photos)</Label>
            <Input id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Balinese welcome dance" data-testid="gallery-caption-input" />
          </div>
          <input ref={galRef} type="file" accept="image/*" multiple className="hidden" onChange={onGallery} data-testid="gallery-file-input" />
          <Button onClick={() => galRef.current.click()} disabled={busy} className="bg-[#C9A227] hover:bg-[#B08C1E] text-[#1A1513] rounded-full" data-testid="upload-gallery-btn"><ImagePlus className="w-4 h-4 mr-2" /> {busy ? "Uploading…" : "Add Photos"}</Button>
        </div>
        {s.gallery.length === 0 ? (
          <p className="text-sm text-[#6E655F] border border-dashed border-[#C9A227] rounded-xl p-8 text-center" data-testid="gallery-empty">Belum ada foto.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-testid="gallery-grid">
            {s.gallery.map((g) => (
              <figure key={g.id} className="group relative rounded-xl overflow-hidden border border-[#E5DECF] bg-[#FDFBF5]" data-testid={`gallery-item-${g.id}`}>
                <img src={fileUrl(g.path)} alt={g.caption} className="w-full aspect-[4/3] object-cover" />
                <figcaption className="text-xs px-3 py-2 text-[#6E655F] truncate">{g.caption || "—"}</figcaption>
                <button onClick={() => run(() => api.removeGallery(g.id), "Photo removed")} className="absolute top-2 right-2 bg-white/90 text-[#8B1A1A] rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`remove-gallery-${g.id}`}><Trash2 className="w-4 h-4" /></button>
              </figure>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
