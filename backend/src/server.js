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

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());
app.use(cookieParser());

// CORS setup
const whitelist = [
  'http://localhost:5173',
  'https://auth-project-4aqww1ly3-sandeeprajputs-projects.vercel.app',
  'https://auth-project-88n2fu8il-sandeeprajputs-projects.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (whitelist.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// Preflight requests for all routes
app.options('*', cors({ origin: whitelist, credentials: true }));

// =======================
// ROUTES
// =======================
app.get('/', (req, res) => res.send('Auth server up'));

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// =======================
// DATABASE & SERVER
// =======================
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS Error: This origin is not allowed.' });
  }

  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});
