const express = require("express");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("YOUR_MONGODB_CONNECTION_STRING")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const urlSchema = new mongoose.Schema({
    longUrl: String,
    shortCode: String,
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Url = mongoose.model("Url", urlSchema);

app.post("/shorten", async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: "URL is required" });
    }

    const shortCode = nanoid(6);

    const newUrl = new Url({ longUrl, shortCode });
    await newUrl.save();

    res.json({
        shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`
    });
});

app.get("/:code", async (req, res) => {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (url) {
        url.clicks++;
        await url.save();
        res.redirect(url.longUrl);
    } else {
        res.send("Link not found");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});