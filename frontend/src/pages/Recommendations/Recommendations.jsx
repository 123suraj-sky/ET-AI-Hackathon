import "./Recommendations.css";
import recommendationData from "../../data/recommendationData";

function Recommendations() {
  const { summary, highPriority, mediumPriority, lowPriority } = recommendationData;

  return (
    <div className="recommendation-container">

      <h2 className="page-title">AI Recommendations</h2>

      {/* Summary Cards */}

      <div className="summary-cards">

        <div className="summary-card">
          <h3>Total Recommendations</h3>
          <h2>{summary.total}</h2>
        </div>

        <div className="summary-card">
          <h3>Critical Alerts</h3>
          <h2>{summary.critical}</h2>
        </div>

        <div className="summary-card">
          <h3>Risk Level</h3>
          <h2>{summary.risk}</h2>
        </div>

      </div>

      {/* High Priority */}

      <div className="recommendation-box high">
        <h3>🔴 High Priority</h3>

        <ul>
          {highPriority.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

      {/* Medium Priority */}

      <div className="recommendation-box medium">
        <h3>🟡 Medium Priority</h3>

        <ul>
          {mediumPriority.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

      {/* Low Priority */}

      <div className="recommendation-box low">
        <h3>🟢 Low Priority</h3>

        <ul>
          {lowPriority.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

    </div>
  );
}

export default Recommendations;