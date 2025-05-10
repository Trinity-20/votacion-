const mongoose = require('mongoose');

const VotanteSchema = new mongoose.Schema({
  nombre: String,
  dni: { type: String, unique: true },
});

module.exports = mongoose.model('Votante', VotanteSchema);

VotanteSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});