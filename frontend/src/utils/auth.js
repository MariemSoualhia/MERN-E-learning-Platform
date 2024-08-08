export const isUserAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Renvoie true si le token existe, sinon false
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("currentuser");
  return user ? JSON.parse(user) : null;
};
