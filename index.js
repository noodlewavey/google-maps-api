const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 4000; // this is the port 

// 
app.get('/directions', async (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    //const origin = req.query.origin; // Get the origin from the query parameters
    //const destination = req.query.destination;
    //const mode = req.query.mode
    const origin = '9+McKee+Avenue+North+York+ON';
    const destination = 'North+York+Centre+Station';
    const mode = 'walking'
  
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}&mode=${mode}`;
    console.log('API Request URL:', apiUrl);
  
    try {
      const response = await axios.get(apiUrl);
      const directions = response.data;
      console.log('Directions received:', directions);
      res.json(directions);
    } catch (error) {
      console.error('Could not get directions:', error);
      res.status(500).json({ error: 'Could not get directions' });
    }
  });

  app.get('/streetview', async (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    //const location = req.query.location; // Get the location from the query parameters
    const location = '43.7687264, -79.4136525'
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


  app.get('/translate', async (req, res) => {
    try {
      const response = await axios.post('https://translate.argosopentech.com/translate', {
        q: 'Ciao!',
        source: 'auto',
        target: 'en',
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const translation = response.data.translatedText;
      console.log('Translation:', translation);
      //nevermind this works
      console.log('response', response.data)
      res.json({ translation });
    } catch (error) {
      console.error('Translation failed:', error);
      res.status(500).json({ error: 'Translation failed' });
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
