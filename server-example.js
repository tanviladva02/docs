const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "your-secret-key-change-in-production";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// In-memory data storage (replace with database in production)
let users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
  },
];

let posts = [
  {
    id: "1",
    title: "Getting Started with API Development",
    content: "This is a comprehensive guide to API development...",
    authorId: "1",
    category: "technology",
    tags: ["api", "development"],
    isPublished: true,
    publishedAt: "2024-01-15T10:30:00Z",
    readTime: 5,
    createdAt: "2024-01-15T10:30:00Z",
  },
];

let files = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Access token required",
      timestamp: new Date().toISOString(),
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Invalid or expired token",
        timestamp: new Date().toISOString(),
      });
    }
    req.user = user;
    next();
  });
};

// Routes

// GET /users - Get all users
app.get("/v1/users", authenticateToken, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const usersWithoutPassword = users.map((user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  const paginatedUsers = usersWithoutPassword.slice(startIndex, endIndex);

  res.json({
    data: paginatedUsers,
    total: users.length,
    page: page,
    limit: limit,
  });
});

// POST /users - Create user
app.post("/v1/users", (req, res) => {
  const { name, email, password, role = "user", permissions } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Name, email, and password are required",
      details: {
        name: !name ? "Name is required" : null,
        email: !email ? "Email is required" : null,
        password: !password ? "Password is required" : null,
      },
      timestamp: new Date().toISOString(),
    });
  }

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Name must be between 2 and 100 characters",
      timestamp: new Date().toISOString(),
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Password must be at least 8 characters long",
      timestamp: new Date().toISOString(),
    });
  }

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({
      error: "User already exists",
      message: "A user with this email address already exists",
      timestamp: new Date().toISOString(),
    });
  }

  // Create new user
  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  // Return user without password
  const { password: _, ...userResponse } = newUser;
  res.status(201).json(userResponse);
});

// GET /users/:id - Get user by ID
app.get("/v1/users/:id", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
      message: "User with the specified ID does not exist",
      timestamp: new Date().toISOString(),
    });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// GET /posts - Get all posts
app.get("/v1/posts", (req, res) => {
  let filteredPosts = [...posts];

  if (req.query.author) {
    filteredPosts = filteredPosts.filter(
      (post) => post.authorId === req.query.author
    );
  }

  if (req.query.category) {
    filteredPosts = filteredPosts.filter(
      (post) => post.category === req.query.category
    );
  }

  res.json({
    data: filteredPosts,
    total: filteredPosts.length,
  });
});

// POST /posts - Create post
app.post("/v1/posts", authenticateToken, (req, res) => {
  const { title, content, category, tags = [], isPublished = false } = req.body;

  // Validation
  if (!title || !content || !category) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Title, content, and category are required",
      timestamp: new Date().toISOString(),
    });
  }

  if (title.length < 5 || title.length > 200) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Title must be between 5 and 200 characters",
      timestamp: new Date().toISOString(),
    });
  }

  if (content.length < 10) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Content must be at least 10 characters long",
      timestamp: new Date().toISOString(),
    });
  }

  const validCategories = ["technology", "lifestyle", "business", "sports"];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      error: "Validation failed",
      message:
        "Invalid category. Must be one of: " + validCategories.join(", "),
      timestamp: new Date().toISOString(),
    });
  }

  // Create new post
  const newPost = {
    id: (posts.length + 1).toString(),
    title,
    content,
    authorId: req.user.id,
    category,
    tags,
    isPublished,
    publishedAt: isPublished ? new Date().toISOString() : null,
    readTime: Math.ceil(content.split(" ").length / 200), // Rough estimate
    createdAt: new Date().toISOString(),
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

// POST /auth/login - User login
app.post("/v1/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Email and password are required",
      timestamp: new Date().toISOString(),
    });
  }

  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({
      error: "Invalid credentials",
      message: "Email or password is incorrect",
      timestamp: new Date().toISOString(),
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  const { password: _, ...userWithoutPassword } = user;

  res.json({
    token,
    user: userWithoutPassword,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
});

// POST /files/upload - Upload file
app.post(
  "/v1/files/upload",
  authenticateToken,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: "File upload failed",
        message: "No file provided",
        timestamp: new Date().toISOString(),
      });
    }

    const newFile = {
      id: `file_${Date.now()}`,
      filename: req.file.filename,
      url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      mimeType: req.file.mimetype,
      description: req.body.description || null,
    };

    files.push(newFile);
    res.status(201).json(newFile);
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong on the server",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "The requested endpoint does not exist",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dummy API server running on http://localhost:${PORT}`);
  console.log(
    `📚 API Documentation available at http://localhost:${PORT}/docs`
  );
  console.log(`🔗 Base URL: http://localhost:${PORT}/v1`);
});

module.exports = app;
