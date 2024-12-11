"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Garden() {
  const { id: userId } = useParams(); // Extract userId from the route params
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!userId) return; // Avoid fetching if userId is missing

    const fetchData = async () => {
      try {
        const userResponse = await fetch(
          `http://localhost:4000/users/${userId}`
        );
        const userData = await userResponse.json();
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
  }, [userId]); // Dependency ensures re-fetch when userId changes

  if (!user || projects.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-4">
      <div className="flex items-center gap-4">
        <img
          src="/images/smiski.png"
          alt="Smiski"
          className="w-20 h-full"
        ></img>
        <div className="flex flex-col w-fit gap-2">
          <div className="p-3 w-fit rounded-md bg-white border-solid border-gray-300 border-2 font-serif">
            {user.name}'s Garden
          </div>
          <div className="flex gap-3 items-center">
            <a
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-xl bg-neutral-200 w-fit text-sm"
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
        <h2 className="text-xl font-bold">My Garden Projects</h2>
        <div className="relative mt-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border-2 rounded-md bg-white absolute"
              style={{
                left: `${project.positionX}px`,
                top: `${project.positionY}px`,
              }}
            >
              <h3 className="font-semibold">{project.name}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
