"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [userId, setUserId] = useState(null);

  // extracting id
  useEffect(() => {
    const pathParts = pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    if (pathname.startsWith("/pages/garden") && id) {
      setUserId(id);
    }
  }, [pathname]);

  const isActive = (path) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="flex flex-col fixed top-1/3 left-6 bg-neutral-100 border-solid border border-neutral-300 p-4 gap-4 rounded-md z-40">
      {/* {pathname.startsWith("/pages/garden") && userId && (
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-md ${
            isActive("/pages/actions") ? "bg-neutral-200" : "bg-transparent"
          }`}
        >
          <img src="/icons/shovel.svg" className="w-6"></img>
        </div>
      )} */}
      <Link href="/">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-md ${
            isActive("/") ? "bg-neutral-200" : "bg-transparent"
          }`}
        >
          <img src="/icons/pot.svg" className="w-6"></img>
        </div>
      </Link>
      <Link href="/pages/favorites">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-md ${
            isActive("/pages/favorites") ? "bg-neutral-200" : "bg-transparent"
          }`}
        >
          <img src="/icons/heart.svg" className="w-6"></img>
        </div>
      </Link>
      {(pathname.startsWith("/pages/garden") ||
        pathname.startsWith("/pages/settings")) &&
        userId && (
          <Link href={`/pages/settings/${userId}`}>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-md ${
                isActive("/pages/settings")
                  ? "bg-neutral-300"
                  : "bg-transparent"
              }`}
            >
              <img src="/icons/settings.svg" className="w-6"></img>
            </div>
          </Link>
        )}
    </nav>
  );
};

export default Sidebar;
