import type { Movie, MovieDetails } from "./data.js"
import { characterName } from "./data.js"

const ratingDescriptions: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
}

export function ratingDescription(rating: number): string {
    return ratingDescriptions[rating] || 'Unknown'
}

export function formatMovieDetails(movie: MovieDetails): string {
    return `${movie.title} (${movie.releaseYear}) - Rating: ${movie.ratingDescription} (${movie.rating}/5) - Cast: ${movie.characters.join(', ')}`
}

export function toMovieDetails(movie: Movie): MovieDetails {
    return {
        title: movie.title,
        releaseYear: movie.releaseYear,
        episode: movie.episode,
        rating: movie.rating,
        ratingDescription: ratingDescription(movie.rating),
        characters: movie.characters.map((id) => characterName(id))
    }
}