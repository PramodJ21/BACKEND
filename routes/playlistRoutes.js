const express = require("express");
const { createPlaylist, getPlaylists, addMixToPlaylist } = require("../controllers/playlistController");

const router = express.Router();

router.post("/playlists/create", createPlaylist);
router.get("/playlists", getPlaylists);
router.post('/playlists/:id/addMix', addMixToPlaylist);

module.exports = router;