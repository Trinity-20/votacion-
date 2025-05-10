const mongoose = require('mongoose');

const VotoSchema = new mongoose.Schema({
  candidato: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidato' },
  votante: { type: mongoose.Schema.Types.ObjectId, ref: 'Votante' },
});

module.exports = mongoose.model('Voto', VotoSchema);
