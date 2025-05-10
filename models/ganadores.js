const Voto = require('./voto');
const mongoose = require('mongoose');

async function obtenerTop3Ganadores() {
  const resultados = await Voto.aggregate([
    { $group: { _id: '$candidato', totalVotos: { $sum: 1 } } },
    { $sort: { totalVotos: -1 } },
    { $limit: 3 },
    {
      $lookup: {
        from: 'candidatos',
        localField: '_id',
        foreignField: '_id',
        as: 'candidato'
      }
    },
    { $unwind: '$candidato' },
    {
      $project: {
        _id: 0,
        nombre: '$candidato.nombre',
        partido: '$candidato.partido',
        totalVotos: 1
      }
    }
  ]);

  return resultados;
}

module.exports = { obtenerTop3Ganadores };
