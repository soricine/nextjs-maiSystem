import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <nav className="navbar">
        <Link href="/" className="logo">
          Need<span>Name</span>
        </Link>

        {/* <div className="navLinks">
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/docs">Documentation</Link>
        </div> */}

        <div className="navActions">
          <Link
            href="/login"
            className="btn btnOutline btnSmall"
          >
            Login
          </Link>

          
        </div>
      </nav>
    </header>
  );
}