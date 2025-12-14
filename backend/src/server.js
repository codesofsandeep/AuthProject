// require('dotenv').config();

// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');

// const authRoutes = require('./routes/auth.routes');

// const app = express();

// app.use(express.json());
// app.use(cookieParser());


// app.use(
//     cors({
//         origin: function (origin, callback) {
//             if (!origin) return callback(null, true);

//             if (
//                 origin.startsWith("http://localhost") ||
//                 origin.endsWith(".vercel.app")
//             ) {
//                 return callback(null, true);
//             }

//             callback(new Error("CORS not allowed"));
//         },
//         credentials: true,
//     })
// );

// app.options(/.*/, cors());





// app.get('/', (req, res) => res.send('Auth server up'));

// //  REGISTER ROUTES
// app.use('/api/auth', authRoutes);

// const protectedRoutes = require('./routes/protected.routes');

// app.use('/api', protectedRoutes);



// const PORT = process.env.PORT || 4000;

// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => {
//         console.log('MongoDB Connected');
//         app.listen(PORT, () => console.log(`Server running on ${PORT}`));
//     })
//     .catch(console.error);



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');

const app = express();

/* ===== IMPORTANT FOR RENDER ===== */
app.set('trust proxy', 1);

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(cookieParser());

/* ===== CORS (FINAL FIX) ===== */
app.use(
  cors({
    origin: [
      "https://auth-project-three-brown.vercel.app",
      "https://auth-project-git-main-sandeeprajputs-projects.vercel.app",
      "https://auth-project-7vo4bqhni-sandeeprajputs-projects.vercel.app",
    ],
    credentials: true,
  })
);


/* ===== ROUTES ===== */
app.get('/', (req, res) => res.send('Auth server running'));
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

/* ===== DB + SERVER ===== */
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => console.error(err));
