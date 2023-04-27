const express = require("express");
const authRoute = require("./routes/authRoute");
const eodRoute = require("./routes/eodRoute");
const adminRoute = require("./routes/adminRoute")
const ticketRoute = require("./routes/ticketRoute");
const app = express();
const cors = require("cors");
const { PORT } = require("./config/envConfig");
const bodyParser = require('body-parser');


const corsOpts = {
    origin: "*",

    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],

    allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use(authRoute);
app.use(eodRoute);
app.use(adminRoute);
app.use(ticketRoute);



app.listen(PORT, () => {
    console.log(`Server running at Port ${PORT}`);
})

