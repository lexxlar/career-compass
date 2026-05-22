const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/professions', require('./routes/professions'));
app.use('/api/progress', require('./routes/progress'));

const PORT = 8000;
app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));
