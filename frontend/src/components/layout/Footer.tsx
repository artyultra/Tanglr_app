// File: components/layout/Footer.tsx
"use client";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-center py-4 text-xs">
      <div className="max-w-6xl mx-auto">
        <p className="mb-1">
          &copy; 2025 Tanglr - A MySpace-inspired Social Network
        </p>
        <p>All rights reserved | Made with ❤️ and nostalgia</p>
      </div>
    </footer>
  );
};

export default Footer;
