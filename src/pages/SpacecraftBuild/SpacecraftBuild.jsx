import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./SpacecraftBuild.module.css";
import { LoadingContext } from "../../context/LoadingProvider.jsx";
import SpaceTravelApi from "../../services/SpaceTravelApi.js";

function SpacecraftBuild() {
  const INITIAL_SPACECRAFT = {
    name: "",
    capacity: "",
    description: "",
    pictureUrl: "",
  };

  const [spacecraft, setSpacecraft] = useState(INITIAL_SPACECRAFT);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const { enableLoading, disableLoading } = useContext(LoadingContext);

  function handleChangeOfFormInput(event) {
    const { name, value } = event.target;

    setSpacecraft({
      ...spacecraft,
      [name]: value,
    });
  }

  async function handleSubmitOfForm(event) {
    event.preventDefault();

    const newErrors = [];

    if (!spacecraft.name.trim()) {
      newErrors.push("Name is required.");
    }

    if (!spacecraft.capacity || Number(spacecraft.capacity) <= 0) {
      newErrors.push("Capacity is required.");
    }

    if (!spacecraft.description.trim()) {
      newErrors.push("Description is required.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    enableLoading();

    await SpaceTravelApi.buildSpacecraft({
      name: spacecraft.name,
      capacity: Number(spacecraft.capacity),
      description: spacecraft.description,
      pictureUrl: spacecraft.pictureUrl || undefined,
    });

    disableLoading();

    navigate("/spacecrafts");
  }

  function handleClickOfBack(event) {
    event.preventDefault();
    navigate(-1);
  }

  return (
    <>
      <button
        className={styles["button__back"]}
        onClick={handleClickOfBack}
      >
        👈 Back
      </button>

      <div className={styles["build"]}>
        <h1 className={styles["build__title"]}>
          🏗️ Build a New Spacecraft
        </h1>

        <p className={styles["build__subtitle"]}>
          Create a spacecraft to help humanity travel across the solar system.
        </p>

        <form onSubmit={handleSubmitOfForm}>
          <div className={styles["form"]}>
            <div className={styles["form__inputs"]}>
              <div className={styles["form__inputContainer"]}>
                <input
                  type="text"
                  name="name"
                  placeholder="Spacecraft Name"
                  value={spacecraft.name}
                  onChange={handleChangeOfFormInput}
                  autoComplete="off"
                />
              </div>

              <div className={styles["form__inputContainer"]}>
                <input
                  type="text"
                  name="capacity"
                  placeholder="Passenger Capacity"
                  value={spacecraft.capacity}
                  onChange={handleChangeOfFormInput}
                  autoComplete="off"
                />
              </div>

              <div className={styles["form__inputContainer"]}>
                <textarea
                  name="description"
                  placeholder="Mission Description"
                  value={spacecraft.description}
                  onChange={handleChangeOfFormInput}
                />
              </div>

              <div className={styles["form__inputContainer"]}>
                <input
                  type="text"
                  name="pictureUrl"
                  placeholder="Picture URL optional"
                  value={spacecraft.pictureUrl}
                  onChange={handleChangeOfFormInput}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className={styles["submitContainer"]}>
              <div className={styles["errorContainer"]}>
                {errors.map((error, index) => (
                  <div key={index} className={styles["error"]}>
                    {error}
                  </div>
                ))}
              </div>

              <div className={styles["button__submit"]}>
                <button type="submit">🚀 Launch Build</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default SpacecraftBuild;