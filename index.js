const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000; 
const cors = require('cors');


app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:3000', 'https://where-to-go-maps.vercel.app'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// 
app.post('/directions', async (req, res) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const { origin, destination, mode } = req.body;

  const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}&mode=${mode}`;
  console.log('API Request URL:', apiUrl);

  try {
    const response = await axios.get(apiUrl);
    const directions = response.data;
    console.log('Directions received:', directions);
    res.end(JSON.stringify(directions, null, 2));
  } catch (error) {
    console.log(apiUrl);
    console.error('Could not get directions:', error);
    res.status(500).json({ error: 'Could not get directions' });
  }
});

  app.get('/streetview', async (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    //const location = req.query.location; // Get the location from the query parameters
    //const location = '43.7687264, -79.4136525'

    const location = req.query.location;
    const size = '300x300';
    const apiUrl = `https://maps.googleapis.com/maps/api/streetview?location=${location}&key=${apiKey}&size=${size}`;
    console.log('Street View API Request URL:', apiUrl);
  
    try {
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      const imageData = response.data;
  
      // Set the appropriate headers for the image response
      res.set('Content-Type', 'image/jpeg');
      res.send(imageData);
    } catch (error) {
      console.error('Could not get Street View image:', error);
      res.status(500).json({ error: 'Could not get Street View image' });
    }
  });


  app.post('/translate', async (req, res) => {

    if (!req.body || !req.body.q || !req.body.source || !req.body.target) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      const { q, source, target } = req.body;
      const response = await axios.post('https://translate.argosopentech.com/translate', {
        q,
        source,
        target,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error(error);
      console.log(response); //added for debugging 
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  
  
  app.get('/languages', async (req, res) => {
    try {
      const response = await axios.post('https://translate.argosopentech.com/languages', {
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const languages = response.data;
      console.log('Languages:', response.data);
      res.json({ languages });
    } catch (error) {
      console.error('Couldnt retrieve languages:', error);
      res.status(500).json({ error: 'Languages not available' });
    }
  });
  
  
// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});