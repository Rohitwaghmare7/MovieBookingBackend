const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const showtimeSchema = new Schema({
    time: {
        type: String,  
        required: true
    },
    screen: {
        type: String,
        required: true
    },
    seats: [
        {
            isBooked: {
                type: Boolean,
                default: false
            },
            bookedBy: {
                type: String,
                default: ''
            }
        }
    ]
});

const theaterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    showtimes: [showtimeSchema] 
});

const movieSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true // Ensure the ID is unique
    },
    title: {
        type: String,
        required: true
    },
    genre: [
        {
            type: String,
            required: true
        }
    ],
    language: {
        type: String,
        required: true
    },
    duration: {
        type: String, 
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    synopsis: {
        type: String,
        required: true
    },
    cast: [
        {
            type: String,
            required: true
        }
    ],
    director: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    posterUrl: {
        type: String,
        required: true
    },
    backgroundImageUrl: {
        type: String,
        required: true
    },
    theaters: [theaterSchema]  
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
