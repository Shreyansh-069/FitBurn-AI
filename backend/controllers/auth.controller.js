import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import genToken from "../utils/token.js";

async function handleSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long"
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error(`handleSignup Error: ${error}`);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid Credentials"
      });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({
        error: "Invalid Credentials"
      });
    }

    const token = genToken(user, res);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(`handleLogin Error: ${error}`);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

function handleLogout(req, res) {
  try {
    res.cookie("UID", "", {
      httpOnly: true,
      expires: new Date(0)
    });

    return res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error(`handleLogout Error: ${error}`);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

function handleGetMe(req, res) {
  try {
    return res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error(`handleGetMe Error: ${error}`);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

export {
  handleSignup,
  handleLogin,
  handleLogout,
  handleGetMe
};
