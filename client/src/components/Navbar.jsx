import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets, menuLinks } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import {motion} from 'motion/react'
const Navbar = () => {
  const {
    setShowLogin,
    user,
    logout,
    isOwner,
    axios,
    setIsOwner,
    fetchUser,
  } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

 
  const [searchInput, setSearchInput] = useState("");


  useEffect(() => {
    if (user) {
      toast.dismiss(); 
      toast.success(`Welcome ${user.name || "back"}!`);
    }
  }, [user]);


  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
        fetchUser(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please log in first");
        setShowLogin(true);
        return;
      }
      toast.error(error.message);
    }
  };

 
  const handleSearch = () => {
    if (searchInput.trim() === "") return;
    navigate(`/cars?search=${encodeURIComponent(searchInput.trim())}`);
    setSearchInput("");
    setOpen(false); 
  };

  return (
    <motion.div
   initial={{y:-20,opacity:0}}
   animate={{y:0,opacity:1}}
   transition={{duration:0.5}}


      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === "/" ? "bg-light" : "bg-white"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <motion.img whileHover={{scale:1.05}} src={assets.logo} alt="logo" className="h-8" />
      </Link>

      {/* Menu Section */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
          location.pathname === "/" ? "bg-light" : "bg-white"
        } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {/* Search bar */}
        <div className="flex items-center text-sm gap-2 border border-borderColor px-3 py-1.5 rounded-full max-w-56 w-full sm:w-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search cars"
          />
          <img
            src={assets.search_icon}
            alt="search"
            className="w-4 h-4 cursor-pointer"
            onClick={handleSearch}
          />
        </div>

        {/* Right-side buttons */}
        <div className="flex max-sm:flex-col items-start sm:items-center gap-4">
          <button
            onClick={() => (isOwner ? navigate("/owner") : changeRole())}
            className="cursor-pointer hover:text-primary transition-colors"
          >
            {isOwner ? "Dashboard" : "List cars"}
          </button>

          <button
            onClick={() => {
              if (user) {
                logout();
                setIsOwner(false);
              } else {
                setShowLogin(true);
              }
            }}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* Mobile menu toggle */}
      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </motion.div>

  );
};

export default Navbar;

