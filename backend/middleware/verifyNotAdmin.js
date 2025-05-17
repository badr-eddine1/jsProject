const verifyNotAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return res.status(403).json({ message: "Accès refusé : les admins ne peuvent pas accéder à cette ressource." });
    }
    next();
  };
  
  export default verifyNotAdmin;
  