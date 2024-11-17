// /middleware/roleMiddleware.js
const checkRole = (roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).send({ error: 'Access denied' });
      }
      next();
    };
  };
  
  module.exports = { checkRole };
  