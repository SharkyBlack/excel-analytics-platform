  import express from "express";
  import bcrypt from "bcrypt";
  import User from "../models/User.js";
  import jwt from "jsonwebtoken";
 

  const router = express.Router();

  //register
  router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      res.status(201).json({ message: "User registerd successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  //login

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "INvalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
      );
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: "Server error error", err });
    }
  });

  export default router;
