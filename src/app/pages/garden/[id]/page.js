"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Plant from "@/app/components/Plant";
import GreenButton from "@/app/components/GreenButton";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Garden() {
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState(null);

  const deletePlant = async () => {
    if (!selectedPlantId) {
      toast.error("No project selected to delete :(");
      return;
    }

    try {
      await fetch(`http://localhost:4000/projects/${selectedPlantId}`, {
        method: "DELETE",
      });
      setProjects(projects.filter((project) => project.id !== selectedPlantId));
      toast.success("Deleted project!!");
      setShowModal(false);
    } catch (error) {
      toast.error("Oops! Couldn't delete project :(");
      console.error("Error deleting project:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/users/${userId}`);

        const userData = await response.json();
        setUser(userData);

        const projectsResponse = await fetch(
          `http://localhost:4000/projects?userId=${userId}`
        );
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userId]);

  if (!user) {
    return (
      <div className="flex justify-center items-center m-auto">Loading...</div>
    );
  }

  return (
    <main className="m-10">
      <div className="flex items-center gap-4 z-20">
        <img
          src="/images/smiski.png"
          alt="Smiski"
          className="w-20 h-full"
        ></img>
        <div className="flex flex-col w-fit gap-2">
          <div className="py-2 px-5 w-fit text-2xl rounded-md bg-white border-solid border-neutral-300 border font-serif text-yellow-950">
            {user.name}'s Garden
          </div>
          <div className="flex gap-3 items-center">
            <a
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-2xl bg-neutral-200 w-fit text-sm"
            >
              {user.website}
            </a>
            <a
              href={`https://x.com/${user.x}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/icons/x.svg" alt="X" width={20} height={20} />
            </a>
            <a
              href={`https://instagram.com/${user.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/insta.svg"
                alt="Instagram"
                width={20}
                height={20}
              />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="relative">
          {projects.map((project) => (
            <Plant key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* delete plant */}
      <GreenButton
        onClick={() => setShowModal(true)}
        icon="/icons/whiteshovel.svg"
      />

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="bg-white p-6 rounded-md w-1/3 space-y-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-serif mb-4">Select a Plant to Delete</h2>
        <div className="space-y-4">
          <select
            value={selectedPlantId || ""}
            onChange={(e) => setSelectedPlantId(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">-- Select a Plant --</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <div className="mt-4 flex justify-between">
            <button
              onClick={deletePlant}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Delete
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
    </main>
  );
}
