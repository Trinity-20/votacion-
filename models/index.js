// models/index.js
const Candidato = require('./candidato');
const Votante = require('./votante');
const Voto = require('./voto');
const { obtenerTopGanadores } = require('./ganadores');

module.exports = {
  Candidato,
  Votante,
  Voto,
  obtenerTopGanadores
};
