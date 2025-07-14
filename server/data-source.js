const { DataSource } = require('typeorm');
const path = require('path');

module.exports = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, 'db.sqlite'),
  synchronize: true,
  entities: [path.join(__dirname, 'entity/*.js')],
});
