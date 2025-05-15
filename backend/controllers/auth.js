// When creating a JWT token (in  login/signup controller)
const token = jwt.sign(
    {
      userId: user._id,
      isAdmin: user.admin, // Include the admin status in the token
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  