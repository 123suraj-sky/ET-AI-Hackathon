import "./Reports.css";
import reportsData from "../../data/reportsData";

function Reports() {
  return (
    <div className="reports-container">

      <h2 className="page-title">Reports</h2>

      <table className="reports-table">

        <thead>
          <tr>
            <th>Report</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {reportsData.map((report) => (

            <tr key={report.id}>

              <td>{report.title}</td>

              <td>{report.date}</td>

              <td>{report.status}</td>

              <td>
                <button className="download-btn">
                  Download
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Reports;