const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const nodemailer = require("nodemailer");
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"));

// ==== MODELS ====

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  confirmed: { type: Boolean, default: false },
  confirmationCode: String,
});

const MessageSchema = new mongoose.Schema({
  conversationId: String,
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new mongoose.Schema({
  members: [String],
});

const User = mongoose.model("User", UserSchema);
const Message = mongoose.model("Message", MessageSchema);
const Conversation = mongoose.model("Conversation", ConversationSchema);

// ==== MAILER ====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==== PASSPORT JWT ====
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (user) return done(null, user);
        else return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

app.use(passport.initialize());

// ==== ROUTES ====

// Register
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const user = new User({ username, email, password: hash, confirmationCode });
  await user.save();

  await transporter.sendMail({
    from: `"WhatsApp Clone" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Code de confirmation",
    text: `Votre code est : ${confirmationCode}`,
  });

  res.json({ message: "Inscription réussie. Vérifiez votre mail." });
});

// Confirm code
app.post("/api/confirm", async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
  if (user.confirmationCode !== code)
    return res.status(400).json({ error: "Code incorrect" });

  user.confirmed = true;
  user.confirmationCode = null;
  await user.save();
  res.json({ message: "Compte confirmé" });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: "Email ou mot de passe incorrect" });

  if (!user.confirmed)
    return res.status(403).json({ error: "Veuillez confirmer votre compte" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
});

// Get all users
app.get("/api/users", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }, "username email");
  res.json(users);
});

// Create conversation
app.post("/api/conversations", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { receiverId } = req.body;
  const conversation = new Conversation({ members: [req.user._id, receiverId] });
  await conversation.save();
  res.json(conversation);
});

// Get conversations
app.get("/api/conversations", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const convs = await Conversation.find({ members: req.user._id });
  res.json(convs);
});

// Send message
app.post("/api/messages", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { conversationId, text } = req.body;
  const message = new Message({ conversationId, sender: req.user._id, text });
  await message.save();
  io.to(conversationId).emit("newMessage", message);
  res.json(message);
});

// Get messages
app.get("/api/messages/:conversationId", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const messages = await Message.find({ conversationId: req.params.conversationId });
  res.json(messages);
});

// ==== SOCKET.IO ====

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ==== START SERVER ====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
