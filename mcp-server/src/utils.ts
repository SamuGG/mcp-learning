import type { MovieDetails } from "./data.js"

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