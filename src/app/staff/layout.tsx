import Sidebar from "../../components/Sidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <Sidebar role="STAFF" />

      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Staff Panel</h1>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}