const express = require('express');
const app = express();
const db = require("./models");

const postRouter = require("./routes/customer");
app.use("/posts", postRouter);
app.use(express.json());

db.sequelize.sync().then(() => {




    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
});