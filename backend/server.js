const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { google } = require("googleapis");

const app = express();

app.use(cors());
app.use(express.json());

// OAuth setup
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

app.post("/contact", async (req, res) => {

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields required",
        });
    }

    try {

        const gmail = google.gmail({
            version: "v1",
            auth: oAuth2Client,
        });

        const mail = [
            `To: ${process.env.EMAIL}`,
            `Subject: Contact Form Message`,
            ``,
            `Name: ${name}`,
            `Email: ${email}`,
            `Message: ${message}`,
        ].join("\n");

        const encodedMail = Buffer.from(mail)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");

        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMail,
            },
        });

        res.json({
            success: true,
            message: "Email sent successfully",
        });

    } catch (error) {

        console.error("EMAIL ERROR:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Email sending failed"
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});