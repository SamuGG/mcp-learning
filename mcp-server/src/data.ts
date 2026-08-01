export type Movie = {
    title: string
    releaseYear: number
    episode: number
    rating: number
    characters: number[]
}

export type Character = {
    id: number
    name: string
}

export type MovieDetails = {
    title: string
    releaseYear: number
    episode: number
    rating: number
    ratingDescription: string
    characters: string[]
}

const characters: Character[] = [
    { id: 1, name: "Anakin Skywalker" },
    { id: 2, name: "Obi-Wan Kenobi" },
    { id: 3, name: "Padmé Amidala" },
    { id: 4, name: "Luke Skywalker" },
    { id: 5, name: "Leia Organa" },
    { id: 6, name: "Han Solo" },
    { id: 7, name: "Darth Vader" },
    { id: 8, name: "Yoda" },
    { id: 9, name: "Chewbacca" },
    { id: 10, name: "R2-D2" },
    { id: 11, name: "C-3PO" },
    { id: 12, name: "Rey" }
]

const movies: Movie[] = [
    { title: "Star Wars: The Phantom Menace", releaseYear: 1999, rating: 3, episode: 1, characters: [1, 2, 3, 8, 10, 11] },
    { title: "Star Wars: Attack of the Clones", releaseYear: 2002, rating: 3, episode: 2, characters: [1, 2, 3, 8, 10, 11] },
    { title: "Star Wars: Revenge of the Sith", releaseYear: 2005, rating: 4, episode: 3, characters: [1, 2, 3, 8, 9, 10, 11] },
    { title: "Star Wars: A New Hope", releaseYear: 1977, rating: 5, episode: 4, characters: [2, 4, 5, 6, 7, 8, 9, 10, 11] },
    { title: "Star Wars: The Empire Strikes Back", releaseYear: 1980, rating: 5, episode: 5, characters: [2, 4, 5, 6, 7, 8, 9, 10, 11] },
    { title: "Star Wars: Return of the Jedi", releaseYear: 1983, rating: 4, episode: 6, characters: [2, 4, 5, 6, 7, 8, 9, 10, 11] },
    { title: "Star Wars: The Force Awakens", releaseYear: 2015, rating: 4, episode: 7, characters: [5, 6, 8, 9, 11, 12] },
    { title: "Star Wars: The Last Jedi", releaseYear: 2017, rating: 3, episode: 8, characters: [4, 5, 8, 9, 10, 11, 12] },
    { title: "Star Wars: The Rise of Skywalker", releaseYear: 2019, rating: 2, episode: 9, characters: [4, 5, 6, 7, 8, 9, 10, 11, 12] }
]

export function getAllMovies(): Movie[] {
    return movies.map((movie) => ({ ...movie, characters: [...movie.characters] }))
}

export function filterMoviesByTitle(title: string): Movie[] {
    return movies.filter((movie) => movie.title.toLowerCase().includes(title.toLowerCase()))
}

export function filterMoviesByCharacter(name: string): Movie[] {
    const charactersFound = characters.filter((c) => c.name.toLowerCase().includes(name.toLowerCase()))

    if (charactersFound.length === 0)
        return []

    return movies.filter((movie) => movie.characters.some((id) => charactersFound.some((c) => c.id === id)))
}

export function characterName(id: number): string {
    return characters.find((c) => c.id === id)?.name || 'Unknown'
}
