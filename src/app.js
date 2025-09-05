const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');

/*Taking Routes */
const authRoutes = require('./routes/auth.route')
const chatRoutes = require('./routes/chat.route')

app.use(express.json());
app.use(cookieParser())

/* Using Routes */
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;
