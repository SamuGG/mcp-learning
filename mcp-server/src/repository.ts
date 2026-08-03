import rawMovies from '../data/movies.json'
import rawCharacters from '../data/characters.json'

const movies = rawMovies as Movie[];
const characters = rawCharacters as Character[];

export interface Movie {
    title: string
    releaseYear: number
    episode: number
    rating: number
    characters: number[]
}

export interface Character {
    id: number
    name: string
}

export interface MovieDetails {
    title: string
    releaseYear: number
    episode: number
    rating: number
    ratingDescription: string
    characters: string[]
}

export function getAllMovies(): Movie[] {
    return movies.map((movie) => ({ ...movie, characters: [...movie.characters] }))
}

export function filterMoviesByTitle(title: string): Movie[] {
    return movies.filter((movie) => movie.title.toLowerCase().includes(title.toLowerCase()))
}

export function filterMoviesByCharacter(name: string): Movie[] {
    const normalizedName = name.trim().toLowerCase()
    if (normalizedName.length === 0)
        return []

    const charactersFound = characters.filter((c) => c.name.toLowerCase().includes(normalizedName))

    if (charactersFound.length === 0)
        return []

    return movies.filter((movie) => movie.characters.some((id) => charactersFound.some((c) => c.id === id)))
}

export function characterName(id: number): string {
    return characters.find((c) => c.id === id)?.name || 'Unknown'
}
