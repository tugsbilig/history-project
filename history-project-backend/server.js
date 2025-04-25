require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Database connection events
mongoose.connection.once('open', async () => {
  console.log('MongoDB connection established');
  
  // Optional: Auto-seed famous figures if collection is empty
  const { seedFamousFigures } = require('./controllers/famousFiguresController');
  const Figure = require('./models/FamousFigure');
  
  if (process.env.NODE_ENV !== 'production') {
    const count = await Figure.countDocuments();
    if (count === 0) {
      console.log('Seeding initial famous figures data...');
      await seedFamousFigures();
    }
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('History Project Backend');
});

// API Routes
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
const famousFiguresRoutes = require('./routes/famousFiguresRoutes');
const historyEventRoutes = require('./routes/historyEventRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);  // Changed to more consistent naming
app.use('/api/famous-figures', famousFiguresRoutes);  // Using hyphen-case for URLs
app.use('/api/history-events', historyEventRoutes);
// Error handling middleware (should be after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});