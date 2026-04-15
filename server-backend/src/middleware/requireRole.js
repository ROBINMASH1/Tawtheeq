const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const hasRole = roles.includes(req.user.roleModel) || 
                    (req.user.profile && roles.includes(req.user.profile.role));

    if (!hasRole) {
      return res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
    }
    next();
  };
};

module.exports = { requireRole };
