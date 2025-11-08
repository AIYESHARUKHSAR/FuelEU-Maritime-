import { usePooling } from "../../../core/application/usePooling";

export default function PoolingTab() {
  const { year, setYear, members, setMembers, sum, valid, create } = usePooling();

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input className="border p-2 w-28" type="number" value={year} onChange={e=>setYear(Number(e.target.value))} />
        <span className={`px-2 py-1 rounded ${valid ? "bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>
          Pool Sum: {sum.toFixed(0)}
        </span>
        <button className="border px-3 py-2" disabled={!valid}
          onClick={async ()=>{
            try {
              const resp = await create();
              alert(`Pool #${resp.poolId} created. Sum after: ${resp.poolSum.toFixed(0)}`);
            } catch (e:any) {
              alert(e?.response?.data?.error ?? e.message);
            }
          }}>
          Create Pool
        </button>
      </div>

      <table className="min-w-full text-sm">
        <thead><tr><th className="text-left p-2">Ship</th><th className="text-left p-2">CB</th></tr></thead>
        <tbody>
          {members.map((m,i)=>(
            <tr key={i}>
              <td className="p-2">{m.shipId}</td>
              <td className="p-2">
                <input className="border p-1 w-40" type="number" value={m.cb}
                  onChange={e=>{
                    const v = Number(e.target.value);
                    setMembers(prev => prev.map((x,idx)=> idx===i? {...x, cb:v}: x));
                  }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
