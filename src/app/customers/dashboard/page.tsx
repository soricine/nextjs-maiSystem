import Sidebar from "../../../components/Sidebar";
import LogoutButton from "../../../components/LogoutButton";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <Sidebar role="CUSTOMER" />

      <div className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Customer Area</h1>
          </div>

          <LogoutButton />
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}