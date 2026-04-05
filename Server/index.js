import pool from "./databaseConfig/database.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const users = [
  { username: "JamesMwangi", email: "jamesMwangi@example.com",   password: "james456",   role: "Admin"},
  { username: "EugeneCoaches", email: "eugeneCoaches@example.com", password: "eugene123", role: "Admin"},
  { username: "SarahOdhiambo", email: "sarahOdhiambo@example.com", password: "sarah456",   role: "User"},
  { username: "DavidKimutai", email: "davidKimutai@example.com",  password: "david911",   role: "Manager"},
  { username: "GraceWanjiku", email: "graceWanjiku@example.com",  password: "grace123",   role: "User"},
  { username: "BrianOtieno", email: "brianOtieno@example.com",   password: "brian123",   role: "User"},
  { username: "MosesWaniki", email: "mosesWaniki@example.com",   password: "moses123",   role: "User"}, 
  { username: "TrevorMwangi", email: "trevorMwangi@example.com",   password: "trevor123",   role: "Manager"},
  { username: "MikeMuchiri",email: "mikeMuchiri@example.com",   password: "mike411",   role: "User" },
  {username: "SusanWanjiru",email: "susanwanjiru@example.com",   password: "susan123",   role: "User" },
  {username: "VictorKiamba",email: "victorkiamba@example.com",   password: "victor768",   role: "User" },
  {username: "MichaelMwangi",email: "michealmwangi@gmail.com",   password: "michael456",   role: "User" },
];

async function seedUsers() {
  try {

    await pool.query("USE tms_db");

    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('User', 'Manager', 'Admin') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    for (const u of users) {
      const hashedPassword = await bcrypt.hash(u.password, SALT_ROUNDS);
      const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");

      const [result] = await pool.query(
        "INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)",
        [u.username, u.email, hashedPassword, u.role, created_at]
      );

      console.log(`✅ Added: ${u.username} (${u.role}) — ID: ${result.insertId}`);
    }

    const [rows] = await pool.query("SELECT id, username, email, role, created_at FROM users");
    console.log("\n📋 All users:");
    console.table(rows);

  } catch (error) {
    console.error("Error seeding users:", error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seedUsers();
