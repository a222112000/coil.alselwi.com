const express = require("express");
const cors = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-token");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 3000;

app.get("/token", (req, res) => {
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  const channelName = req.query.channelName;
  if (!channelName) {
    return res.status(400).json({ error: "channelName is required" });
  }

  // You can pass uid from mobile app or let Agora assign one
  const uid = req.query.uid || 0;
  const role = RtcRole.PUBLISHER;
  const expireTime = 3600; // token valid for 1 hour
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );

  return res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Agora token server running at http://localhost:${PORT}`);
});
