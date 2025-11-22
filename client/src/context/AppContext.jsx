import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // Fetch user data
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("User not logged in — fetchUser ignored");
        return;
      }
      toast.error(error.message);
    }
  };

  // Fetch cars depending on user role
  const fetchCars = async () => {
    try {
      let url = "/api/user/cars"; // default for normal users
      if (isOwner) {
        url = "/api/owner/cars"; // owner-specific cars
      }

      const { data } = await axios.get(url);
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("User not logged in — fetchCars ignored");
        return;
      }
      console.warn("Failed to fetch cars:", error.message);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common["Authorization"] = "";
    toast.success("You have been logged out");
  };

  // On token change, set auth header and fetch user
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    }
  }, [token]);

  // After user data is loaded, fetch cars (owner or all)
  useEffect(() => {
    if (user) {
      fetchCars();
    }
  }, [user]);

  // Restore token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
