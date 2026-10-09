"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { BriefcaseBusiness, Building2, CalendarDays, Plus, Trash2, X } from "lucide-react";
import type { EmploymentHistoryItem } from "@/action/profileAction";

interface Props {
  open: boolean;
  history: EmploymentHistoryItem[];
  onClose: () => void;
  onAdd: (data: { jobTitle: string; companyName: string; startYear: number; description?: string }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function EmploymentHistoryModal({ open, history, onClose, onAdd, onDelete }: Props) {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [startYear, setStartYear] = useState(String(new Date().getFullYear() + 543));
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const start = Number(startYear);
    if (!jobTitle.trim() || !companyName.trim()) {
      setError("กรุณากรอกตำแหน่งงานและชื่อบริษัท");
      return;
    }
    if (!Number.isInteger(start) || start < 2500 || start > 2600) {
      setError("กรุณากรอกปีที่เริ่มงานเป็น พ.ศ. ให้ถูกต้อง (2500-2600)");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onAdd({ jobTitle: jobTitle.trim(), companyName: companyName.trim(), startYear: start, description: description.trim() || undefined });
      setJobTitle("");
      setCompanyName("");
      setStartYear(String(new Date().getFullYear() + 543));
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "เพิ่มประวัติงานไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("ต้องการลบประวัติงานรายการนี้หรือไม่?")) return;
    setBusy(true);
    setError("");
    try {
      await onDelete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ลบประวัติงานไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="employment-history-title" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl md:p-7">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="employment-history-title" className="text-xl font-bold text-bluez-tone-1">ประวัติการทำงาน</h2>
            <p className="mt-1 text-sm text-slate-500">เพิ่มและจัดการตำแหน่งงานที่ผ่านมา</p>
          </div>
          <button type="button" onClick={onClose} aria-label="ปิดหน้าต่าง" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:cursor-pointer"><X className="h-5 w-5" /></button>
        </header>

        {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="mb-6 space-y-3">
          {history.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">ยังไม่มีประวัติการทำงาน</div>
          ) : history.map((item) => (
            <article key={item.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bluez-tone-2/40 text-bluez-tone-3"><BriefcaseBusiness className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-bluez-tone-1">{item.jobTitle}</h3>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-600"><Building2 className="h-4 w-4" />{item.companyName || "ไม่ระบุบริษัท"}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><CalendarDays className="h-4 w-4" />เริ่มงาน พ.ศ. {item.startYear ?? "ไม่ระบุ"}</p>
                {item.description && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{item.description}</p>}
              </div>
              <button type="button" disabled={busy} onClick={() => void remove(item.id)} aria-label="ลบประวัติงาน" className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50 hover:cursor-pointer"><Trash2 className="h-4 w-4" /></button>
            </article>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold text-bluez-tone-1">เพิ่มประวัติงานเก่า</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">ตำแหน่งงาน
              <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} maxLength={150} required className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-bluez-tone-3 focus:ring-2 focus:ring-bluez-tone-3/20" placeholder="เช่น Software Engineer" />
            </label>
            <label className="text-sm font-medium text-slate-700">บริษัท / องค์กร
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} maxLength={150} required className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-bluez-tone-3 focus:ring-2 focus:ring-bluez-tone-3/20" placeholder="ชื่อบริษัท" />
            </label>
            <label className="text-sm font-medium text-slate-700">ปีที่เริ่มงาน (พ.ศ.)
              <input type="number" min={2500} max={2600} value={startYear} onChange={(e) => setStartYear(e.target.value)} required className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-bluez-tone-3 focus:ring-2 focus:ring-bluez-tone-3/20" />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">รายละเอียดเพิ่มเติม (ไม่บังคับ)
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} rows={2} className="mt-1 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-bluez-tone-3 focus:ring-2 focus:ring-bluez-tone-3/20" placeholder="หน้าที่รับผิดชอบหรือผลงาน" />
          </label>
          <div className="flex justify-end">
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-bluez-tone-3 px-4 py-2 font-medium text-white transition hover:bg-bluez-tone-4 disabled:opacity-50 hover:cursor-pointer"><Plus className="h-4 w-4" />{busy ? "กำลังบันทึก..." : "เพิ่มประวัติงาน"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
