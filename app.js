const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Candidato = require('./models/candidato');
const Votante = require('./models/votante');
const Voto = require('./models/voto');
const { obtenerTopGanadores } = require('./models/ganadores'); // ✅ nombre correcto

const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Rutas

// Registrar candidatos
app.post('/candidatos', async (req, res) => {
  const candidato = new Candidato(req.body);
  await candidato.save();
  res.json(candidato);
});

// Mostrar todos los candidatos
app.get('/candidatos', async (req, res) => {
  const candidatos = await Candidato.find();
  res.json(candidatos);
});

// Registrar votantes
app.post('/votantes', async (req, res) => {
  const votante = new Votante(req.body);
  await votante.save();
  res.json(votante);
});

// Mostrar todos los votantes
app.get('/votantes', async (req, res) => {
  const votantes = await Votante.find();
  res.json(votantes);
});

// Votar
app.post('/votos', async (req, res) => {
  const { candidatoId, votanteId } = req.body;
  const yaVoto = await Voto.findOne({ votante: votanteId });
  if (yaVoto) return res.status(400).json({ mensaje: 'El votante ya emitió su voto.' });

  const voto = new Voto({ candidato: candidatoId, votante: votanteId });
  await voto.save();
  res.json({ mensaje: 'Voto registrado' });
});

// Mostrar todos los votos
app.get('/votos', async (req, res) => {
  const votos = await Voto.find()
    .populate('candidato', 'nombre partido')
    .populate('votante', 'nombre dni');
  res.json(votos);
});

// Mostrar los 3 ganadores
app.get('/ganadores', async (req, res) => {
  try {
    const ganadores = await obtenerTopGanadores(3); // ✅ pasa el valor 3
    res.json(ganadores);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener ganadores', error: err.message });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
