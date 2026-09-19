import * as Icons from "lucide-react";
import { fileUrl } from "@/lib/api";
import * as C from "@/content/proposalContent";
import { PackagesSection, CommissionSection } from "@/components/proposal/TableSections";

export function SectionTitle({ children, testId }) {
  return (
    <div className="mb-4" data-testid={testId}>
      <h2 className="font-display text-lg sm:text-xl font-bold text-[#8B1A1A] leading-snug">{children}</h2>
      <div className="gold-rule mt-1.5" />
    </div>
  );
}

export function Notes({ lines }) {
  return (
    <div className="mt-3 border-l-2 border-[#C9A227] pl-3 space-y-0.5">
      {lines.map((l) => <p key={l} className="text-xs italic text-[#6E655F]">{l}</p>)}
    </div>
  );
}

function IconList({ items, cols = 1 }) {
  return (
    <ul className={`grid gap-2 ${cols === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((it) => {
        const Icon = Icons[it.icon] || Icons.Dot;
        return (
          <li key={it.text} className="flex items-start gap-3 text-sm">
            <span className="mt-0.5 w-6 h-6 rounded-full bg-[#FDF2F2] border border-[#8B1A1A]/20 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-[#8B1A1A]" />
            </span>
            <span>{it.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

function Cover({ proposal, logo }) {
  const contact = proposal.client_contact ? ` (${proposal.contact_type}: ${proposal.client_contact})` : "";
  return (
    <div className="text-center doc-section" data-testid="doc-cover">
      {logo ? (
        <img src={fileUrl(logo)} alt="Brother Seafood Bali logo" className="mx-auto h-28 sm:h-36 object-contain mb-4" data-testid="doc-logo" />
      ) : (
        <div className="mx-auto w-28 h-28 rounded-full border-2 border-dashed border-[#C9A227] flex items-center justify-center text-[10px] uppercase tracking-widest text-[#C9A227] mb-4" data-testid="doc-logo-placeholder">Logo</div>
      )}
      <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#8B1A1A] tracking-wide">{C.BRAND.name}</h1>
      <p className="font-display italic text-[#C9A227] mt-2 text-sm sm:text-base">{C.BRAND.taglineEn}</p>
      <p className="font-display italic text-[#C9A227] text-sm sm:text-base">{C.BRAND.taglineZh}</p>
      <div className="gold-rule my-6 mx-auto max-w-xs" />
      <p className="font-display text-xl sm:text-2xl font-bold text-[#1A1513]">{C.BRAND.docTitle}</p>
      <p className="text-sm font-bold text-[#6E655F] tracking-wide">{C.BRAND.docSubtitle}</p>
      <div className="mt-6 inline-block text-left text-sm bg-[#FDFBF5] border border-[#C9A227]/40 rounded-lg px-6 py-4 space-y-1">
        <p><span className="font-bold text-[#8B1A1A]">Prepared for:</span> <span data-testid="doc-client-name">{proposal.client_name}{contact}</span></p>
        <p><span className="font-bold text-[#8B1A1A]">Prepared by:</span> {proposal.prepared_by || C.BRAND.preparedBy}</p>
        <p><span className="font-bold text-[#8B1A1A]">Date:</span> <span data-testid="doc-date">{proposal.date || "_______________"}</span></p>
      </div>
    </div>
  );
}

function Gallery({ gallery }) {
  const items = gallery.length ? gallery : C.GALLERY_PLACEHOLDERS.map((cap) => ({ id: cap, caption: cap }));
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" data-testid="doc-gallery">
      {items.map((g) => (
        <figure key={g.id} className="rounded-lg overflow-hidden border border-[#E5DECF] bg-[#FDFBF5]">
          {g.path ? (
            <img src={fileUrl(g.path)} alt={g.caption} className="w-full aspect-[4/3] object-cover" />
          ) : (
            <div className="w-full aspect-[4/3] flex items-center justify-center text-[10px] uppercase tracking-widest text-[#C9A227] border-b border-dashed border-[#C9A227]">Photo</div>
          )}
          {g.caption && <figcaption className="text-[11px] italic text-[#6E655F] px-2 py-1.5">{g.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

export default function ProposalDocument({ proposal, settings }) {
  return (
    <article id="printable-proposal" className="doc-sheet bg-white border border-[#C9A227]/30 rounded-xl shadow-[0_20px_60px_rgba(26,21,19,.10)] p-6 sm:p-12 space-y-10 text-[#2C2623]" data-testid="proposal-document">
      <Cover proposal={proposal} logo={settings.logo_path} />

      <section className="doc-section">
        <SectionTitle testId="section-about">{C.SECTIONS.about}</SectionTitle>
        <div className="space-y-3 text-sm leading-relaxed">
          {Object.entries(C.ABOUT).map(([k, v]) => (
            <p key={k}><span className="font-bold text-[#C9A227] mr-2">{k}:</span>{v}</p>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <SectionTitle testId="section-location">{C.SECTIONS.location}</SectionTitle>
        <IconList items={C.LOCATION} />
      </section>

      <PackagesSection />

      <section className="doc-section">
        <SectionTitle testId="section-menu">{C.SECTIONS.menu}</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-3">
          {C.MENU_HIGHLIGHTS.map((m) => (
            <div key={m.name} className="rounded-lg border border-[#E5DECF] bg-[#FDFBF5] p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display font-bold text-[#8B1A1A]">{m.name}</h3>
                <span className="text-xs font-bold text-[#8B1A1A] whitespace-nowrap">{m.price}</span>
              </div>
              <p className="text-xs text-[#C9A227] mt-1">{m.pax}</p>
              <p className="text-sm text-[#6E655F] mt-2 leading-relaxed">{m.detail}</p>
            </div>
          ))}
        </div>
        <p className="text-xs italic text-[#6E655F] mt-4">Menu prices and availability are subject to the current menu and confirmation at booking.</p>
      </section>

      <section className="doc-section">
        <SectionTitle testId="section-events">{C.SECTIONS.events}</SectionTitle>
        <p className="text-sm mb-4">Wedding, birthday, gathering, corporate and private events can be arranged with a custom quotation based on guest count and requested services.</p>
        <IconList items={C.EVENTS} cols={2} />
      </section>

      <section className="doc-section">
        <SectionTitle testId="section-booking">{C.SECTIONS.booking}</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-3">
          {C.EVENT_BOOKING_DETAILS.map((e) => {
            const Icon = Icons[e.icon] || Icons.Star;
            return <div key={e.title} className="rounded-lg border border-[#E5DECF] p-4">
              <div className="flex items-center gap-2 mb-2"><Icon className="w-5 h-5 text-[#8B1A1A]"/><h3 className="font-display font-bold text-[#8B1A1A]">{e.title}</h3></div>
              <p className="text-sm leading-relaxed text-[#6E655F]">{e.detail}</p>
            </div>;
          })}
        </div>
        <div className="mt-5 rounded-lg bg-[#FDFBF5] border border-[#C9A227]/40 p-4">
          <h3 className="font-display font-bold text-[#C9A227] mb-2">Booking Information Required · 预订资料 · DATA BOOKING</h3>
          <ul className="grid sm:grid-cols-2 gap-1.5 text-sm">
            {C.BOOKING_CHECKLIST.map((x) => <li key={x} className="flex items-start gap-2"><span className="text-[#8B1A1A]">•</span>{x}</li>)}
          </ul>
        </div>
      </section>

      <CommissionSection />

      <section className="doc-section">
        <SectionTitle testId="section-facilities">{C.SECTIONS.facilities}</SectionTitle>
        <IconList items={C.FACILITIES} cols={2} />
        <Notes lines={C.FACILITIES_NOTES} />
      </section>

      <section className="doc-section">
        <SectionTitle testId="section-terms">{C.SECTIONS.terms}</SectionTitle>
        <ol className="space-y-2 text-sm">
          {C.TERMS.map((t, i) => (
            <li key={t} className="flex gap-3"><span className="font-display font-bold text-[#8B1A1A] w-5 shrink-0">{i + 1}.</span><span>{t}</span></li>
          ))}
        </ol>
        {proposal.notes && (
          <div className="mt-4 bg-[#FDFBF5] border border-[#C9A227]/40 rounded-lg p-4" data-testid="doc-notes">
            <p className="font-display font-bold text-[#C9A227] text-sm mb-1">Special Notes · 备注 · Catatan Khusus</p>
            <p className="text-sm italic whitespace-pre-wrap">{proposal.notes}</p>
          </div>
        )}
      </section>

      <section className="doc-section text-center bg-[#1A1513] text-[#FAF8F5] rounded-xl p-8" data-testid="section-contact">
        <h2 className="font-display text-lg font-bold text-[#C9A227]">{C.SECTIONS.contact}</h2>
        <p className="font-display text-2xl font-bold mt-3">{C.BRAND.owner} <span className="text-base font-normal italic text-[#FAF8F5]/70">— Owner</span></p>
        <div className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-left max-w-md mx-auto">
          <p><span className="text-[#C9A227] font-bold">WhatsApp:</span> {C.BRAND.whatsapp}</p>
          <p><span className="text-[#C9A227] font-bold">WeChat:</span> {C.BRAND.wechat}</p>
          <p><span className="text-[#C9A227] font-bold">Instagram:</span> {C.BRAND.instagram}</p>
          <p><span className="text-[#C9A227] font-bold">Address:</span> {C.BRAND.address}</p>
        </div>
      </section>

      <section className="doc-section">
        <SectionTitle testId="section-menu-gallery">MENU GALLERY · 菜单图册 · GALERI MENU</SectionTitle>
        <Gallery gallery={C.MENU_GALLERY} />
      </section>

      <section className="doc-section">
        <SectionTitle testId="section-gallery">{C.SECTIONS.gallery}</SectionTitle>
        <Gallery gallery={settings.gallery || []} />
      </section>

      <section className="doc-section text-center pt-4 border-t-2 border-[#C9A227]" data-testid="section-closing">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#8B1A1A]">{C.CLOSING.title}</h2>
        <p className="italic text-sm text-[#6E655F] mt-2">{C.CLOSING.en}</p>
        <p className="italic text-sm text-[#6E655F]">{C.CLOSING.zh}</p>
        <div className="mt-10 flex justify-end">
          <div className="text-left text-xs text-[#6E655F]">
            <p className="font-bold text-[#C9A227] uppercase tracking-widest">Signature & Stamp · 签名与盖章</p>
            <div className="h-16" />
            <p className="border-t border-[#1A1513] pt-1 w-56">Hendri (Ko Aby) — Owner, Brother Seafood Bali</p>
          </div>
        </div>
      </section>
    </article>
  );
}
