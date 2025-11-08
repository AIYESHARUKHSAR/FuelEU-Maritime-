import RoutesTab from "./pages/RoutesTab";
import CompareTab from "./pages/CompareTab";
import BankingTab from "./pages/BankingTab";
import PoolingTab from "./pages/PoolingTab";
import { Tabs } from "./components/Tabs";

export default function App() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">FuelEU Compliance Dashboard</h1>
      <Tabs tabs={[
        { key:"routes", title:"Routes", content:<RoutesTab/> },
        { key:"compare", title:"Compare", content:<CompareTab/> },
        { key:"banking", title:"Banking", content:<BankingTab/> },
        { key:"pooling", title:"Pooling", content:<PoolingTab/> },
      ]}/>
    </div>
  );
}
