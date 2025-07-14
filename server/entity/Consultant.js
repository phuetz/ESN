const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Consultant',
  tableName: 'consultants',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    role: {
      type: String,
    },
    status: {
      type: String,
    },
    experience: {
      type: Number,
    },
  },
});
