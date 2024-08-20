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
    "/admin/pending-formations",
    "/admin/formations",
    "/admin/formateurs",
    "/admin/apprenants",
    "/apprenant/formations",
    "/admin/pending-inscriptions",
    "/apprenant/my-enrollments",
    "/admin/enrollments",
    "/admin/contacts",
  ];

  const shouldHideNavbar =
    hideNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/apprenant/formation/") ||
    location.pathname.startsWith("/apprenant/formations/");

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
};

export default Layout;
