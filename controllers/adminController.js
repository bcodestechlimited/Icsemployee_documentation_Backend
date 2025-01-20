const { sendMail } = require("./authController");
const { validationResult } = require("express-validator");
const ClientList = require("../models/clientList");

const sendEmployeeMessage = (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      data: errors.array(),
    });
  const { isAdmin } = req;
  if (!isAdmin) res.status(500).json({ message: "User must be an admin" });
  const { emails, message } = req.body;
  try {
    const result = sendMail(
      emails,
      message,
      "message_template",
      "ICS Outsourcing"
    );
    if (result) res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addClientList = async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      data: errors.array(),
    });
  const { isAdmin } = req;
  if (!isAdmin) res.status(500).json({ message: "User must be an admin" });
  const client = req.body;
  try {
    const foundClient = await ClientList.findOne({ name: client.name });
    if (foundClient) res.status(409).json({ message: "client already exist" });
    const result = await ClientList.create({ name: client.name });
    res
      .status(200)
      .json({ message: "Client added successfully", data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateClientList = async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      data: errors.array(),
    });
  const { isAdmin } = req;
  if (!isAdmin) res.status(500).json({ message: "User must be an admin" });
  const { name } = req.body;
  const { id } = req.params;
  try {
    const found = await ClientList.findOne({ _id: id }).exec();
    if (!found)
      res.status(404).json({ message: "id does not match any client" });

    found.name = name;
    await found.save();
    res.status(200).json({ message: "Cient updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteClientList = async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      data: errors.array(),
    });
  const { isAdmin } = req;
  if (!isAdmin) res.status(500).json({ message: "User must be an admin" });
  const { id } = req.params;
  try {
    const found = await ClientList.deleteOne({ _id: id }).exec();
    res
      .status(200)
      .json({ message: "Client deleted successfully", data: found });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getClientLists = async (req, res) => {
  try {
    const client = await ClientList.find();
    if (!client) return res.status(204).json({ message: "No client found." });
    // await users.save();
    res.status(200).json({ data: client });
  } catch (err) {
    console.error({ err });
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  sendEmployeeMessage,
  addClientList,
  updateClientList,
  deleteClientList,
  getClientLists,
};
