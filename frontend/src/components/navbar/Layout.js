import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/admin",
    "/formateur",
    "/apprenant",
    "/profile",
    "/formateur/my-formations",
    "/formateur/add-formation",
  ];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

export default Layout;
