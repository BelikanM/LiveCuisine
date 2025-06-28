const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieSession = require("cookie-session");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"],
  maxAge: 24 * 60 * 60 * 1000,
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(`mongodb+srv://nyundumathryme:${encodeURIComponent("Dieu19961991??!??!")}` +
  "@cluster0.cjl3cll.mongodb.net/tiktok_db?retryWrites=true&w=majority&appName=Cluster0", {
}).then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("❌ Erreur MongoDB :", err));

// ===== MODELS =====
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  googleId: String,
  avatar: String,
});
const User = mongoose.model("User", userSchema);

const videoSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  description: String,
  videoUrl: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{
    userId: mongoose.Schema.Types.ObjectId,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
});
const Video = mongoose.model("Video", videoSchema);

// ===== AUTH =====
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = await User.create({
      googleId: profile.id,
      username: profile.displayName,
      avatar: profile.photos[0].value,
      email: profile.emails?.[0]?.value || ""
    });
  }
  return done(null, user);
}));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => done(null, await User.findById(id)));

// ===== MIDDLEWARE =====
const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Token manquant" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(403).json({ error: "Token invalide" });
  }
};

// ===== ROUTES =====
// Register
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashed });
  await user.save();
  res.json(user);
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Utilisateur introuvable" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Mot de passe incorrect" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, user });
});

// Google Auth
app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/api/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/login",
  session: false,
}), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.redirect(`/success?token=${token}`);
});

// Upload vidéo
app.post("/api/videos", verifyToken, async (req, res) => {
  const { description, videoUrl } = req.body;
  const video = new Video({ userId: req.userId, description, videoUrl });
  await video.save();
  res.json(video);
});

// Get toutes vidéos
app.get("/api/videos", async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 }).populate("userId", "username avatar");
  res.json(videos);
});

// Détail vidéo
app.get("/api/videos/:id", async (req, res) => {
  const video = await Video.findById(req.params.id).populate("userId", "username avatar");
  res.json(video);
});

// Modifier vidéo
app.put("/api/videos/:id", verifyToken, async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (video.userId.toString() !== req.userId) return res.status(403).json({ error: "Non autorisé" });
  video.description = req.body.description || video.description;
  await video.save();
  res.json(video);
});

// Like/Unlike
app.post("/api/videos/:id/like", verifyToken, async (req, res) => {
  const video = await Video.findById(req.params.id);
  const hasLiked = video.likes.includes(req.userId);
  if (hasLiked) {
    video.likes.pull(req.userId);
  } else {
    video.likes.push(req.userId);
  }
  await video.save();
  res.json({ liked: !hasLiked, totalLikes: video.likes.length });
});

// Poster un commentaire
app.post("/api/videos/:id/comment", verifyToken, async (req, res) => {
  const video = await Video.findById(req.params.id);
  video.comments.push({ userId: req.userId, text: req.body.text });
  await video.save();
  res.json(video.comments);
});

// Liste commentaires
app.get("/api/videos/:id/comments", async (req, res) => {
  const video = await Video.findById(req.params.id).populate("comments.userId", "username avatar");
  res.json(video.comments);
});

// Modifier un commentaire
app.put("/api/videos/:id/comment/:commentId", verifyToken, async (req, res) => {
  const video = await Video.findById(req.params.id);
  const comment = video.comments.id(req.params.commentId);
  if (comment.userId.toString() !== req.userId) return res.status(403).json({ error: "Non autorisé" });
  comment.text = req.body.text;
  await video.save();
  res.json(comment);
});

// Supprimer un commentaire
app.delete("/api/videos/:id/comment/:commentId", verifyToken, async (req, res) => {
  const video = await Video.findById(req.params.id);
  const comment = video.comments.id(req.params.commentId);
  if (comment.userId.toString() !== req.userId) return res.status(403).json({ error: "Non autorisé" });
  comment.remove();
  await video.save();
  res.json({ success: true });
});

// Profil utilisateur
app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

// Modifier profil utilisateur
app.put("/api/users/:id", verifyToken, async (req, res) => {
  if (req.userId !== req.params.id) return res.status(403).json({ error: "Non autorisé" });
  const { username, avatar } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { username, avatar }, { new: true });
  res.json(user);
});

// Modifier mot de passe
app.put("/api/users/:id/password", verifyToken, async (req, res) => {
  if (req.userId !== req.params.id) return res.status(403).json({ error: "Non autorisé" });
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.params.id);
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return res.status(400).json({ error: "Ancien mot de passe incorrect" });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ success: true });
});

// Vidéos par utilisateur
app.get("/api/users/:id/videos", async (req, res) => {
  const videos = await Video.find({ userId: req.params.id }).sort({ createdAt: -1 });
  res.json(videos);
});

// Trending
app.get("/api/feed/trending", async (req, res) => {
  const videos = await Video.find().sort({ "likes.length": -1 }).limit(10);
  res.json(videos);
});

// Dernières vidéos
app.get("/api/feed/latest", async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 }).limit(10);
  res.json(videos);
});

// Lancer serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));



