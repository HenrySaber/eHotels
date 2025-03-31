const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Routes
app.use('/api/guests', require('./routes/guests'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/chains', require('./routes/chains'));




app.get('/', (req, res) => {
    res.send('Welcome to ehotels API');
  });

  
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

