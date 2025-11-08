import { useRoutes } from "../../../core/application/useRoutes";
import { Table } from "../components/Table";

export default function RoutesTab() {
  const { filtered, vesselTypes, fuelTypes, years, filters, setFilters, markBaseline, loading } = useRoutes();

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <select className="border p-2" value={filters.vesselType} onChange={e=>setFilters(f=>({...f, vesselType:e.target.value}))}>
          <option value="">All vessel</option>{vesselTypes.map(v=><option key={v}>{v}</option>)}
        </select>
        <select className="border p-2" value={filters.fuelType} onChange={e=>setFilters(f=>({...f, fuelType:e.target.value}))}>
          <option value="">All fuel</option>{fuelTypes.map(v=><option key={v}>{v}</option>)}
        </select>
        <select className="border p-2" value={filters.year} onChange={e=>setFilters(f=>({...f, year:e.target.value}))}>
          <option value="">All years</option>{years.map(v=><option key={v} value={String(v)}>{v}</option>)}
        </select>
      </div>

      {loading ? <div>Loading…</div> :
      <Table
        headers={["routeId","vesselType","fuelType","year","ghgIntensity","fuelConsumption(t)","distance(km)","totalEmissions(t)","baseline","action"]}
        rows={filtered.map((r:any)=>[
          r.routeId, r.vesselType, r.fuelType, r.year, r.ghgIntensity, r.fuelConsumption, r.distance, r.totalEmissions,
          r.isBaseline ? "✅" : "",
          <button className="px-2 py-1 border rounded" onClick={async ()=>{
            await markBaseline(r.routeId);
          }}>Set Baseline</button>
        ])}
      />}
    </div>
  );
}
