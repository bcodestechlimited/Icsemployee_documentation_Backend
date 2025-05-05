const { validationResult } = require("express-validator");
const multer = require("multer");
const multi_upload = require("../middleware/multer");
const EmployeeDetails = require("../models/employeeDetails");
const PersonalInfo = require("../models/personalInfo");
const Education = require("../models/education");
const Certificate = require("../models/certificates");
const User = require("../models/user");
const Guarantor = require("../models/guarantors");
const Signature = require("../models/signature");
const ClientList = require("../models/clientList");
const {
  fileUploader,
  validatePassport,
} = require("../middleware/fileUploader");

const addPersonalDetails = async (req, res) => {
  let errors = validationResult(req);
  if (req?.query?.prevalidate) return res.json({ msg: "Validation Complete" });
  const { id } = req;
  const formData = req.body;

  try {
    if (!errors.isEmpty())
      return res.status(400).json({
        data: errors.array(),
      });
    const foundUser = await User.findOne({ _id: id });
    if (!foundUser) return res.sendStatus(403); //invalid token
    const duplicate = await PersonalInfo.findOne({ user: id }).exec();
    if (duplicate) await PersonalInfo.deleteOne({ user: id });
    // return res
    //   .status(409)
    //   .json({ message: "User Already filled personal info" }); //Conflict
    const result = await PersonalInfo.create({
      ...formData,
      passport: {
        publicId: "",
        url: "",
      },
      user: id,
    });
    foundUser.personalInfo = result._id;
    await foundUser.save();
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const updatePersonalDetails = async (req, res) => {
  const {
    id,
    firstName,
    lastName,
    otherName,
    email,
    officialEmail,
    phone,
    address,
    closestBusStop,
    stateOfOrigin,
    localGovernment,
    homeTownAddress,
    nin,
    bvn,
    dob,
    gender,
    nationality,
    maritalStatus,
  } = req.body;
  if (!id) {
    return res.status(400).json({ message: `user Id is required` });
  }
  const info = await PersonalInfo.findOne({ user: id }).exec();
  if (!info) {
    return res.status(404).json({ message: `No employee matches ID ${id}.` });
  }
  if (firstName) info.firstName = firstName;
  if (lastName) info.lastName = lastName;
  if (otherName) info.otherName = otherName;
  if (email) info.email = email;
  if (officialEmail) info.officialEmail = officialEmail;
  if (phone) info.phone = phone;
  if (address) info.address = address;
  if (closestBusStop) info.closestBusStop = closestBusStop;
  if (stateOfOrigin) info.stateOfOrigin = stateOfOrigin;
  if (localGovernment) info.localGovernment = localGovernment;
  if (homeTownAddress) info.homeTownAddress = homeTownAddress;
  if (nin) info.nin = nin;
  if (bvn) info.bvn = bvn;
  if (dob) info.dob = dob;
  if (gender) info.gender = gender;
  if (nationality) info.nationality = nationality;
  if (maritalStatus) info.maritalStatus = maritalStatus;
  const result = await info.save();
  res.status(200).json({ message: "Edited successfully", data: result });
};

const getPersonalDetailsByUserId = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "User ID required" });
  try {
    const info = await PersonalInfo.findOne({ user: id }).exec();
    res.json({ msg: `Info retrieved successfully`, data: info });
  } catch (error) {
    return res.status(500).json({
      data: [{ msg: `Server: ${error.message}` }],
    });
  }
};

const addEmployeeDetails = async (req, res) => {
  const { id } = req;
  const formData = req.body;
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        data: errors.array(),
      });

    const foundUser = await User.findOne({ _id: id }).exec();
    const client = await ClientList.findOne({
      name: formData.secondedTo,
    }).exec();

    const duplicate = await EmployeeDetails.findOne({ user: id }).exec();
    if (duplicate)
      return res
        .status(409)
        .json({ message: "User Already filled employee details" }); //Conflict
    const result = await EmployeeDetails.create({
      ...formData,
      user: id,
    });
    foundUser.employeeDetails = result._id;
    await foundUser.save();
    client.employees.push(foundUser);
    await client.save();
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const updateEmployeDetails = async (req, res) => {
  const { id, employeeId, secondedTo, salaryAccountNumber, bankName } =
    req.body;
  if (!id) {
    return res.status(400).json({ message: `user Id is required` });
  }
  const info = await EmployeeDetails.findOne({ user: id }).exec();
  if (!info) {
    return res.status(404).json({ message: `No user matches ID ${id}.` });
  }
  if (employeeId) info.employeeId = employeeId;
  if (secondedTo) info.secondedTo = secondedTo;
  if (salaryAccountNumber) info.salaryAccountNumber = salaryAccountNumber;
  if (bankName) info.bankName = bankName;
  const result = await info.save();
  res.status(200).json({ message: "Edited successfully", data: result });
};

