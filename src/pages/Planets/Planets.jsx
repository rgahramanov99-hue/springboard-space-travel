import { useState, useEffect, useContext } from "react";

import styles from "./Planets.module.css";
import { LoadingContext } from "../../context/LoadingProvider.jsx";
import SpaceTravelApi from "../../services/SpaceTravelApi.js";

const PLANET_IMAGES = {
  Mercury: "/planets/Mercury.jpg",
  Venus: "/planets/Venus.jpg",
  Earth: "/planets/Earth.jpg",
  Mars: "/planets/Mars.jpg",
  Jupiter: "/planets/Jupiter.jpg",
  Saturn: "/planets/Saturn.jpg",
  Uranus: "/planets/Uranus.jpg",
  Neptune: "/planets/Neptune.jpg",
};

function Planets() {
  const [planetsWithSpacecrafts, setPlanetsWithSpacecrafts] = useState([]);
  const { enableLoading, disableLoading } = useContext(LoadingContext);
  const [selectedPlanetId, setSelectedPlanetId] = useState(null);
  const [selectedSpacecraftId, setSelectedSpacecraftId] = useState(null);

  async function getPlanetsWithSpacecrafts() {
    const { data: planets, isError: isErrorPlanets } =
      await SpaceTravelApi.getPlanets();

    const { data: spacecrafts, isError: isErrorSpacecrafts } =
      await SpaceTravelApi.getSpacecrafts();

    if (!isErrorPlanets && !isErrorSpacecrafts) {
      const updatedPlanets = planets.map((planet) => ({
        ...planet,
        pictureUrl: PLANET_IMAGES[planet.name] || planet.pictureUrl,
        spacecrafts: spacecrafts.filter(
          (spacecraft) => spacecraft.currentLocation === planet.id
        ),
      }));

      setPlanetsWithSpacecrafts(updatedPlanets);
    }
  }

  useEffect(() => {
    async function runGetPlanetsWithSpacecrafts() {
      enableLoading();
      await getPlanetsWithSpacecrafts();
      disableLoading();
    }

    runGetPlanetsWithSpacecrafts();
  }, [enableLoading, disableLoading]);

  function handleClickOfPlanet(event, id) {
    event.stopPropagation();
    setSelectedPlanetId(id);
    setSelectedSpacecraftId(null);
  }

  async function handleClickOfSpacecraft(event, spacecraftId, planetId) {
    event.stopPropagation();

    if (selectedPlanetId === null || selectedPlanetId === undefined) {
      alert("Please select a target planet first.");
      return;
    }

    if (selectedPlanetId === planetId) {
      alert("You cannot send a spacecraft to the same planet.");
      return;
    }

    setSelectedSpacecraftId(spacecraftId);
    enableLoading();

    await SpaceTravelApi.sendSpacecraftToPlanet({
      spacecraftId,
      targetPlanetId: selectedPlanetId,
    });

    await getPlanetsWithSpacecrafts();

    disableLoading();
    setSelectedSpacecraftId(null);
    setSelectedPlanetId(null);
  }

  return (
    <>
      {planetsWithSpacecrafts.map((planet) => (
        <div key={planet.id} className={styles["planetWithSpacecrafts"]}>
          <div
            className={`${styles["planet"]} ${
              selectedPlanetId === planet.id ? styles["planet--selected"] : ""
            }`}
            onClick={(event) => handleClickOfPlanet(event, planet.id)}
          >
            <div className={styles["planet__imageContainer"]}>
              <img
                src={planet.pictureUrl}
                alt={`The planet ${planet.name}`}
                className={styles["planet__image"]}
              />
            </div>

            <div className={styles["planet__info"]}>
              <div>{planet.name}</div>
              <div>{planet.currentPopulation}</div>
            </div>
          </div>

          <div className={styles["planet__spacecrafts"]}>
            {planet.spacecrafts.map((spacecraft) => (
              <div
                key={spacecraft.id}
                className={`${styles["planet__spacecraft"]} ${
                  selectedSpacecraftId === spacecraft.id
                    ? styles["planet__spacecraft--selected"]
                    : ""
                }`}
                onClick={(event) =>
                  handleClickOfSpacecraft(event, spacecraft.id, planet.id)
                }
              >
                <div className={styles["planet__spacecraft__imageContainer"]}>
                  {spacecraft.pictureUrl ? (
                    <img
                      src={spacecraft.pictureUrl}
                      alt={`The spacecraft ${spacecraft.name}`}
                      className={styles["planet__spacecraft__image"]}
                    />
                  ) : (
                    <span
                      className={styles["planet__spacecraft__image--default"]}
                    >
                      🚀
                    </span>
                  )}
                </div>

                <div className={styles["planet__spacecraft__info"]}>
                  <div>{spacecraft.name}</div>
                  <div>{spacecraft.capacity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default Planets;