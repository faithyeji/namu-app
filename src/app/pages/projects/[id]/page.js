"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import GreenButton from "@/app/components/GreenButton";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Projects() {
  const { id: projectId } = useParams();
  const [project, setProject] = useState("");
  const [creator, setCreator] = useState("");
  const [updates, setUpdates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [isToday, setIsToday] = useState(true);
  const [customDate, setCustomDate] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const projectResponse = await fetch(
          `http://localhost:4000/projects/${projectId}`
        );
        const projectData = await projectResponse.json();

        const assignmentsResponse = await fetch(
          `http://localhost:4000/projectAssignments?projectId=${projectId}`
        );
        const assignmentsData = await assignmentsResponse.json();

        if (assignmentsData.length > 0) {
          const creatorResponse = await fetch(
            `http://localhost:4000/users/${assignmentsData[0].userId}`
          );
          const creatorData = await creatorResponse.json();
          setCreator(creatorData);
        }

        const updatesResponse = await fetch(
          `http://localhost:4000/updates?projectId=${projectId}`
        );
        const updatesData = await updatesResponse.json();

        const sortedUpdates = updatesData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setProject(projectData);
        setUpdates(sortedUpdates);

        const favoritesResponse = await fetch(
          "http://localhost:4000/favorites"
        );
        const favoritesData = await favoritesResponse.json();
        const isAlreadyFavorited = favoritesData.some(
          (favorite) => favorite.projectId === projectId
        );
        setIsFavorited(isAlreadyFavorited);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId]);

  if (!project || !creator) {
    return (
      <div className="flex justify-center items-center m-auto">Loading...</div>
    );
  }

  const postUpdate = async () => {
    if (!updateTitle || !updateDescription) {
      toast.error("Please provide all fields: title and description.");
      return;
    }

    const dateToUse = isToday ? new Date().toISOString() : customDate;

    try {
      const newUpdateResponse = await fetch("http://localhost:4000/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectId,
          title: updateTitle,
          description: updateDescription,
          date: dateToUse,
        }),
      });
      const newUpdate = await newUpdateResponse.json();

      await fetch(`http://localhost:4000/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: [...project.updates, newUpdate.id],
        }),
      });

      setUpdates((prevUpdates) => [
        { ...newUpdate, date: dateToUse },
        ...prevUpdates,
      ]);

      toast.success("New update posted!");
      setShowModal(false);
      setUpdateTitle("");
      setUpdateDescription("");
      setIsToday(true);
      setCustomDate("");
    } catch (error) {
      toast.error("Oops! Couldn't post the update :(");
      console.error("Error posting update:", error);
    }
  };

  const addToFavorites = async () => {
    const newFavorite = {
      projectId: projectId,
      addedDate: new Date().toISOString(),
    };

    try {
      const favoritesResponse = await fetch("http://localhost:4000/favorites");
      const favoritesData = await favoritesResponse.json();

      const isDuplicate = favoritesData.some(
        (favorite) => favorite.projectId === newFavorite.projectId
      );

      if (isDuplicate) {
        toast.error("This project is already in your favorites.");
        return;
      }

      const response = await fetch("http://localhost:4000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFavorite),
      });

      await response.json();
      toast.success("Project added to favorites!");
      setIsFavorited(true);
    } catch (error) {
      toast.error("Failed to add to favorites.");
      console.error("Error adding to favorites:", error);
    }
  };

  return (
    <>
      <div className="mx-40 my-20">
        <button onClick={() => router.back()} className="text-green-800">
          Back to Garden
        </button>

        <h1 className="text-3xl font-serif mt-10">{project.name}</h1>
        <p className="font-serif text-lg">{project.description}</p>
        <p className="text-sm mt-2 text-neutral-400">
          Planted on {project.createdDate} by {creator.name}
        </p>

        <button
          onClick={addToFavorites}
          className={`${
            isFavorited ? "bg-green-500" : "bg-green-800"
          } text-white px-4 py-2 rounded-md mt-4 flex`}
          disabled={isFavorited}
        >
          {isFavorited ? "Favorited" : "Favorite 🤍"}
        </button>

        <h2 className="text-2xl font-serif mt-10">Updates 🌱</h2>
        <ul className="list-disc pl-5">
          {updates.map((update) => (
            <li key={update.id} className="mt-5">
              <h3 className="font-semibold">{update.title}</h3>
              <p>{update.description}</p>
              <p className="text-xs text-neutral-500">{update.date}</p>
            </li>
          ))}
        </ul>
      </div>
      <GreenButton onClick={() => setShowModal(true)} icon="/icons/plus.svg" />

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="bg-white p-6 rounded-md w-1/3 space-y-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-serif mb-4">Post a New Update</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <textarea
            placeholder="Description"
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
          ></textarea>

          <div className="mt-4">
            <label>
              <input
                type="checkbox"
                checked={isToday}
                onChange={(e) => {
                  setIsToday(e.target.checked);
                  if (e.target.checked) {
                    setCustomDate("");
                  }
                }}
              />
              <span className="pl-2">Use today's date</span>
            </label>
          </div>

          {!isToday && (
            <div className="mt-4">
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}

          <div className="mt-4 flex justify-between">
            <button
              onClick={postUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Post Update
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer />
    </>
  );
}
