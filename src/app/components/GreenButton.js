"use client";

import Image from "next/image";

export default function GreenButton({ onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-10 right-10 z-30 bg-green-700 text-white p-6 rounded-full flex items-center gap-2  hover:bg-green-800"
    >
      {icon && <Image src={icon} alt="Button icon" width={20} height={20} />}
    </button>
  );
}
