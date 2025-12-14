require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://auth-project-44r4t8vxg-sandeeprajputs-projects.vercel.app",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            callback(new Error("CORS not allowed"));
        },
        credentials: true,
    })
);

app.get('/', (req, res) => res.send('Auth server up'));

//  REGISTER ROUTES
app.use('/api/auth', authRoutes);

const protectedRoutes = require('./routes/protected.routes');

app.use('/api', protectedRoutes);



const PORT = process.env.PORT || 4000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    })
    .catch(console.error);
