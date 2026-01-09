const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Student = require("./models/Student");

const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

const students = [
  {
    studentId: "101",
    name: "Student A",
    email: "studenta@example.com",
    department: "Computer Science",
    year: "1st Year",
    course: "B.Tech"
  },
  {
    studentId: "102",
    name: "Student B",
    email: "studentb@example.com",
    department: "Computer Science",
    year: "1st Year",
    course: "B.Tech"
  },
  {
    studentId: "103",
    name: "Student C",
    email: "studentc@example.com",
    department: "Information Technology",
    year: "2nd Year",
    course: "B.Tech"
  },
  {
    studentId: "104",
    name: "Student D",
    email: "studentd@example.com",
    department: "Electronics",
    year: "2nd Year",
    course: "B.Tech"
  },
  {
    studentId: "105",
    name: "Student E",
    email: "studente@example.com",
    department: "Mechanical",
    year: "3rd Year",
    course: "B.Tech"
  },
  {
    studentId: "106",
    name: "Student F",
    email: "studentf@example.com",
    department: "Civil",
    year: "4th Year",
    course: "B.Tech"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing students to avoid duplicates for this request
    await Student.deleteMany({});
    console.log("Cleared existing students.");

    await Student.insertMany(students);
    console.log("Successfully added 6 students to the database.");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
