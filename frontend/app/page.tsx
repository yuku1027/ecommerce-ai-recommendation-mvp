import styles from "./page.module.css";

export default function Home() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5163";

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.kicker}>Phase 0 Ready</div>
        <section className={styles.hero}>
          <h1>奇摩購物 AI 推薦功能 MVP</h1>
          <p>
            前端 Next.js 與後端 ASP.NET Core Web API 骨架已建立。後續 Phase
            會接上商品列表、使用者行為與規則式推薦 API。
          </p>
        </section>
        <div className={styles.statusGrid} aria-label="project setup status">
          <div className={styles.statusItem}>
            <span>Frontend</span>
            <strong>Next.js + TypeScript</strong>
          </div>
          <div className={styles.statusItem}>
            <span>Backend API</span>
            <strong>{apiBaseUrl}</strong>
          </div>
          <div className={styles.statusItem}>
            <span>Health Check</span>
            <strong>/health</strong>
          </div>
        </div>
      </main>
    </div>
  );
}
