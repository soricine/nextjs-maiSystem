import Header from "../components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <div className="container hero-content">

            <h1>
              Take what ever
              <span className="gradient-text">
                {" "}from here
              </span>
            </h1>

            <p style={{ marginTop: "1.5rem" }}>
              Send What ever
            </p>

            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center"
              }}
            >
              <a href="/login" className="btn">
                Login
              </a>

            </div>

          </div>
        </section>
      </main>
    </>
  );
}