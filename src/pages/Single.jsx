import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Single = () => {
  const { type, uid } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const imageType = type
  const imageUrl = `https://raw.githubusercontent.com/breatheco-de/swapi-images/refs/heads/master/public/images/${imageType}/${uid}.jpg`;

  const isFavorite = store.favorites.some(
    fav => fav.uid === uid && fav.type === type
  );

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch({ type: "REMOVE_FAVORITE", payload: { uid, type } });
    } else {
      dispatch({
        type: "ADD_FAVORITE",
        payload: {
          uid,
          type,
          name: data.properties.name
        }
      });
    }
  };

  useEffect(() => {
    fetch(`https://www.swapi.tech/api/${type}/${uid}`)
      .then(res => res.json())
      .then(json => {
        setData(json.result);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [type, uid]);

  if (loading) return <p className="text-center">Cargando...</p>;
  if (!data) return <p className="text-danger text-center">No se encontró el dato</p>;

  return (
    <div className="container text-white my-5">
      <div className="row">
        <div className="col-md-6">

        console.log("Imagen cargando:", imageUrl);

          <img
              src={imageUrl}
              className="img-fluid rounded shadow"
              alt={data.properties.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400?text=Sin+imagen";
             }}
          />

        </div>
        <div className="col-md-6">
          <h1 className="display-4">{data.properties.name}</h1>
          <button
            className={`btn fs-4 mb-3 ${
              isFavorite ? "text-warning" : "text-secondary"
            } border-0`}
            onClick={toggleFavorite}
          >
            {isFavorite ? "★" : "☆"}
          </button>
          <p className="lead">
            {data.description || "No hay descripción disponible."}
          </p>
        </div>
      </div>

      <hr className="my-4 border-light" />

      <h4 className="mt-4">Ficha técnica</h4>
      <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
        {Object.entries(data.properties).map(([key, value]) => (
          <div className="col" key={key}>
            <div className="bg-dark border border-secondary rounded p-3 h-100">
              <strong>{key.replaceAll("_", " ").toUpperCase()}</strong>
              <br />
              <span>{value}</span>
            </div>
          </div>
        ))}
      </div>

      <Link to="/" className="btn btn-outline-light mt-5">
        ← Volver al inicio
      </Link>
    </div>
  );
};
