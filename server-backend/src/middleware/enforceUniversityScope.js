
//Ensures that Uniadmin and UniStaff can only access or modify data belonging to their own university.
const enforceUniversityScope = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // MoheAdmin has global access, bypass scope check
    if (user.roleModel === "MoheAdmin") {
      return next();
    }

    if (user.roleModel === "uniUser") {
      const universityId = user.profile?.university;

      if (!universityId) {
        return res.status(403).json({ error: "University profile not found for user" });
      }

      if (req.body && req.body.university && req.body.university.toString() !== universityId.toString()) {
        return res.status(403).json({ error: "Cannot perform actions for a different university" });
      }

      if (req.query && req.query.university && req.query.university.toString() !== universityId.toString()) {
        return res.status(403).json({ error: "Cannot query data for a different university" });
      }

      req.universityScope = universityId;
    }

    next();
  } catch (error) {
    console.error("Scope Enforcement Error:", error);
    res.status(500).json({ error: "Internal Server Error during scope validation" });
  }
};

module.exports = { enforceUniversityScope };
