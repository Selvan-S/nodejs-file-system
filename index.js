const express = require("express");
const format = require("./utils/formatDate");
const fs = require("fs");
const os = require("os");
const path = require("path");
const desktopDir = path.join(os.homedir(), "Desktop");
const timestamp_files_path = `${desktopDir}\\timestamp_files`;
// Setting PORT
const PORT = 8080;

// Initializing Express Server
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send(
    `<h1 style="text-align:center;">NodeJS File System</h1>
    <p>Try API endpoints:</p>
    <ul>
      <li>/file/create</li>
      <li>/file/read</li>
    </ul>`
  );
});

// Write API endpoint which will create a text file in a particular folder
app.post("/file/create", (req, res) => {
  const date = Date.now();
  const formatedDate = format.formatDate(date);
  const splitAndJoinDate = formatedDate.split(":").join(".");
  if (!fs.existsSync(timestamp_files_path)) {
    fs.mkdirSync(timestamp_files_path);
  }
  fs.writeFile(
    `${desktopDir}/timestamp_files/${splitAndJoinDate}.txt`,
    JSON.stringify(date),
    (err) => {
      if (err) {
        console.log("ERROR : ", err);
      } else {
        console.log("Check!, new file is created");
      }
    }
  );
  res.send(JSON.stringify({ formatedDate }));
});

// Write API endpoint to retrieve all the text files in that particular folder.
app.get("/file/read", (req, res) => {
  let fileTextJson = {};
  if (!fs.existsSync(timestamp_files_path)) {
    fs.mkdirSync(timestamp_files_path);
  }
  fs.readdir(`${desktopDir}/timestamp_files`, (err, files) => {
    if (err) {
      console.log(
        "ERROR: There was an issue encountered while retrieving the files from the folder."
      );
    } else {
      if (files.length == 0) {
        res.send(
          `<p>ERROR: No files were located in the directory ${timestamp_files_path}.</p><p>Use API endpoint of <code>/file/create</code> to create a new file.</p>`
        );
      } else {
        files.forEach((file, index, arr) => {
          fs.readFile(
            `${desktopDir}/timestamp_files/${file}`,
            "utf-8",
            (err, data) => {
              if (err) {
                console.log(
                  "ERROR: An error occurred while trying to access and read the files stored in the specified folder.",
                  err
                );
              } else {
                if (arr.length != index + 1) {
                  fileTextJson[`${file}`] = data;
                } else {
                  console.log("The file has been successfully read.");
                  fileTextJson[`${file}`] = data;
                  res.send(fileTextJson);
                }
              }
            }
          );
        });
      }
    }
  });
});

// Activating and listening server
app.listen(PORT, () => {
  console.log(`Server started in PORT : ${PORT}
    listening in http://localhost:${PORT}`);
});
