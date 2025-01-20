const User = require("../models/user");

const getUser = async (req, res) => {
  const { id } = req;
  console.log(id);
  try {
    let user = await User.findById(id)
      .select("-password")
      .populate("personalInfo")
      .populate("guarantors")
      .populate("employeeDetails")
      .populate("signature")
      .exec();
    if (!user) return res.status(500).json({ message: `Invalid Token` });

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      data: [{ message: `Server: ${error.message}`, path: "server" }],
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("personalInfo")
      .populate("employeeDetails");
    if (!users) return res.status(204).json({ message: "No users found." });
    users.forEach(async (user) => {
      if (
        user.personalInfo &&
        user.guarantors?.length > 0 &&
        user.employeeDetails &&
        user.signature
      ) {
        user.completed = true;
      } else {
        user.completed = false;
      }
      await user.save();
    });
    res.json(users);
  } catch (err) {
    console.error({ err });
  }
};
const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "User ID required" });
  try {
    const user = await User.findOne({ _id: id })
      .select("-password")
      .populate("personalInfo")
      .populate("guarantors")
      .populate("education")
      .populate("certificates")
      .populate("employeeDetails")
      .populate("signature")
      .exec();
    if (!user) return res.status(400).json({ message: `User not found` });
    res.json({ msg: `User retrieved successfully`, data: user });
  } catch (error) {
    return res.status(500).json({
      data: [{ msg: `Server: ${error.message}` }],
    });
  }
};

const testUser = async (req, res) => {
  const user = await User.deleteMany({
    email: { $regex: /.*@icsoutsourcing.com/, $options: "s" },
  });
  // const user = await User.find();
  res.send(user);
};

module.exports = {
  getUser,
  getUsers,
  getUserById,
  testUser,
};
