const express = require("express");
const PORT = process.env.PORT || 8007;
const app = express();
const fs = require('fs').promises;
// Don't worry about these 4 lines below
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("createcard");
})

app.post("/create", (req, res) => {
  const user = req.body;
  user.id = Math.floor(Math.random() * 600) + 1;
  fs.readFile(`${__dirname}/database.json`, 'utf-8')
    .then((content) => JSON.parse(content))
    .then((jsonObj) => {
      jsonObj.users.push(user);
      return jsonObj;
    })
    .then((updatedData)  => fs.writeFile(`${__dirname}/database.json`, JSON.stringify(updatedData,null,'\t'), 'utf-8'))
    .then(() => res.redirect(`/people/${user.id}` ))
    .catch((err) => console.log(err));
})

app.get("/homepage", (req, res) => {
  res.render("homepage");
});

app.get("/people/:id", (req, res) => {
  const userId = req.params.id;
  fs.readFile(`${__dirname}/database.json`, 'utf-8')
  .then((content) => JSON.parse(content).users)
  .then((users) => users.find((user) => {
    if (user.id == userId){
    console.log("found user");
    return user;
    } else {
     console.log("where is user?");
    }
  }))
  .then((user) => res.render('homepage', {user}))
  .catch((err) => console.log(err));
// res.render('homepage', {user}
});

app.get("/:id/photos", (req, res) => {
  const id = req.params.id;
});

app.listen(PORT, () => {
  console.log(`Server now is running at http://localhost:${PORT} 🚀`);
});
