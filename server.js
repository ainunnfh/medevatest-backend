const db = require("./db");
require("dotenv").config();
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

app.get("/api/employee", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employee ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/employee/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query("SELECT * FROM employee WHERE id = $1", [
      id,
    ]);
    if (result.rows.length < 1) {
      res.status(404).json({ message: "Employee not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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

app.put("/api/employee/:id", (req, res) => {
  const { id } = req.params;
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

  if (
    !full_name ||
    !nik ||
    !gender ||
    !place_of_birth ||
    !date_of_birth ||
    !phone ||
    !province ||
    !subdistrict ||
    !district ||
    !regency ||
    !address ||
    !username ||
    !email ||
    !password ||
    !tipe ||
    !contract_start_date ||
    !marital_status
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  const tipeString = JSON.stringify(tipe);

  const query = `
  UPDATE employee
  SET 
    full_name = $1, 
    nik = $2, 
    gender = $3, 
    place_of_birth = $4, 
    date_of_birth = $5, 
    phone = $6, 
    province = $7, 
    subdistrict = $8, 
    district = $9, 
    regency = $10, 
    address = $11, 
    username = $12, 
    email = $13, 
    password = $14, 
    tipe = $15, 
    type_other = $16, 
    contract_start_date = $17, 
    contract_end_date = $18, 
    marital_status = $19, 
    bpjs_doctor_code = $20
  WHERE id = $21;
`;

  // Eksekusi query untuk update data
  db.query(
    query,
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
      tipeString,
      type_other,
      contract_start_date,
      contract_end_date,
      marital_status,
      bpjs_doctor_code,
      id,
    ],
    (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res
          .status(500)
          .json({ message: "Failed to update employee data", error });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      return res.status(200).json({ message: "Employee updated successfully" });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
