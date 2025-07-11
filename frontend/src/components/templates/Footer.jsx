import React from "react";

export default function Footer() {
  return (
    <footer className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Loople. All rights reserved.
    </footer>
  );
}