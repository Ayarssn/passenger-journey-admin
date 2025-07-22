// empêcher un utilisateur passenger d’utiliser des routes admin
export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
};