const getEmployeeDetailsByUserId = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "User ID required" });
  try {
    const employee = await EmployeeDetails.findOne({ user: id }).exec();
    if (!employee)
      res.json({ msg: `Info retrieved successfully`, data: employee });
  } catch (error) {
    return res.status(500).json({
      data: [{ msg: `Server: ${error.message}` }],
    });
  }
};

const addEducationalBackground = async (req, res) => {
  const { id } = req;
  const formData = req.body;

  try {
    let errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        data: errors.array(),
      });

    const foundUser = await User.findOne({ _id: id }).exec();
    if (!foundUser) return res.sendStatus(403); //invalid token

    const arrs = formData.map((arr) => ({ ...arr, user: id }));
    const result = await Education.create(arrs);
    foundUser.education = result;
    await foundUser.save();
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getEducationByUserId = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "User ID required" });
  try {
    const education = await Education.findOne({ user: id }).exec();
    if (!education)
      res.json({ msg: `Education retrieved successfully`, data: education });
  } catch (error) {
    return res.status(500).json({
      data: [{ msg: `Server: ${error.message}` }],
    });
  }
};

const addCertificates = async (req, res) => {
  const { id } = req;
  const formData = req.body;

  try {
    let errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        data: errors.array(),
      });

    const foundUser = await User.findOne({ _id: id }).exec();
    // if (!foundUser) return res.sendStatus(403); //invalid token

    const arrs = formData.map((arr) => ({ ...arr, user: id }));
    const result = await Certificate.create(arrs);
    console.log(result);
    foundUser.certificates = result;
    await foundUser.save();
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getCertificatesByUserId = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "User ID required" });
  try {
    const certificate = await Certificate.findOne({ user: id }).exec();
    res.json({ msg: `Info retrieved successfully`, data: certificate });
  } catch (error) {
    return res.status(500).json({
      data: [{ msg: `Server: ${error.message}` }],
    });
  }
};

