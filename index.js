const express = require("express");
/* เฟรมเวิร์คของ Node.js ที่ช่วยให้เราสร้างและจัดการเว็บแอปพลิเคชันได้อย่างง่ายดายและมีประสิทธิภาพ โดย Express เป็นโมดูล Node.js ที่มีความสามารถในการจัดการ HTTP request และ response โดย Express จะช่วยเราสร้าง API และเว็บแอปพลิเคชันต่างๆ โดยที่ไม่ต้องเขียนโค้ดจากศูนย์ นอกจากนี้ Express ยังช่วยให้เราสามารถใช้งาน middleware ต่างๆ เพื่อตรวจสอบการเข้าถึงและประมวลผลข้อมูลต่างๆ ก่อนจะถึง endpoint ที่เราต้องการจะใช้งาน ทำให้ Express เป็นเฟรมเวิร์คที่ได้รับความนิยมสูงในการพัฒนาแอปพลิเคชันด้าน server-side ของ JavaScript */

const cors = require("cors");
/* CORS ย่อมาจาก Cross-Origin Resource Sharing คือ การแบ่งปันข้อมูลระหว่างเว็บไซต์ที่มีโดเมนต่างกัน โดยทั่วไปแล้วเว็บไซต์จะไม่สามารถแบ่งปันข้อมูลกันได้ แต่ถ้าเราต้องการแบ่งปันข้อมูลระหว่างเว็บไซต์ที่มีโดเมนต่างกัน เราจะต้องเปิดใช้งาน CORS ก่อน โดยใน Node.js นั้นเราสามารถเปิดใช้งาน CORS ได้ด้วยการติดตั้งโมดูลชื่อว่า cors และเรียกใช้งานเพื่อเปิดใช้งาน CORS ได้เลย */

const jwt = require("jsonwebtoken");
/*JSON Web Token (JWT) เป็นมาตรฐานการสร้าง Token ที่ใช้สำหรับการรับและส่งข้อมูลระหว่างแอปพลิเคชันต่างๆ โดยทั่วไปในการสร้าง JWT จะใช้ library หรือโมดูลชื่อว่า "jsonwebtoken" ใน Node.js โดย JWT ประกอบด้วยสามส่วน คือ Header, Payload และ Signature */

const app = express();
/* เรียกใช้ express */

app.use(cors());
/* ใช้คำสั่ง app.use เพื่อใช้งาน cors ที่เราติดตั้งมา */

app.use(express.json());
/*เป็น middleware function ที่ใช้กับ Express.js ซึ่งทำหน้าที่แปลง request body ที่ส่งมาในรูปแบบ JSON ให้เป็น Object ของ JavaScript ได้ */

const users = [
  {
    id: 1,
    username: "user1",
    password: "password123",
    role: "admin",
  },
  {
    id: 2,
    username: "user2",
    password: "password456",
    role: "member1",
  },
  {
    id: 3,
    username: "user3",
    password: "password789",
    role: "member2",
  },
];
/* สร้างตัวแปร users ในรูปแบบ JSON เก็บข้อมูล username password */

const accessTokenSecret = "Sorakrit@Secret";
/* สร้างตัวแปร accessTokenSecret ในรูปแบบ String */

app.post("/api/login", (req, res) => {
  /*สร้าง http api เป็น method post สำหรับ client ส่งข้อมูลผ่าน body  */

  const { username, password } = req.body;
  /* สร้างตัวแปร username password ที่เก็บ value ตาม key ที่ request จาก body http api */

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  /*ค้นหา value จากตัวแปร users เพื่อหา username และ password ที่มีค่าตรงกับ request body ที่ client ส่งมา*/

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }
  /*สร้างเงื่อนไข ถ้า user มีข้อมูลจะส่งค่า true ทำให้ข้าม if นี้ แต่ถ้าไม่มีข้อมูล จะเข้าเงื่อนไข เพื่อ response ข้อความ  Invalid username or password และ status 401*/

  const accessToken = jwt.sign({ userId: user.id }, accessTokenSecret, {
    expiresIn: "30s",
  });
  /* สร้างตัวแปร accessToken ที่เก็บค่า token ที่ได้จากการ sign ด้วย jwt โดยมี payload เป็น userId ที่มีค่าเท่ากับ user.id และ secret เป็น accessTokenSecret */

  res.json({ token: accessToken, role: user.role });
  /* response ค่า accessToken ในรูปแบบ JSON */
});

