import "./SourceAnalysis.css";
import sourceAnalysisData from "../../data/sourceAnalysisData";

function SourceAnalysis() {

  const { summary, pollutionSources, hotspotAreas } = sourceAnalysisData;

  return (
    <div className="source-container">

      <h2>Source Analysis</h2>

      {/* Summary Cards */}

      <div className="summary-cards">

        <div className="summary-card">
          <h3>Top Source</h3>
          <h2>{summary.topSource}</h2>
        </div>

        <div className="summary-card">
          <h3>Total AQI</h3>
          <h2>{summary.totalAQI}</h2>
        </div>

        <div className="summary-card">
          <h3>Hotspots</h3>
          <h2>{summary.hotspots}</h2>
        </div>

      </div>

      {/* Pollution Sources */}

      <div className="chart-section">

        <h3>Pollution Source Distribution</h3>

        <table className="forecast-table">

          <thead>
            <tr>
              <th>Source</th>
              <th>Contribution (%)</th>
            </tr>
          </thead>

          <tbody>

            {pollutionSources.map((item, index) => (

              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.value}%</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Hotspot Areas */}

      <div className="hotspot-section">

        <h3>Hotspot Areas</h3>

        <ul>

          {hotspotAreas.map((area, index) => (

            <li key={index}>{area}</li>

          ))}

        </ul>

      </div>

    </div>
  );
}

export default SourceAnalysis;