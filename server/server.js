const app = require('./app');
const config = require('./app/config');
const db = require('./app/utils/mongodb.util');

async function startServer() {
  try {
    db.connect();
    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.log('Server is not starting', error);
    process.exit();
  }
}
startServer();
