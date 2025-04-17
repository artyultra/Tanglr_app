// File: components/layout/NavBar.tsx

"use client";
import { signOut } from "next-auth/react";

const NavBar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white shadow px-0 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex  items-center">
          <span className="text-2xl font-bold text-white mr-6">
            <span className="text-gray-100">Bee</span>
            <span className="text-gray-700">hive</span>
          </span>
          <div className="space-x-4 flex">
            <a href="#" className="text-white hover:text-blue-300">
              Home
            </a>
            <a href="#" className="text-white hover:text-blue-300">
              Browse
            </a>
            <a href="#" className="text-white hover:text-blue-300">
              Search
            </a>
            <a href="#" className="text-white hover:text-blue-300">
              Mail
            </a>
            <a href="#" className="text-white hover:text-blue-300">
              Blog
            </a>
          </div>
        </div>
        <div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-button hover:bg-button-hover text-gray-100 hover:text-gray-400 font-bold py-1 px-7 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
