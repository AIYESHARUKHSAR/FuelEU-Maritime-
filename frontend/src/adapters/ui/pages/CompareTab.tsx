import { useComparison } from "../../../core/application/useComparison";
import { Table } from "../components/Table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function CompareTab() {
  const { data, error } = useComparison();
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!data) return <div>Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="text-sm">Baseline route: <b>{data.baseline}</b> • Target: {data.target.toFixed(4)} gCO₂e/MJ</div>
      <Table
        headers={["routeId","baseline","comparison","% diff","compliant"]}
        rows={data.rows.map((r:any)=>[
          r.routeId, r.baseline.toFixed(2), r.comparison.toFixed(2), r.percentDiff.toFixed(2)+"%", r.compliant ? "✅" : "❌"
        ])}
      />
      <div className="w-full overflow-x-auto">
        <BarChart width={700} height={320} data={data.rows.map((r:any)=>({ name:r.routeId, baseline:r.baseline, comparison:r.comparison }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name"/><YAxis/><Tooltip/><Legend/>
          <Bar dataKey="baseline" />
          <Bar dataKey="comparison" />
        </BarChart>
      </div>
    </div>
  );
}
