import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-page">

      
      <header className="home-header">
        <div className="home-header-inner">

          <Link href="/" className="home-logo">
            Need Name
          </Link>

          <nav className="home-nav">
            <Link href="#features">
              Features
            </Link>

            <Link href="#about">
              About
            </Link>

            <Link href="/login">
              Sign In
            </Link>

            {/* <Link
              href="/signin"
              className="home-nav-button"
            >
              Get Started
            </Link> */}
          </nav>

        </div>
      </header>


      
      <section className="home-hero">

        <div className="home-hero-grid" />
        <div className="home-hero-glow" />

        <div className="home-hero-content">

          <div className="home-badge">
            <span />
            Simple. Secure. Powerful.
          </div>

          <h1>
            New Site
            <br />
            <span>New.</span>
          </h1>


          <div className="home-hero-actions">

            <Link
              href="/signin"
              className="home-primary-button"
            >
              Create Account
              <span>→</span>
            </Link>

            <Link
              href="/login"
              className="home-secondary-button"
            >
              Sign In
            </Link>

          </div>

          <div className="home-hero-note">
            <span>✓</span>
          Check

           
          </div>

        </div>

      </section>


      
      <section
        id="features"
        className="home-features"
      >

        <div className="home-container">

          <div className="home-section-header">

            <p className="home-eyebrow">
              FEATURES
            </p>

            <h2>
              New Site
              <br />
              <span>New</span>
            </h2>

            <p>
              123e132fd312fg
            </p>

          </div>


          <div className="home-cards">

            <article className="home-card">

              <div className="home-card-top">
                <span>01</span>

                <div className="home-card-icon">
                  👤
                </div>
              </div>

              <h3>
                Customer
              </h3>

              <p>
                fcrewg4r3
               vwervwrev
              </p>

              <Link href="/signin">
                Create account <span>→</span>
              </Link>

            </article>


            <article className="home-card">

              <div className="home-card-top">
                <span>02</span>

                <div className="home-card-icon">
                  ◇
                </div>
              </div>

              <h3>
                Staff
              </h3>

              <p>
              ewrvwrev
              </p>

              <div className="home-card-label">
                Staff access
              </div>

            </article>


            <article className="home-card">

              <div className="home-card-top">
                <span>03</span>

                <div className="home-card-icon">
                  ⚙
                </div>
              </div>

              <h3>
                Administration
              </h3>

              <p>
      wrevwrvbwrbvrwevb
              </p>

              <div className="home-card-label">
                Admin access
              </div>

            </article>

          </div>

        </div>

      </section>


      
      <section
        id="about"
        className="home-about"
      >

        <div className="home-container">

          <div className="home-about-grid">

            <div>

              <p className="home-eyebrow">
                New
              </p>

              <h2>
                Site
                <br />
                <span>New</span>
              </h2>

            </div>

            <div className="home-about-text">

              <p>
            rvwervwrevbwre
              </p>

              

            </div>

          </div>

        </div>

      </section>


      
      <section className="home-cta">

        <div className="home-cta-inner">

          <div>

            {/* <p className="home-eyebrow">
              GET STARTED
            </p> */}

            <h2>
fewfew            </h2>

            <p>
              Create your account
            </p>

          </div>

          <div className="home-cta-actions">

            <Link
              href="/signin"
              className="home-primary-button"
            >
              Create Account
              <span>→</span>
            </Link>

            <Link
              href="/login"
              className="home-cta-login"
            >
              Already have an account?
              <span>Sign In</span>
            </Link>

          </div>

        </div>

      </section>


      
      <footer className="home-footer">

        <div className="home-footer-inner">

          {/* <Link
            href="/"
            className="home-logo"
          >
            
          </Link> */}

          <p>
            © {new Date().getFullYear()} Need Name.
            All rights reserved.
          </p>

          <div className="home-footer-links">

            <Link href="/login">
              Sign In
            </Link>

            <Link href="/signin">
              Create Account
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}