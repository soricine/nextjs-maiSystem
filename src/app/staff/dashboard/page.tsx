import Sidebar from "../../../components/Sidebar";
import LogoutButton from "../../../components/LogoutButton";

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
          <div>
            <h1>Staff Panel</h1>
          </div>

          <LogoutButton />
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}