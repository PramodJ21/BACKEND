const Playlist = require("../models/Playlist");
const Mix = require("../models/Mix");

exports.createPlaylist = async (req, res) => {
    const { name, image } = req.body;

    try {
        const playlist = new Playlist({
            name,
            image,
            mixes: [],
            createdAt: Date.now()
        });

        await playlist.save();
        res.status(201).json({ message: 'Playlist created successfully!', playlist });
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ error: 'Error creating playlist' });
    }
};

exports.getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find().populate("mixes");
        res.status(200).json({ playlists });
    } catch (error) {
        res.status(500).json({ error: "Error fetching playlists" });
    }
};

exports.addMixToPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { sounds } = req.body;

    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        const mix = new Mix({
            name: `Mix ${playlist.mixes.length + 1}`,
            sounds,
            createdAt: Date.now()
        });

        await mix.save();
        playlist.mixes.push(mix._id);
        await playlist.save();

        res.status(200).json({ message: 'Mix added to playlist successfully!', mix });
    } catch (error) {
        console.error('Error adding mix to playlist:', error);
        res.status(500).json({ error: 'Error adding mix to playlist' });
    }
};