import Sidebar from "../../../components/Sidebar";
import LogoutButton from "../../../components/LogoutButton";
import Link from "next/link";

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
  <Link
            href="/customers/settings"
            className="account-button"
          >
            Change Name
          </Link>
          
        </header>
        <LogoutButton />
        <main>{children}</main>
      </div>
    </div>
  );
}