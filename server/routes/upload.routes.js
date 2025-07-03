import express from "express";
import multer from "multer";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

//multer storage config

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//file filter accept only xls or .xlsx fie
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type only xls or xlsx (Excel files allowed)"));
  }
};

const upload = multer({ storage, fileFilter });

router.get("/test", (req, res) => {
  res.send("Upload route is connected ✅");
});


//Post api/upload

router.post("/", protect, upload.single("file"), (req, res) => {
  try {
    console.log("Upload route hit ✅");
    console.log("User:", req.user);
    console.log("File:", req.file);

    const filePath = req.file.path;
    //REad file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    //clean temp files
    fs.unlinkSync(filePath);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: "File upload failed", error: err.message });
  }
});

export default router;