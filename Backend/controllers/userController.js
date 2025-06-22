import cloudinary from "../Lib/cloudinary.js";
import { generateToken } from "../Lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
// Singup a new user
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!email || !fullName || !password || !bio) {
      return res.json({
        success: false,
        message: "missing details",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "Account already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
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

    const token = generateToken(userData._id);

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

//  controller to check if user i authenticated

export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// controller to update user profile details

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, bio } = req.body;
    const userId = req.user._id;

    let updateUser;

    if (!profilePic) {
      updateUser = await User.findByIdAndUpdate(
        userId,
        {
          fullName,
          bio,
        },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updateUser = await User.findByIdAndUpdate(
        userId,
        {
          fullName,
          bio,
          profilePic: upload.secure_url,
        },
        { new: true }
      );
    }

    res.json({
      success: true,
      user: updateUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
