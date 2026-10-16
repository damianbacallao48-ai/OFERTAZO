const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexión segura a Supabase con credenciales del servidor
const supabase = createClient(
  process.env.SUPABASE_URL || "https://qhkqznpgjirvnndriehr.supabase.co",
  process.env.SUPABASE_KEY || "sb_publishable_Ih_3RgWJTptRasXqF9UcxQ_eTkkw7j-"
);

// Ruta de prueba
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend de OFERTAZO activo y seguro' });
});

// Ruta para validar el PIN del Súper Administrador
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  const pinMaestroSecreto = process.env.PIN_MAESTRO || "0110";

  if (pin === pinMaestroSecreto) {
    const token = jwt.sign({ role: 'superadmin' }, process.env.JWT_SECRET || 'clave_secreta', { expiresIn: '2h' });
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, message: 'PIN Maestro incorrecto' });
  }
});

// Ruta para validar el PIN de una tienda individual de forma segura
app.post('/api/tienda/login', async (req, res) => {
  const { slug, pin } = req.body;

  if (!slug || !pin) {
    return res.status(400).json({ success: false, message: 'Faltan datos requeridos.' });
  }

  try {
    const { data: negocio, error } = await supabase
      .from('negocios')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !negocio) {
      return res.status(404).json({ success: false, message: 'Negocio no encontrado.' });
    }

    const pinReal = String(
      negocio.pin_admin || 
      negocio.pin || 
      negocio.pin_seguridad || 
      negocio.password || 
      ""
    ).trim();

    if (pin === pinReal) {
      const token = jwt.sign({ role: 'tienda', slug: slug }, process.env.JWT_SECRET || 'clave_secreta', { expiresIn: '4h' });
      return res.json({ success: true, token, negocio });
    } else {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta.' });
    }
  } catch (err) {
    console.error("Error en servidor:", err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
