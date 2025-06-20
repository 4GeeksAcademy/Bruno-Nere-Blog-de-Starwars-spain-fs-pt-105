import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();

  const removeFavorite = (fav) => {
    dispatch({
      type: "REMOVE_FAVORITE",
      payload: { type: fav.type, uid: fav.uid }
    });
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
        <span style={{ fontSize: "1.8rem" }}>🌌</span>
        <span>Star Wars Blog</span>
      </Link>

      <div className="dropdown">
        <button
          className="btn btn-warning dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          ⭐ Favoritos ({store.favorites.length})
        </button>

        <ul className="dropdown-menu dropdown-menu-end">
          {store.favorites.length === 0 ? (
            <li className="dropdown-item text-muted">Sin favoritos</li>
          ) : (
            store.favorites.map((fav, index) => (
              <li key={index} className="dropdown-item d-flex justify-content-between align-items-center">
                <Link to={`/single/${fav.type}/${fav.uid}`} className="text-decoration-none me-2">
                  {fav.name}
                </Link>
                <button
                  onClick={() => removeFavorite(fav)}
                  className="btn btn-sm btn-danger">
                  🗑
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </nav>
  );
};
