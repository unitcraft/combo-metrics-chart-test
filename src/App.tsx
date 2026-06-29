import ComboChart from './ComboChart';
import { sampleData } from './data';

export default function App() {
  return (
    <div className="page">
      <h1 className="page__title">Combo Metrics Chart</h1>
      <div className="chart-card">
        <ComboChart data={sampleData} />
      </div>
    </div>
  );
}
