require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "default_secret";
const express = require("express");
const cors = require("cors");
const app = express();
const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "backend_test",
  password: process.env.DB_PASSWORD || "bklmdr24",
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/api/employee", async (req, res) => {
  try {
    const {
      full_name,
      nik,
      gender,
      place_of_birth,
      date_of_birth,
      phone,
      province,
      subdistrict,
      district,
      regency,
      address,
      username,
      email,
      password,
      tipe,
      type_other,
      contract_start_date,
      contract_end_date,
      marital_status,
      bpjs_doctor_code,
    } = req.body;
    const result = await pool.query(
      `INSERT INTO employee 
      (full_name, nik, gender, place_of_birth, date_of_birth, phone, province, subdistrict, district, regency, address, username, email, password, tipe, type_other, contract_start_date, contract_end_date, marital_status, bpjs_doctor_code) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) 
      RETURNING id`,
      [
        full_name,
        nik,
        gender,
        place_of_birth,
        date_of_birth,
        phone,
        province,
        subdistrict,
        district,
        regency,
        address,
        username,
        email,
        password,
        tipe,
        type_other,
        contract_start_date,
        contract_end_date,
        marital_status,
        bpjs_doctor_code,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan pada server");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
