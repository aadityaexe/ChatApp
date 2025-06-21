// Singup a new user

import { generateToken } from "../Lib/utils";
import User from "../models/User";
import User from "../models/User";

export const signup = async (req, res) => {
  const { email, fullName, password, bio } = req.body;
  try {
    if (!email || !fullName || !password || !bio) {
      return res.json({
        success: false,
        message: "missing details",
      });
    }
    const User = await User.findOne({ email });
    if (User) {
      return res.json({
        success: false,
        message: "Account already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Login a user

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData,
      token,
      message: "Login successfully",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
