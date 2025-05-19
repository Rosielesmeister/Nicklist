const token = jwt.sign(
    {
      userId: user._id,
      isAdmin: user.admin, 
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  