import React, { useState, useEffect } from "react";
import axios from "axios";

const AddVideo = () => {
  const [userId, setUserId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      // Get current user data
      const { data: userData } = await axios.get("/api/users/me", { headers: authHeader() });
      setUserId(userData._id);

      // Load videos
      const { data: videoData } = await axios.get(`/api/users/${userData._id}/videos`, { headers: authHeader() });
      setVideos(videoData);

      // Load all users (so you can follow/unfollow them)
      const { data: allUsers } = await axios.get("/api/users");
      setUsers(allUsers);
    };

    fetchData();
  }, []);

  const authHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: "Bearer " + token };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoData = { description, videoUrl };
    await axios.post("/api/videos", videoData, { headers: authHeader() });
    setVideos([...videos, videoData]);
    setDescription("");
    setVideoUrl("");
  };

  const toggleFollow = async (followUserId) => {
    if (following.has(followUserId)) {
      await axios.post(`/api/users/${followUserId}/unfollow`, {}, { headers: authHeader() });
      following.delete(followUserId);
    } else {
      await axios.post(`/api/users/${followUserId}/follow`, {}, { headers: authHeader() });
      following.add(followUserId);
    }
    setFollowing(new Set(following));
  };

  return (
    <div>
      <h1>Ajouter une vidéo</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="URL de la vidéo"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
        />
        <button type="submit">Publier</button>
      </form>

      <h2>Vidéos publiées</h2>
      {videos.map((video) => (
        <div key={video._id} className="video-card">
          <div className="video-header">
            <img src={video.userId.avatar} alt={`${video.userId.username} avatar`} />
            <p>{video.userId.username}</p>
          </div>
          <video controls src={video.videoUrl}></video>
          <p>{video.description}</p>
        </div>
      ))}

      <h2>Liste des utilisateurs</h2>
      {users.map((user) => (
        <div key={user._id} className="user-card">
          <img src={user.avatar} alt={`${user.username} avatar`} />
          <p>{user.username}</p>
          <button onClick={() => toggleFollow(user._id)}>
            {following.has(user._id) ? "Ne plus suivre" : "Suivre"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AddVideo;

