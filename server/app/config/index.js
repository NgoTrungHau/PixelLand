// const mongoose = require('mongoose');

const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri:
      process.env.MONGODB_URI ||
      'mongodb+srv://ngotrunghau101:l5alIP3XGsVnefmb@cluster-pixel.ughl3ls.mongodb.net/PixelLand',
  },
};

// async function connect() {
//   try {
//     mongoose.set('strictQuery', false);
//     await mongoose.connect(config.db.uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to the database!');
//   } catch (error) {
//     console.log('Cannot connect to the database!', error);
//   }
// }
// module.exports = { connect };

module.exports = config;
