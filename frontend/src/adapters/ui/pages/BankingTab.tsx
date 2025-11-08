import { useState } from "react";
import { useBanking } from "../../../core/application/useBanking";

export default function BankingTab() {
  const { shipId, setShipId, year, setYear, cb, adjusted, records, refresh, doBank, doApply } = useBanking();
  const [applyAmt, setApplyAmt] = useState(0);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="border p-2" value={shipId} onChange={e=>setShipId(e.target.value)} />
        <input className="border p-2 w-28" type="number" value={year} onChange={e=>setYear(Number(e.target.value))} />
        <button className="border px-3 py-2" onClick={refresh}>Refresh</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <KPI label="CB (before)" value={cb ?? 0} />
        <KPI label="Adjusted CB" value={adjusted ?? 0} />
        <KPI label="Can Bank?" value={(cb ?? 0) > 0 ? "Yes" : "No"} />
      </div>

      <div className="flex gap-2">
        <button disabled={(cb ?? 0) <= 0} className="border px-3 py-2 disabled:opacity-50"
          onClick={async ()=>{ try { await doBank(); } catch(e:any){ alert(e?.response?.data?.error ?? e.message); } }}>
          Bank positive CB
        </button>

        <input className="border p-2 w-32" type="number" value={applyAmt} onChange={e=>setApplyAmt(Number(e.target.value))} />
        <button className="border px-3 py-2"
          onClick={async ()=>{
            try { await doApply(applyAmt); }
            catch(e:any){ alert(e?.response?.data?.error ?? e.message); }
          }}>
          Apply banked
        </button>
      </div>

      <div>
        <div className="font-semibold mb-2">Banking records</div>
        <ul className="text-sm space-y-1">
          {records.map((r,i)=><li key={i}>{new Date(r.createdAt).toLocaleString()} — {r.amount.toFixed(2)}</li>)}
        </ul>
      </div>
    </div>
  );
}

function KPI({label, value}:{label:string; value:number|string}) {
  return <div className="p-4 border rounded"><div className="text-xs text-gray-500">{label}</div><div className="text-xl">{typeof value==='number'? value.toFixed(2):value}</div></div>
}
