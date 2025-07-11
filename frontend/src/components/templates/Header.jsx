import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200">
      <h1 className="text-2xl font-bold text-primary">Loople</h1>
      <nav className="flex gap-4">
        <Link to="/signup" className="hover:underline">회원가입</Link>
        <Link to="/" className="hover:underline">Home</Link>
      </nav>
    </header>
  );
}