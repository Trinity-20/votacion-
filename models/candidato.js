const mongoose = require('mongoose');

const CandidatoSchema = new mongoose.Schema({
  nombre: String,
  partido: String,
});

module.exports = mongoose.model('Candidato', CandidatoSchema);

CandidatoSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});