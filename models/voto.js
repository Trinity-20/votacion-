const mongoose = require('mongoose');

const VotoSchema = new mongoose.Schema({
  candidato: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidato',
    required: true
  },
  votante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Votante',
    required: true
  }
});

const Voto = mongoose.model('Voto', VotoSchema);
module.exports = Voto;


if (require.main === module) {
  require('dotenv').config();

  async function corregirVotos() {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const votos = await Voto.find();
    for (const voto of votos) {
      if (typeof voto.candidato === 'string') {
        voto.candidato = new mongoose.Types.ObjectId(voto.candidato);
        await voto.save();
        console.log(`✔️ Corregido voto ${voto._id}`);
      }
    }

    mongoose.disconnect();
    console.log("✅ Corrección finalizada");
  }

  corregirVotos();
}
