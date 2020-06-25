const MongoClient = require('mongodb').MongoClient;
const MONGO_URL =
  'mongodb+srv://admin:admin@cluster0-yw4dt.mongodb.net/test?retryWrites=true&w=majority';

module.exports = function(app) {
  const client = new MongoClient(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  client
    .connect()
    .then(connection => {
      const user = client.db('login').collection('user');
      console.log('Database connection established');
    })
    .catch(err => console.error(err));
};
