const { Sale } = require('./Sale');
const { Users } = require('./User');
const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true);

const connectDB = () => {
  return mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const Models = {
     Users, Sale
};

module.exports = {
    connectDB, Models
}