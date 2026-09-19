import { Check } from "lucide-react";
import * as C from "@/content/proposalContent";
import { SectionTitle, Notes } from "@/components/proposal/ProposalDocument";

export function PackagesSection() {
  return (
    <section className="doc-section">
      <SectionTitle testId="section-packages">{C.SECTIONS.packages}</SectionTitle>
      <p className="text-xs italic text-[#6E655F] mb-3">Minimum 5 Pax · 最少 5 人 · Minimum 5 Pax</p>
      <div className="overflow-x-auto rounded-lg border border-[#E5DECF]">
        <table className="doc-table w-full text-center" data-testid="packages-table">
          <thead>
            <tr>
              {["Package 套餐", "Fish 鱼", "Calamari 鱿鱼", "Prawn 虾", "Clam 蛤蜊", "Price / Pax"].map((h) => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {C.PACKAGES.map((p) => (
              <tr key={p.name}>
                <td className="font-display font-bold text-[#8B1A1A] text-lg">{p.name}</td>
                <td>{p.fish}</td><td>{p.calamari}</td><td>{p.prawn}</td><td>{p.clam}</td>
                <td className="font-bold text-[#8B1A1A] whitespace-nowrap">IDR {p.price.toLocaleString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Notes lines={C.PACKAGE_NOTES} />
      <h3 className="font-display font-bold text-[#C9A227] mt-5 mb-2">ALL PACKAGES INCLUDE · 所有套餐包含 · SEMUA PAKET SUDAH TERMASUK:</h3>
      <ul className="grid sm:grid-cols-2 gap-1.5 text-sm">
        {C.INCLUDES.map((i) => (
          <li key={i} className="flex items-start gap-2"><Check className="w-4 h-4 text-[#C9A227] mt-0.5 shrink-0" />{i}</li>
        ))}
      </ul>
    </section>
  );
}

export function CommissionSection() {
  return (
    <section className="doc-section">
      <SectionTitle testId="section-commission">{C.SECTIONS.commission}</SectionTitle>
      <h3 className="font-display font-bold text-[#C9A227] mb-2">Commission Structure · 佣金结构 · Struktur Komisi</h3>
      <div className="overflow-hidden rounded-lg border border-[#E5DECF]">
        <table className="doc-table w-full" data-testid="commission-table">
          <thead>
            <tr><th className="text-left">Item · 项目 · Item</th><th className="w-32">Commission · 佣金 · Komisi</th></tr>
          </thead>
          <tbody>
            {C.COMMISSION.map((c) => (
              <tr key={c.value}>
                <td className={c.bold ? "font-bold" : ""}>{c.item}</td>
                <td className="text-center font-bold text-[#8B1A1A] whitespace-nowrap">{c.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Notes lines={C.COMMISSION_NOTES} />
      <h3 className="font-display font-bold text-[#C9A227] mt-5 mb-2">Complimentary for Tour Guide & Driver · 导游及司机免费待遇 · Kompliment untuk Guide & Driver</h3>
      <ul className="space-y-1.5 text-sm">
        {C.COMPLIMENTARY.map((i) => (
          <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#8B1A1A] mt-2 shrink-0" />{i}</li>
        ))}
      </ul>
    </section>
  );
}
