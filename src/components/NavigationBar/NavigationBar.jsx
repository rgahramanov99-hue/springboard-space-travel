import { NavLink } from "react-router-dom";

import styles from "./NavigationBar.module.css";

function NavigationBar() {
  return (
    <nav className={styles["navigation-bar"]}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? styles.active : ""
        }
      >
        🏠 Home
      </NavLink>

      <NavLink
        to="/spacecrafts"
        className={({ isActive }) =>
          isActive ? styles.active : ""
        }
      >
        🚀 Spacecrafts
      </NavLink>

      <NavLink
        to="/planets"
        className={({ isActive }) =>
          isActive ? styles.active : ""
        }
      >
        🪐 Planets
      </NavLink>
    </nav>
  );
}

export default NavigationBar;