import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  const fetchData = (endpoint, actionType) => {
    fetch(`https://www.swapi.tech/api/${endpoint}`)
      .then(res => res.json())
      .then(json => {
        dispatch({ type: actionType, payload: json.results });
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData("people", "SET_PEOPLE");
    fetchData("planets", "SET_PLANETS");
    fetchData("vehicles", "SET_VEHICLES");
  }, []);

  const isFavorite = (type, uid) =>
    store.favorites.some(fav => fav.type === type && fav.uid === uid);

  const toggleFavorite = (type, uid, name) => {
    if (isFavorite(type, uid)) {
      dispatch({ type: "REMOVE_FAVORITE", payload: { type, uid } });
    } else {
      dispatch({
        type: "ADD_FAVORITE",
        payload: { type, uid, name }
      });
    }
  };

  const fallbackImages = {
  characters: "https://placehold.co/400x250?text=Personaje",
  planets: "https://placehold.co/400x250?text=Planeta",
  vehicles: "https://placehold.co/400x250?text=Vehículo"
};

  const renderCards = (items, type) => {
    const imageType = type

    return (
      <div className="d-flex overflow-auto gap-3">
        {items.map(item => (
          <div
            className="card border-secondary text-white bg-dark shadow"
            style={{ minWidth: "200px", border: "1px solid #444" }}
          >

            <img
              src={`https://raw.githubusercontent.com/breatheco-de/swapi-images/refs/heads/master/public/images/${imageType}/${item.uid}.jpg`}
              className="card-img-top"
              alt={item.name}
              style={{ height: "250px", objectFit: "cover" }}
              onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImages[imageType];
              }}
            />

            {console.log(`https://starwars-visualguide.com/assets/img/${imageType}/${item.uid}.jpg`)}

            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <div className="d-flex justify-content-between">
                <Link to={`/single/${type}/${item.uid}`} className="btn btn-primary">
                  Ver más
                </Link>
                <button
                  className={`btn fs-3 px-3 py-1 border-0 ${
                  isFavorite(type, item.uid) ? "text-warning" : "text-secondary"
                }`}
                  onClick={() => toggleFavorite(type, item.uid, item.name)}
                >
                  {isFavorite(type, item.uid) ? "★" : "☆"}
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h2>Personajes</h2>
      {renderCards(store.people, "people")}

      <h2 className="mt-5">Planetas</h2>
      {renderCards(store.planets, "planets")}

      <h2 className="mt-5">Vehículos</h2>
      {renderCards(store.vehicles, "vehicles")}
    </div>
  );
};
