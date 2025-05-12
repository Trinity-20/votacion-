const mongoose = require('mongoose');
const Voto = require('./voto');

async function obtenerTopGanadores(limit = 3) {
  const resultados = await Voto.aggregate([
    {
      $group: {
        _id: { $toObjectId: "$candidato" },
        totalVotos: { $sum: 1 }
      }
    },
    { $sort: { totalVotos: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "candidatos",
        localField: "_id",
        foreignField: "_id",
        as: "candidato"
      }
    },
    { $unwind: "$candidato" },
    {
      $project: {
        _id: 0,
        nombre: "$candidato.nombre",
        partido: "$candidato.partido",
        totalVotos: 1
      }
    }
  ]);

  return resultados;
}

module.exports = { obtenerTopGanadores };
