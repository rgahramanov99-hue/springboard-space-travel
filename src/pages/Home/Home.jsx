import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles["home"]}>
      <h1>🚀 Space Travel</h1>

      <p>
        Welcome Commander.
        Humanity's future depends on your decisions.
        Build spacecraft, transport civilizations,
        and colonize the solar system.
      </p>

      <div className={styles["home__emojis"]}>
        🌎 🚀 🧑‍🚀 🪐
      </div>
    </div>
  );
}

export default Home;