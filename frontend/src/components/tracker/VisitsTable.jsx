import { Trash2, CheckCircle2, Circle } from "lucide-react";
import { idr } from "@/lib/api";

export default function VisitsTable({ visits, onTogglePaid, onDelete }) {
  if (!visits.length) {
    return <div className="bg-white border border-dashed border-[#C9A227] rounded-xl p-10 text-center text-[#6E655F] text-sm" data-testid="visits-empty">Belum ada kunjungan. Klik "Add Visit".</div>;
  }
  return (
    <div className="bg-white border border-[#E5DECF] rounded-xl overflow-x-auto">
      <table className="w-full text-sm" data-testid="visits-table">
        <thead className="bg-[#FDFBF5] text-[11px] uppercase tracking-wider text-[#6E655F]">
          <tr>
            {["Date", "Travel Agent", "Pax", "Pkg", "Food", "Bev", "Uang Hadir", "Commission", "Paid", ""].map((h) => (
              <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visits.map((v) => (
            <tr key={v.id} className="border-t border-[#E5DECF] hover:bg-[#FDFBF5]/60" data-testid={`visit-row-${v.id}`}>
              <td className="px-4 py-3 whitespace-nowrap">{v.date}</td>
              <td className="px-4 py-3 font-bold text-[#1A1513]">{v.ta_name}{v.notes && <div className="text-xs text-[#6E655F] font-normal">{v.notes}</div>}</td>
              <td className="px-4 py-3">{v.pax}</td>
              <td className="px-4 py-3">
                {v.rate_type === "alacarte"
                  ? <span className="text-[10px] uppercase tracking-wider font-bold bg-[#FDF2F2] text-[#8B1A1A] rounded-full px-2 py-0.5">À la carte</span>
                  : <span className="font-display font-bold text-[#8B1A1A]">{v.package}</span>}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{idr(v.food_bill)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{idr(v.beverage_bill)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{idr(v.uang_hadir)}</td>
              <td className="px-4 py-3 whitespace-nowrap font-bold text-[#8B1A1A]">{idr(v.commission_total)}</td>
              <td className="px-4 py-3">
                <button onClick={() => onTogglePaid(v)} className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-2.5 py-1 transition-colors ${v.paid ? "bg-green-50 text-[#16A34A]" : "bg-amber-50 text-[#D97706]"}`} data-testid={`toggle-paid-${v.id}`}>
                  {v.paid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}{v.paid ? "Paid" : "Unpaid"}
                </button>
              </td>
              <td className="px-2 py-3">
                <button onClick={() => onDelete(v)} className="p-2 rounded-full text-[#8B1A1A] hover:bg-[#FDF2F2]" data-testid={`delete-visit-${v.id}`}><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
