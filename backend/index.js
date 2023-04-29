import express from "express";
import mysql from "mysql";
import cors from "cors";
import fs from "fs";

const app = express();
// Using json that allows us to send any json from client
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "test",
});

// if ERROR code: 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR'
// RUN THIS COMMAND IN WORKBENCH
// "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '@Bcd1234'";
app.get("/", (req, res) => {
  // BACKEND NODEJS
  // READ
  const q1 = "SELECT * FROM users";
  db.query(q1, (err, data1) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    const q2 =
      "SHOW COLUMNS FROM users WHERE Field IN ('id', 'name' , 'email','phone')";
    db.query(q2, (err, data2) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }

      // Combine the two result sets into a single object
      const result = { users: data1, columns: data2 };

      // Write data to JSON file
      fs.writeFile("data.json", JSON.stringify(result), (err) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        console.log("Data written to data.json");

        // Read data from JSON file
        fs.readFile("data.json", (err, fileData) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          const data = JSON.parse(fileData);

          // Create HTML table
          const table = `
  <html>
    <head>
      <title>All User Info</title>
    </head>
    <body>
      <h2>Data Types</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Null</th>
            <th>Key</th>
            <th>Default</th>
            <th>Extra</th>
          </tr>
        </thead>
        <tbody>
          ${data.columns
            .map(
              (column) => `
              <tr>
                <td style='padding:10px;border:solid 1px;'>${column.Field}</td>
                <td style='padding:10px;border:solid 1px;'>${column.Type}</td>
                <td style='padding:10px;border:solid 1px;'>${column.Null}</td>
                <td style='padding:10px;border:solid 1px;'>${column.Key}</td>
                <td style='padding:10px;border:solid 1px;'>${column.Default}</td>
                <td style='padding:10px;border:solid 1px;'>${column.Extra}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
      <h1>All User Info After Condition from a single file</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th style='padding:40px'></th>
            <th style='padding:20px'>Word Count</th>
            <th>Word Length</th>
          </tr>
        </thead>
        <tbody>
          ${data.users
            .map((user) => {
              const nameLength = user.name.replace(/\s/g, "").length;
              if (nameLength > 5) {
                return ""; // Skip this user
              } else {
                return `
                  <tr>
                    <td style='padding:40px'>${user.id}</td>
                    <td style='border:solid 1px'>${user.name}</td>
                    <td style='border:solid 1px'>${user.email}</td>
                    <td style='border:solid 1px'>${user.phone}</td>
                    <td style='padding:40px'></td>
                    <td style='padding:20px'>${user.name.split(" ").length}</td>
                    <td>${nameLength}</td>
                  </tr>
                `;
              }
            })
            .join("")}
        </tbody>
      </table>
    </body>
  </html>`;

          // Send HTML table as response
          return res.send(table);
        });
      });
    });
  });
});

// FOR CLIENT REACT

// READ
app.get("/users", (req, res) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// WRITE

app.post("/users", (req, res) => {
  const q = "INSERT INTO users(`name`, `email`, `phone`) VALUES (?)";

  const values = [req.body.name, req.body.email, req.body.phone];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
// DELETE
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const q = "DELETE FROM users WHERE id = ?";
  db.query(q, [userId], (err, data) => {
    if (err) return res.json(err);
    return res.json("User has been deleted successfully");
  });
});
//UPDATE

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const q = "UPDATE users SET `name`=?,`email`=?, `phone`=? WHERE id = ?";

  const values = [req.body.name, req.body.email, req.body.phone];

  db.query(q, [...values, userId], (err, data) => {
    if (err) return res.json(err);
    return res.json("User has been updated successfully");
  });
});

try {
  app.listen(8800, () => {
    console.log("Connected to backend");
  });
} catch (err) {
  console.error(err);
}
