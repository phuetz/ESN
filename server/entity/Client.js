const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Client',
  tableName: 'clients',
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String },
    type: { type: String, nullable: true },
    sector: { type: String, nullable: true },
    contactName: { type: String, nullable: true },
    contactEmail: { type: String, nullable: true },
    contactPhone: { type: String, nullable: true },
    website: { type: String, nullable: true },
    address: { type: String, nullable: true },
    city: { type: String, nullable: true },
    postalCode: { type: String, nullable: true },
    country: { type: String, nullable: true },
    notes: { type: String, nullable: true },
    status: { type: String, nullable: true },
    createdAt: { type: Date, nullable: true },
  },
});
