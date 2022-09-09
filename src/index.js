const express = require("express");
const authRoute = require("./routes/authRoute");
const eodRoute = require("./routes/eodRoute");
const app = express();

app.use(express.json());
app.use(authRoute);
app.use(eodRoute);

app.listen(8000, () => {
    console.log("Server running at Port 8000");
})