app.post("/api/data/admin", authenticateToken, (req, res) => {
  /*สร้าง http api เป็น method post สำหรับ client ส่งข้อมูลผ่าน body และต้องผ่าน middleware authenticateToken ก่อนถึงจะเข้าถึง api นี้ได้*/
  if (req.body.role !== "admin") {
    return res.status(403).send("You do not have permission");
  }
  /* สร้างเงื่อนไข ถ้า user มีข้อมูลจะส่งค่า true ทำให้ข้าม if นี้ แต่ถ้าไม่มีข้อมูล จะเข้าเงื่อนไข เพื่อ response ข้อความ  You do not have permission และ status 403*/

  const user = users.find((u) => u.role === "admin");
  /*ค้นหา value จากตัวแปร users เพื่อหา role ที่มีค่าตรงกับ request body ที่ client ส่งมา*/

  res.json(user);
  /* response ข้อความ This is some sensitive data ในรูปแบบ JSON */
});

app.post("/api/data/memberOne", authenticateToken, (req, res) => {
  /*สร้าง http api เป็น method post สำหรับ client ส่งข้อมูลผ่าน body และต้องผ่าน middleware authenticateToken ก่อนถึงจะเข้าถึง api นี้ได้*/

  if (req.body.role !== "member1" && req.body.role !== "admin") {
    return res.status(403).send("You do not have permission");
  }
  /* สร้างเงื่อนไข ถ้า user มีข้อมูลจะส่งค่า true ทำให้ข้าม if นี้ แต่ถ้าไม่มีข้อมูล จะเข้าเงื่อนไข เพื่อ response ข้อความ  You do not have permission และ status 403*/

  const user = users.find((u) => u.role === "member1");
  /*ค้นหา value จากตัวแปร users เพื่อหา role ที่มีค่าตรงกับ request body ที่ client ส่งมา*/

  res.json(user);
  /* response ข้อความ This is some sensitive data ในรูปแบบ JSON */
});

app.post("/api/data/memberTwo", authenticateToken, (req, res) => {
  /*สร้าง http api เป็น method post สำหรับ client ส่งข้อมูลผ่าน body และต้องผ่าน middleware authenticateToken ก่อนถึงจะเข้าถึง api นี้ได้*/

  if (req.body.role !== "member2" && req.body.role !== "admin") {
    return res.status(403).send("You do not have permission");
  }
  /* สร้างเงื่อนไข ถ้า user มีข้อมูลจะส่งค่า true ทำให้ข้าม if นี้ แต่ถ้าไม่มีข้อมูล จะเข้าเงื่อนไข เพื่อ response ข้อความ  You do not have permission และ status 403*/

  const user = users.find((u) => u.role === "member2");
  /*ค้นหา value จากตัวแปร users เพื่อหา role ที่มีค่าตรงกับ request body ที่ client ส่งมา*/

  res.json(user);
  /* response ข้อความ This is some sensitive data ในรูปแบบ JSON */
});

function authenticateToken(req, res, next) {
  /*สร้างฟังก์ชัน authenticateToken มี parameter request response next*/

  const authHeader = req.headers.authorization;
  /*สร้างตัวแปร authHeader ที่เก็บค่า authorization ที่ request มา*/

  const token = authHeader && authHeader.split(" ")[1];
  /*สร้างตัวแปร token ที่เก็บค่า authHeader และใช้ split แยกค่าด้วยช่องว่าง และเก็บค่าที่ index 1 ที่เป็นค่า token*/

  if (token == null) {
    return res.status(401).send("Missing access token");
  }
  /*สร้างเงื่อนไข ถ้า token มีค่าเป็น null จะส่งค่า true ทำให้ข้าม if นี้ แต่ถ้าไม่มีข้อมูล จะเข้าเงื่อนไข เพื่อ response ข้อความ  Missing access token และ status 401*/

  jwt.verify(token, accessTokenSecret, (err, user) => {
    /* ใช้ jwt.verify ในการตรวจสอบความถูกต้องของ token โดยมี parameter คือ token accessTokenSecret และ callback function ที่มี parameter err และ user */

    if (err) {
      return res.status(403).send("Invalid access token");
    }
    /*สร้างเงื่อนไข ถ้า err มีค่าเป็น true จะส่งค่า true ทำให้ข้าม if นี้ แต่ถ้าไม่มีข้อมูล จะเข้าเงื่อนไข เพื่อ response ข้อความ  Invalid access token และ status 403*/

    req.user = user;
    /* สร้างตัวแปร user ที่เก็บค่า user ที่ได้จากการ verify token */

    next();
    /* ส่งต่อไปยัง middleware ถัดไป */
  });
}

app.listen(3000, () => console.log("Server started on port 3000"));
/* ใช้คำสั่ง app.listen เพื่อรัน server ที่ port 3000 */
