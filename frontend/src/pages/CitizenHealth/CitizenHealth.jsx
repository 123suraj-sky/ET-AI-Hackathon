import "./CitizenHealth.css";
import citizenHealthData from "../../data/citizenHealthData";

function CitizenHealth() {

  const { currentAQI, riskLevel, groups } = citizenHealthData;

  return (
    <div className="citizen-container">

      <h2 className="page-title">
        Citizen Health Advisory
      </h2>

      {/* Summary */}

      <div className="health-summary">

        <div className="summary-card">
          <h3>Current AQI</h3>
          <h2>{currentAQI}</h2>
        </div>

        <div className="summary-card">
          <h3>Risk Level</h3>
          <h2>{riskLevel}</h2>
        </div>

      </div>

      {/* Health Cards */}

      <div className="health-grid">

        {groups.map((group) => (

          <div className="health-card" key={group.id}>

            <h3>{group.title}</h3>

            <ul>

              {group.advice.map((item, index) => (

                <li key={index}>{item}</li>

              ))}

            </ul>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CitizenHealth;