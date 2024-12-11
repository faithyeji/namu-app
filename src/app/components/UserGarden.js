import React from "react";
import Link from "next/link";

const UserGarden = ({ user }) => {
  const bgColor =
    user.color === "red"
      ? "bg-red-100"
      : user.color === "gray"
      ? "bg-gray-100"
      : user.color === "green"
      ? "bg-green-50"
      : "bg-white";
  return (
    <Link href={`/pages/garden/${user.id}`}>
      <div className={`p-4 ${bgColor} border-neutral-300 border rounded-md`}>
        <h1 className="font-serif">{user.name}'s Garden</h1>
      </div>
    </Link>
  );
};

export default UserGarden;
