const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { body, validationResult, query } = require('express-validator');

// Fetch All Movies
router.get('/allMovies', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json(movies);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Some Error Occurred');
    }
});

// Add a Movie
router.post(
    '/addMovie',
    [
        body('id').isNumeric(),
        body('title').not().isEmpty(),
        body('genre').isArray(),
        body('language').not().isEmpty(),
        body('duration').not().isEmpty(),
        body('releaseDate').isDate(),
        body('synopsis').not().isEmpty(),
        body('cast').isArray(),
        body('director').not().isEmpty(),
        body('rating').isNumeric(),
        body('posterUrl').isURL(),
        body('backgroundImageUrl').isURL(),
        body('theaters').isArray()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const {
                id, title, genre, language, duration, releaseDate, synopsis, cast,
                director, rating, posterUrl, backgroundImageUrl, theaters
            } = req.body;

            let movie = new Movie({
                id, title, genre, language, duration, releaseDate, synopsis, cast,
                director, rating, posterUrl, backgroundImageUrl, theaters
            });

            movie = await movie.save();
            res.json(movie);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Some Error Occurred');
        }
    }
);

// Remove a Movie by ID
router.delete(
    '/removeMovie',
    [query('id').isNumeric()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const movie = await Movie.findOneAndDelete({ id: req.query.id });
            if (!movie) {
                return res.status(404).json({ msg: 'Movie not found' });
            }
            res.json({ msg: 'Movie removed successfully' });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Some Error Occurred');
        }
    }
);

// Add a Screen to a Theater
router.put(
    '/addScreenToTheater',
    [
      body('movieId').isNumeric(),
      body('theaterName').not().isEmpty(),
      body('screenName').not().isEmpty(),
      body('showtimes').isArray(),
      body('showtimes.*.time').not().isEmpty(),
      body('showtimes.*.seats').isArray()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const { movieId, theaterName, screenName, showtimes } = req.body;
  
        // Find the movie and theater
        const movie = await Movie.findOne({ id: movieId });
        if (!movie) {
          return res.status(404).json({ msg: 'Movie not found' });
        }
  
        const theaterIndex = movie.theaters.findIndex((theater) => theater.name === theaterName);
        if (theaterIndex === -1) {
          return res.status(404).json({ msg: 'Theater not found for this movie' });
        }
  
        // Check if the screen already exists
        const existingScreen = movie.theaters[theaterIndex].showtimes.find(
          (showtime) => showtime.screen === screenName
        );
        if (existingScreen) {
          return res.status(400).json({ msg: 'Screen already exists in this theater' });
        }
  
        // Create the new screen and showtimes
        const newScreen = {
          name: screenName,
          showtimes: showtimes.map((showtime) => ({
            time: showtime.time,
            screen: screenName,
            seats: showtime.seats.map(() => ({ isBooked: false, bookedBy: '' }))
          }))
        };
  
        // Add the new screen to the theater
        movie.theaters[theaterIndex].showtimes.push(...newScreen.showtimes);
  
        // Save the updated movie
        await movie.save();
  
        res.json({ msg: 'Screen added successfully' });
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Some Error Occurred');
      }
    }
  );

  // Remove a Screen from a Theater
router.put(
    '/removeScreenFromTheater',
    [
        body('movieId').isNumeric(),
        body('theaterName').not().isEmpty(),
        body('screenName').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { movieId, theaterName, screenName } = req.body;

            // Find the movie
            const movie = await Movie.findOne({ id: movieId });
            if (!movie) {
                return res.status(404).json({ msg: 'Movie not found' });
            }

            // Find the theater in the movie
            const theaterIndex = movie.theaters.findIndex(theater => theater.name === theaterName);
            if (theaterIndex === -1) {
                return res.status(404).json({ msg: 'Theater not found for this movie' });
            }

            // Find the screen in the theater
            const screenIndex = movie.theaters[theaterIndex].showtimes.findIndex(showtime => showtime.screen === screenName);
            if (screenIndex === -1) {
                return res.status(404).json({ msg: 'Screen not found in this theater' });
            }

            // Remove the screen from the theater
            movie.theaters[theaterIndex].showtimes.splice(screenIndex, 1);

            // Save the updated movie
            await movie.save();

            res.json({ msg: 'Screen removed successfully' });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Some Error Occurred');
        }
    }
);


module.exports = router;
