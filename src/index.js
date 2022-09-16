const express = require("express");
const authRoute = require("./routes/authRoute");
const eodRoute = require("./routes/eodRoute");
const adminRoute = require("./routes/adminRoute")
const app = express();
const cors = require("cors");

const corsOpts = {
    origin: "*",

    methods: ["GET", "POST"],

    allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));
app.use(express.json());

// Routes
app.use(authRoute);
app.use(eodRoute);
app.use(adminRoute);

app.listen(8000, () => {
    console.log("Server running at Port 8000");
})

