import React, { createContext, useContext, useState, useEffect } from "react";
import { authUtils } from "../utils/authUtils";
import { useNavigate } from "react-router";
import LoadingScreen from "../components/global/LoadingScreen";
import { toastSuccess } from "../components/global/NotificationToast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const token = authUtils.getToken()
      if (!token) {
        return toastSuccess("on user context token not found!")
      }
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/vite/dealer/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      // console.log("token", token)
      // console.log("response.status", response.status)
      if (response.status === 401) {
        authUtils.removeToken();
        return;
      }

      if (!response.ok) throw new Error("issue while fetching user on context");

      const { data } = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("error while fetching user data on context:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
