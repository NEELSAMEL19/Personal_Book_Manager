"use client";

const Navbar = () => {
  return (
    <nav className="flex items-center h-12 py-2 justify-between shadow-sm bg-white border-b border-gray-200 md:px-10 px-4">
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <span className="theme-text text-2xl font-semibold text-theme-text">
            Book-Manager
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
