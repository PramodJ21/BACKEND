const allowedOrigins = require('./allowedOrigins')


const corsOptions = {
//   origin: function (origin, callback) {
//       if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//           callback(null, true)
//       } else {
//           callback(new Error('Not allowed by CORS'))
//       }
//   }
origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    optionsSuccessStatus: 200
}

module.exports = corsOptions