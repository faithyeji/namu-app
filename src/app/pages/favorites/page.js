"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [projectNames, setProjectNames] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const favoritesResponse = await fetch(
          `http://localhost:4000/favorites`
        );
        const favoritesData = await favoritesResponse.json();
        setFavorites(favoritesData);

        favoritesData.forEach((favorite) => {
          fetchProjectName(favorite.projectId);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchProjectName = async (projectId) => {
    if (!projectNames[projectId]) {
      try {
        const projectResponse = await fetch(
          `http://localhost:4000/projects/${projectId}`
        );
        const projectData = await projectResponse.json();
        setProjectNames((prev) => ({
          ...prev,
          [projectId]: projectData.name,
        }));
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    }
  };

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/favorites/${favoriteId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((favorite) => favorite.id !== favoriteId)
        );
        toast.success("Favorite deleted!");
      } else {
        toast.error("Oops! Couldn't delete favorite :(");
        console.error("Failed to delete favorite");
      }
    } catch (error) {
      toast.error("Oops! Couldn't delete favorite :(");
      console.error("Error deleting favorite:", error);
    }
  };

  return (
    <div className="m-44">
      <h1 className="font-serif text-2xl text-yellow-950 mb-5">
        Your Favorites
      </h1>
      <ul className="flex flex-col gap-6">
        {favorites.length === 0 ? (
          <p>No favorites added.</p>
        ) : (
          favorites.map((favorite) => (
            <li key={favorite.id} className="flex flex-col">
              <p>
                <a
                  href={`/pages/projects/${favorite.projectId}`}
                  className="text-green-600 hover:text-green-800 font-serif text-xl"
                >
                  {projectNames[favorite.projectId] || "Unknown Project"}
                </a>
              </p>
              <div>
                <p>
                  Added: {new Date(favorite.addedDate).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleDeleteFavorite(favorite.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <ToastContainer />
    </div>
  );
}