const addGuarantors = async (req, res, next) => {
  const { id } = req;
  const files = req.files;

  try {
    const foundUser = await User.findOne({ _id: id }).exec();
    if (!foundUser) res.status(409).json({ message: "Bad token" });

    // upload files
    const myFiles = await Promise.all(
      files.map((file) => fileUploader(file.path))
    );
    const arrs = myFiles.map((arr, idx) => ({
      guarantor: {
        publicId: arr.data.public_id,
        url: arr.data.url,
      },
      user: id,
      target: idx + 1,
    }));
    const result = await Guarantor.create(arrs);
    foundUser.guarantors = result;
    await foundUser.save();
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const updateGuarantors = async (req, res, next) => {
  const { id } = req;
  const body = req.body;
  const files = req.files;

  try {
    console.log({ files });
    console.log({ id });
    console.log({ body: body });
    // const foundUser = await User.findOne({ _id: id })
    //   .populate("guarantors")
    //   .exec();
    // console.log({ foundUser });
    if (files.length > 1) {
    }
    const guarantors = await Guarantor.find({ user: id });
    console.log({ guarantors: guarantors[0]?.guarantor });
    console.log({ guarantorsS: guarantors });

    // if (!foundUser) return res.status(409).json({ message: "Bad token" });

    // check the length of files coming in

    // upload files
    const myFiles = await Promise.all(
      files.map((file) => fileUploader(file.path))
    );

    const getTarget = (string) => {
      return string.split("[")[0];
    };

    const arrs = myFiles.map((arr, idx) => ({
      guarantor: {
        publicId: arr.data.public_id,
        url: arr.data.url,
      },
      user: id,
      target: getTarget(files[idx].fieldname),
    }));
    console.log({ arrs });

    const updates = await Promise.all(
      arrs.map(async (arr) => {
        const guarantor = guarantors.find(
          (item) => item?.target === arr.target
        );
        let updated;
        if (!guarantor) {
          updated = await Guarantor.create(arr);
        } else {
          updated = await Guarantor.findOneAndReplace({
            target: arr.target,
            arr,
          });
        }
        return updated;
      })
    );

    console.log({ updates });

    const allGuarantors = await Guarantor.find({ user: id });
    const allId = allGuarantors.map((guarantor) => guarantor._id);
    const user = await User.findOne({ _id: id });
    user.guarantors = allId;
    await user.save();
    res.status(201).json({ message: "Updated Successfully", data: updates });
    // throw new Error("Still Working");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getGuarantorsByUserId = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "User ID required" });
  try {
    const guarantors = await Guarantor.find({ user: id }).exec();
    res.json({ msg: `Guarantor retrieved successfully`, data: guarantors });
  } catch (error) {
    return res.status(500).json({
      data: [{ msg: `Server: ${error.message}` }],
    });
  }
};

// const uploadPassport = async (req, res) => {
//   const { id } = req;
//   const file = req.file;
//   if (!file) return res.status(500).json({ message: "Image was not uploaded" });
//   try {
//     console.log({ id });

//     const profile = await PersonalInfo.findOne({ user: id }).exec();

//     console.log({ profile });

//     if (!profile) return res.status(401).json({ message: Unauthorized });

//     await validatePassport(file.path);
//     const { status, data, message } = await fileUploader(file.path);
//     if (!status) return res.status(400).json({ message });
//     profile.passport = { publicId: data.public_id, url: data.secure_url };
//     // profile.passport = data.secure_url;
//     await profile.save();
//     res.status(200).json({ message: "Passport uploaded successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

const uploadPassport = async (req, res) => {
  const { id } = req;
  const file = req.file;
  if (!file) return res.status(500).json({ message: "Image was not uploaded" });
  try {
    await validatePassport(file.path);
    const { status, data, message } = await fileUploader(file.path);
    if (!status) return res.status(400).json({ message });

    const updatedProfile = await PersonalInfo.findOneAndUpdate(
      { user: id },
      { passport: { publicId: data.public_id, url: data.secure_url } },
      { new: true }
    );

    if (!updatedProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found or update failed" });
    }

    res.status(200).json({ message: "Passport uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const addSignature = async (req, res) => {
  const { id } = req;
  const file = req.file;
  console.log({ file });
  if (!file) return res.status(500).json({ message: "Image was not uploaded" });
  try {
    const foundUser = await User.findOne({ _id: id }).exec();
    if (!foundUser) res.status(409).json({ message: "Bad token" });
    if (foundUser.signature)
      res.status(400).json({ message: "signature has already been uploaded" });
    const { status, data, message } = await fileUploader(file.path);
    if (!status) res.status(400).json({ message });
    const result = await Signature.create({
      signature: { publicId: data.public_id, url: data.url },
      user: id,
    });
    foundUser.signature = result;
    await foundUser.save();
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const updateSignature = async (req, res) => {
  const { id } = req.body;
  const file = req.file;
  if (!file) return res.status(401).json({ message: "Image was not uploaded" });
  try {
    const { status, data, message } = await fileUploader(file.path);
    if (!status) res.status(400).json({ message });
    const sign = await Signature.findOne({ _id: id });
    sign.signature = { publicId: data.public_id, url: data.url };
    await sign.save();
    res.status(201).json({ message: "Update Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getSignatureByUserId = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "User ID required" });
  try {
    const signature = await Signature.findOne({ user: id }).exec();
    res.json({ msg: `Info retrieved successfully`, data: signature });
  } catch (error) {
    return res.status(500).json({
      data: [{ msg: `Server: ${error.message}` }],
    });
  }
};

module.exports = {
  addPersonalDetails,
  addEmployeeDetails,
  addEducationalBackground,
  addCertificates,
  uploadPassport,
  addGuarantors,
  addSignature,
  getPersonalDetailsByUserId,
  getEmployeeDetailsByUserId,
  getEducationByUserId,
  getCertificatesByUserId,
  getGuarantorsByUserId,
  getSignatureByUserId,
  updatePersonalDetails,
  updateEmployeDetails,
  updateGuarantors,
  updateSignature,
};
