const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profilePics");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/profilePics", express.static("profilePics"));
app.use(express.static(path.join(__dirname, "./client/build")));

app.post("/signup", upload.single("profilePic"), async (req, res) => {
  console.log(req.file);

  try {
    let signedUpUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      email: req.body.email,
      password: req.body.password,
      mobileNo: req.body.mobileNo,
      profilePic: req.file.path,
    });

    await signedUpUser.save();

    res.json({ status: "success", msg: "Created account successfully." });
  } catch (err) {
    res.json({ status: "failure", msg: "Unable to create account." });
  }
});

app.post("/login", upload.none(), async (req, res) => {
  console.log(req.body);

  let userData = await User.find().and({ email: req.body.email });

  console.log(userData);
  if (userData.length > 0) {
    if (userData[0].password == req.body.password) {
      let userDetalsToSend = {
        firstName: userData[0].firstName,
        lastName: userData[0].lastName,
        age: userData[0].age,
        email: userData[0].email,
        mobileNo: userData[0].mobileNo,
        profilePic: userData[0].profilePic,
      };

      res.json({
        status: "success",
        data: userDetalsToSend,
        msg: "Email and Password are correct.",
      });
    } else {
      res.json({ status: "failure", msg: "Invalid Password." });
    }
  } else {
    res.json({ status: "failure", msg: "User doesnot exist." });
  }
});

// app.get("*", (req, res) => {
//   res.sendFile("./client/build/index.html");
// });

app.listen(4567, () => {
  console.log("Listening to port 4567");
});

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  mobileNo: String,
  profilePic: String,
});

let User = new mongoose.model("user", userSchema, "users");

let connectToMDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://manjunadhb:manjunadhb@batch2501cluster.efxdba2.mongodb.net/BRNDB?retryWrites=true&w=majority&appName=Batch2501Cluster"
    );
    console.log("Successfully connected to MDB");
  } catch (err) {
    console.log(err);
    console.log("Unable to connect to MDB");
  }
};

connectToMDB();
