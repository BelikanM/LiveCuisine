import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container, AppBar, Toolbar, Typography, Button, Box, Grid, Card, CardMedia, CardContent, TextField, IconButton, Avatar,
  Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Divider
} from '@mui/material';
import { Home as HomeIcon, Upload as UploadIcon, AccountCircle as ProfileIcon, ThumbUp, Comment, Send } from '@mui/icons-material';

// Configuration d'Axios pour les appels API
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const drawerWidth = 240;

function App() {
  const [user, setUser] = useState(null);

  // Vérification de l'utilisateur connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* Barre latérale permanente */}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Accueil" />
            </ListItem>
            {user && (
              <>
                <ListItem button component={Link} to="/upload">
                  <ListItemIcon><UploadIcon /></ListItemIcon>
                  <ListItemText primary="Uploader" />
                </ListItem>
                <ListItem button component={Link} to={`/profile/${user._id}`}>
                  <ListItemIcon><ProfileIcon /></ListItemIcon>
                  <ListItemText primary="Profil" />
                </ListItem>
              </>
            )}
          </List>
        </Drawer>

        {/* Contenu principal */}
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/success" element={<GoogleAuthSuccess setUser={setUser} />} />
            <Route path="/upload" element={<UploadVideo />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </Box>

        {/* Barre supérieure */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>CuisineStream</Typography>
            {user ? (
              <>
                <Typography>Bienvenue, {user.username}</Typography>
                <Button color="inherit" onClick={handleLogout}>Déconnexion</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Connexion</Button>
                <Button color="inherit" component={Link} to="/register">Inscription</Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </Router>
  );
}

// Page d'accueil avec vidéos trending et récentes
function Home() {
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    api.get('/feed/trending').then(res => setTrending(res.data));
    api.get('/feed/latest').then(res => setLatest(res.data));
  }, []);

  return (
    <Box>
      <Typography variant="h5">Vidéos Tendances</Typography>
      <VideoGrid videos={trending} />
      <Typography variant="h5" sx={{ mt: 4 }}>Dernières Vidéos</Typography>
      <VideoGrid videos={latest} />
    </Box>
  );
}

// Composant pour afficher une grille de vidéos
function VideoGrid({ videos }) {
  return (
    <Grid container spacing={2}>
      {videos.map(video => (
        <Grid item xs={12} sm={6} md={4} key={video._id}>
          <Card>
            <CardMedia component="video" src={video.videoUrl} controls />
            <CardContent>
              <Typography>{video.description}</Typography>
              <Typography variant="caption">Par : {video.userId.username}</Typography>
              <Box>
                <IconButton>
                  <ThumbUp /> {video.likes.length}
                </IconButton>
                <IconButton component={Link} to={`/video/${video._id}`}>
                  <Comment /> {video.comments.length}
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

// Page de connexion
function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur de connexion');
    }
  };

  return (
    <Box>
      <Typography variant="h5">Connexion</Typography>
      <TextField label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Mot de passe" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} sx={{ mb: 2 }} />
      <Button variant="contained" onClick={handleLogin}>Se connecter</Button>
      <Button href="http://localhost:5000/api/auth/google">Connexion avec Google</Button>
    </Box>
  );
}

// Page de succès pour l'authentification Google
function GoogleAuthSuccess({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      api.get('/users/me').then(res => {
        setUser(res.data);
        navigate('/');
      });
    }
  }, [navigate, setUser]);

  return <Typography>Connexion en cours...</Typography>;
}

// Page d'inscription
function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post('/register', { username, email, password });
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur d\'inscription');
    }
  };

  return (
    <Box>
      <Typography variant="h5">Inscription</Typography>
      <TextField label="Nom d'utilisateur" fullWidth value={username} onChange={e => setUsername(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Mot de passe" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} sx={{ mb: 2 }} />
      <Button variant="contained" onClick={handleRegister}>S'inscrire</Button>
    </Box>
  );
}

// Page pour uploader une vidéo
function UploadVideo() {
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();

  const handleUpload = async () => {
    try {
      await api.post('/videos', { description, videoUrl });
      navigate('/');
    } catch (err) {
      alert('Erreur lors de l\'upload');
    }
  };

  return (
    <Box>
      <Typography variant="h5">Uploader une Vidéo</Typography>
      <TextField label="Description" fullWidth value={description} onChange={e => setDescription(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="URL de la Vidéo" fullWidth value={videoUrl} onChange={e => setVideoUrl(e.target.value)} sx={{ mb: 2 }} />
      <Button variant="contained" onClick={handleUpload}>Uploader</Button>
    </Box>
  );
}

// Page de détail d'une vidéo
function VideoDetail() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    api.get(`/videos/${id}`).then(res => setVideo(res.data));
    api.get(`/videos/${id}/comments`).then(res => setVideo(v => ({ ...v, comments: res.data })));
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await api.post(`/videos/${id}/like`);
      setVideo({ ...video, likes: res.data.liked ? [...video.likes, 'user'] : video.likes.filter(l => l !== 'user') });
    } catch (err) {
      alert('Erreur lors du like');
    }
  };

  const handleComment = async () => {
    try {
      await api.post(`/videos/${id}/comment`, { text: comment });
      setComment('');
      const res = await api.get(`/videos/${id}/comments`);
      setVideo({ ...video, comments: res.data });
    } catch (err) {
      alert('Erreur lors du commentaire');
    }
  };

  if (!video) return <Typography>Chargement...</Typography>;

  return (
    <Box>
      <Card>
        <CardMedia component="video" src={video.videoUrl} controls />
        <CardContent>
          <Typography>{video.description}</Typography>
          <Typography variant="caption">Par : {video.userId.username}</Typography>
          <Box>
            <IconButton onClick={handleLike}>
              <ThumbUp /> {video.likes.length}
            </IconButton>
          </Box>
        </CardContent>
      </Card>
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Ajouter un commentaire"
          fullWidth
          value={comment}
          onChange={e => setComment(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleComment}>
                <Send />
              </IconButton>
            ),
          }}
        />
        {video.comments.map(c => (
          <Box key={c._id} sx={{ mt: 1 }}>
            <Typography variant="caption">{c.userId.username} : {c.text}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// Page de profil utilisateur
function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    api.get(`/users/${id}`).then(res => setUser(res.data));
    api.get(`/users/${id}/videos`).then(res => setVideos(res.data));
  }, [id]);

  if (!user) return <Typography>Chargement...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar src={user.avatar} sx={{ width: 100, height: 100, mr: 2 }} />
        <Typography variant="h5">{user.username}</Typography>
      </Box>
      <Typography variant="h6">Vidéos</Typography>
      <VideoGrid videos={videos} />
    </Box>
  );
}

export default App;
