const express = require("express");
const app = express();

const PORT = 8000;

app.listen(8000, () => {
  console.log(`Server is running at 8000`);
});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true })); // To handle URL-encoded data

app.set("/", (req, res) => {
  res.render("index", {
    pageTitle: "Home",
  });
});

// Middleware to log request details
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} request to ${req.url}`
  );
  next();
});

// Middleware to add a request time to each request
app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];
const posts = [{ id: 1, title: "First Post", content: "Hello World" }];
const comments = [{ id: 1, postId: 1, text: "Great post!" }];

// GET route for users
app.get("/users", (req, res) => {
  res.json(users);
});

// GET route for posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// GET route for comments
app.get("/comments", (req, res) => {
  res.json(comments);
});
app.post("/users", (req, res) => {
  const newUser = {
    id: users.length + 1, // Simple ID generation logic
    name: req.body.name,
  };
  users.push(newUser);
  res.send(`User added with ID: ${newUser.id}`);
});

app.put("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("User not found");
  }
  user.name = req.body.name;
  res.send(`User with ID: ${user.id} updated`);
});

app.delete("/users/:id", (req, res) => {
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).send("User not found");
  }
  users.splice(userIndex, 1);
  res.send(`User with ID: ${req.params.id} deleted`);
});
app.get("/users", (req, res) => {
  let filteredUsers = users;
  if (req.query.name) {
    filteredUsers = filteredUsers.filter((u) =>
      u.name.includes(req.query.name)
    );
  }
  res.json(filteredUsers);
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Home",
    users: users, // Pass the users data to the template
  });
});
