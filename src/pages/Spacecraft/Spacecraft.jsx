import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import styles from "./Spacecraft.module.css";
import { LoadingContext } from "../../context/LoadingProvider.jsx";
import SpaceTravelApi from "../../services/SpaceTravelApi.js";

function Spacecraft() {
  const [spacecraft, setSpacecraft] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { enableLoading, disableLoading } = useContext(LoadingContext);

  useEffect(() => {
    async function getSpacecraft() {
      enableLoading();

      const response = await SpaceTravelApi.getSpacecraftById({ id });

      if (!response.isError) {
        setSpacecraft(response.data);
      }

      disableLoading();
    }

    getSpacecraft();
  }, [id, enableLoading, disableLoading]);

  function handleClickOfBack() {
    navigate(-1);
  }

  if (!spacecraft) {
    return null;
  }

  return (
    <>
      <button
        className={styles["button__back"]}
        onClick={handleClickOfBack}
      >
        👈 Back
      </button>

      <div className={styles["spacecraft"]}>
        <div className={styles["spacecraft__imageContainer"]}>
          {spacecraft.pictureUrl ? (
            <img
              src={spacecraft.pictureUrl}
              alt={`The spacecraft ${spacecraft.name}`}
              className={styles["spacecraft__image"]}
            />
          ) : (
            <span className={styles["spacecraft__image--default"]}>
              🚀
            </span>
          )}
        </div>

        <div className={styles["spacecraft__info"]}>
          <h1>🚀 {spacecraft.name}</h1>

          <p>
            <strong>👨‍🚀 Capacity:</strong> {spacecraft.capacity}
          </p>

          <p>
            <strong>📝 Description:</strong> {spacecraft.description}
          </p>
        </div>
      </div>
    </>
  );
}

export default Spacecraft;