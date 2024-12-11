"use client";

import { useState, useEffect } from "react";
import UserGarden from "./components/UserGarden";

export default function Home() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch("http://localhost:4000/users", {
          headers: {
            Accept: "application/json",
          },
        });
        const data = await response.json();
        setUsers(data);
        console.log(data);
      } catch (error) {
        setUsers([]);
        console.log(error);
      }
    };

    getUsers();
  }, []);

  return (
    <main className="m-20">
      <h1 className="font-serif text-2xl text-yellow-950">All Gardens</h1>
      <div className="flex gap-2 mt-4">
        {users.length === 0 ? (
          <p>Loading gardens...</p>
        ) : (
          users.map((user) => <UserGarden key={user.id} user={user} />)
        )}
      </div>
    </main>
  );
}
