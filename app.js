const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { Candidato, Votante, Voto, obtenerTopGanadores } = require('./models');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Registrar candidatos
app.post('/candidatos', async (req, res) => {
  const candidato = new Candidato(req.body);
  await candidato.save();
  res.redirect('/candidatos');
});

// Eliminar candidato
app.post('/candidatos/eliminar/:id', async (req, res) => {
  await Candidato.findByIdAndDelete(req.params.id);
  res.redirect('/candidatos');
});

// Mostrar candidatos con agregar y eliminar
app.get('/candidatos', async (req, res) => {
  const candidatos = await Candidato.find();
  let html = `
    <html><head><title>Candidatos</title><style>
      body { font-family: sans-serif; background: #f0f2f5; padding: 20px; }
      h2 { color: #2d3436; }
      form, ul { margin-bottom: 30px; }
      li { margin: 10px 0; padding: 10px; background: #dfe6e9; border-radius: 5px; }
      input { margin-right: 10px; padding: 5px; }
      button { padding: 5px 10px; background: #d63031; color: white; border: none; border-radius: 3px; cursor: pointer; }
      a { display: block; margin-top: 20px; color: #0984e3; text-decoration: none; }
    </style></head><body>
    <h2>Lista de Candidatos</h2>

    <form method="POST" action="/candidatos">
      <input name="nombre" placeholder="Nombre" required />
      <input name="partido" placeholder="Partido" required />
      <button type="submit">Agregar</button>
    </form>

    <ul>`;

  candidatos.forEach(c => {
    html += `<li>
      ${c.nombre} - ${c.partido}
      <form method="POST" action="/candidatos/eliminar/${c._id}" style="display:inline">
        <button type="submit">Eliminar</button>
      </form>
    </li>`;
  });

  html += `</ul><a href="/index">⬅ Volver al inicio</a></body></html>`;
  res.send(html);
});

// Registrar votantes
app.post('/votantes', async (req, res) => {
  const votante = new Votante(req.body);
  await votante.save();
  res.redirect('/votantes');
});

// Eliminar votante
app.post('/votantes/eliminar/:id', async (req, res) => {
  await Votante.findByIdAndDelete(req.params.id);
  res.redirect('/votantes');
});

// Mostrar votantes con agregar y eliminar
app.get('/votantes', async (req, res) => {
  const votantes = await Votante.find();
  let html = `
    <html><head><title>Votantes</title><style>
      body { font-family: sans-serif; background: #f0f2f5; padding: 20px; }
      h2 { color: #2d3436; }
      form, ul { margin-bottom: 30px; }
      li { margin: 10px 0; padding: 10px; background: #ffeaa7; border-radius: 5px; }
      input { margin-right: 10px; padding: 5px; }
      button { padding: 5px 10px; background: #e17055; color: white; border: none; border-radius: 3px; cursor: pointer; }
      a { display: block; margin-top: 20px; color: #d63031; text-decoration: none; }
    </style></head><body>
    <h2>Lista de Votantes</h2>

    <form method="POST" action="/votantes">
      <input name="nombre" placeholder="Nombre" required />
      <input name="dni" placeholder="DNI" required />
      <button type="submit">Agregar</button>
    </form>

    <ul>`;

  votantes.forEach(v => {
    html += `<li>
      ${v.nombre} - DNI: ${v.dni}
      <form method="POST" action="/votantes/eliminar/${v._id}" style="display:inline">
        <button type="submit">Eliminar</button>
      </form>
    </li>`;
  });

  html += `</ul><a href="/index">⬅ Volver al inicio</a></body></html>`;
  res.send(html);
});

// Registrar voto
app.post('/votos', async (req, res) => {
  const { candidatoId, votanteId } = req.body;
  const yaVoto = await Voto.findOne({ votante: votanteId });
  if (yaVoto) return res.send('<p>El votante ya emitió su voto. <a href="/votos">Volver</a></p>');
  const voto = new Voto({ candidato: candidatoId, votante: votanteId });
  await voto.save();
  res.redirect('/votos');
});

// Eliminar voto
app.post('/votos/eliminar/:id', async (req, res) => {
  await Voto.findByIdAndDelete(req.params.id);
  res.redirect('/votos');
});

// Mostrar votos con agregar y eliminar
app.get('/votos', async (req, res) => {
  const votos = await Voto.find()
    .populate('candidato', 'nombre partido')
    .populate('votante', 'nombre dni');

  let html = `
    <html><head><title>Votos</title><style>
      body { font-family: sans-serif; background: #f0f2f5; padding: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ccc; padding: 10px; }
      th { background: #81ecec; }
      form { margin-bottom: 30px; }
      input { margin-right: 10px; padding: 5px; }
      button { padding: 5px 10px; background: #00b894; color: white; border: none; border-radius: 3px; cursor: pointer; }
      a { display: block; margin-top: 20px; color: #00cec9; text-decoration: none; }
    </style></head><body>
    <h2>Lista de Votos</h2>

    <form method="POST" action="/votos">
      <input name="votanteId" placeholder="ID del votante" required />
      <input name="candidatoId" placeholder="ID del candidato" required />
      <button type="submit">Emitir Voto</button>
    </form>

    <table><tr><th>Votante</th><th>DNI</th><th>Candidato</th><th>Partido</th><th>Acciones</th></tr>`;

  votos.forEach(v => {
    html += `<tr>
      <td>${v.votante.nombre}</td><td>${v.votante.dni}</td>
      <td>${v.candidato.nombre}</td><td>${v.candidato.partido}</td>
      <td>
        <form method="POST" action="/votos/eliminar/${v._id}" style="display:inline">
          <button type="submit">Eliminar</button>
        </form>
      </td>
    </tr>`;
  });

  html += `</table><a href="/index">⬅ Volver al inicio</a></body></html>`;
  res.send(html);
});

// Mostrar ganadores
app.get('/ganadores', async (req, res) => {
  try {
    const ganadores = await obtenerTopGanadores(3);
    let html = `
      <html><head><title>Ganadores</title><style>
        body { font-family: sans-serif; background: #f0f2f5; padding: 20px; }
        ol { padding-left: 20px; }
        li { background: #fab1a0; margin: 10px 0; padding: 10px; border-radius: 5px; }
        a { display: block; margin-top: 20px; color: #e84393; text-decoration: none; }
      </style></head><body>
      <h2>Top 3 Ganadores</h2><ol>`;

    ganadores.forEach(g => {
      html += `<li><strong>${g.nombre}</strong> - ${g.partido} (${g.totalVotos} votos)</li>`;
    });

    html += `</ol><a href="/index">⬅ Volver al inicio</a></body></html>`;
    res.send(html);
  } catch (err) {
    res.status(500).send(`<p>Error al obtener ganadores: ${err.message}</p>`);
  }
});

// Página principal
app.get('/index', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Inicio | Sistema de Elecciones</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background: #f5f6fa;
            padding: 40px;
            text-align: center;
          }
          h1 {
            color: #2f3640;
            font-size: 36px;
          }
          .menu {
            margin-top: 30px;
          }
          a {
            display: block;
            margin: 10px auto;
            font-size: 20px;
            color: #0097e6;
            text-decoration: none;
            width: fit-content;
          }
          a:hover {
            color: #273c75;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Bienvenido al Sistema de Elecciones</h1>
        <div class="menu">
          <a href="/candidatos">📋 Ver Candidatos</a>
          <a href="/votantes">🧍 Ver Votantes</a>
          <a href="/votos">🗳️ Ver Votos</a>
          <a href="/ganadores">🏆 Ver Ganadores</a>
        </div>
      </body>
    </html>
  `);
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
