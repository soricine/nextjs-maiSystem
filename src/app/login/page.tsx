import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Transfer NextJs Cms</h1>
          <p className={styles.subtitle}>
            Sign in to access your dashboard
          </p>
        </div>

        <form className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="admin@example.com"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div className={styles.options}>
            <label className={styles.checkbox}>
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#" className={styles.link}>
              Forgot password?
            </a>
          </div>

          <button className={styles.button} type="submit">
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}