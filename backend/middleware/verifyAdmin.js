const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé : admin uniquement.' });
    }
    next();
  };
  
  export default verifyAdmin;
  