import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

function MainLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        <Sidebar />

        <main style={{ 
          flex: 1, 
          padding: "28px 36px", 
          maxWidth: "1600px", 
          margin: "0 auto", 
          width: "100%",
          boxSizing: "border-box" 
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;