import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import type { Movie, MovieDetails } from './data.js'
import { getAllMovies, filterMoviesByTitle, filterMoviesByCharacter, characterName } from './data.js'
import { formatMovieDetails, ratingDescription } from './utils.js'

const serverInfo = {
    name: 'star-wars',
    version: '1.0.0',
}

const server = new McpServer(serverInfo)

server.registerTool(
    'get-movies',
    {
        description: 'Get a list of Star Wars movies'
    },
    async () => {
        const movies: MovieDetails[] = getAllMovies().map((movie) => ({
            title: movie.title,
            releaseYear: movie.releaseYear,
            episode: movie.episode,
            rating: movie.rating,
            ratingDescription: ratingDescription(movie.rating),
            characters: movie.characters.map((id) => characterName(id))
        }))

        return {
            content: [
                {
                    type: 'text',
                    text: movies.length > 0 ? movies.map((movie) => formatMovieDetails(movie)).join('\n') : 'No movies found.'
                }
            ]
        }
    }
)

server.registerTool(
    'filter-movies',
    {
        description: 'Filter Star Wars movies by title or character name',
        inputSchema: {
            title: z.string().optional(),
            character: z.string().optional()
        }
    },
    async ({ title, character }) => {
        let foundMovies: Movie[] = []

        if (title)
            foundMovies = filterMoviesByTitle(title)

        if (character) {
            const characterMovies = filterMoviesByCharacter(character)
            foundMovies = title ? foundMovies.filter((movie) => characterMovies.includes(movie)) : characterMovies
        }

        const details: MovieDetails[] = foundMovies.map((movie) => ({
            title: movie.title,
            releaseYear: movie.releaseYear,
            episode: movie.episode,
            rating: movie.rating,
            ratingDescription: ratingDescription(movie.rating),
            characters: movie.characters.map((id) => characterName(id))
        }))

        return {
            content: [
                {
                    type: 'text',
                    text: foundMovies.length > 0 ? details.map((detail) => formatMovieDetails(detail)).join('\n') : 'No movies found.'
                }
            ]
        }
    }
)

server.registerPrompt(
    'sort-movies-by-rating',
    {
        title: 'Sort movies by rating',
        description: 'Sort Star Wars movies by their rating in ascending or descending order',
        argsSchema: {
            sortDirection: z.enum(['asc', 'desc'])
        }
    },
    async ({ sortDirection }) => {
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Sort Star Wars movies by rating in ${sortDirection}ending order.`
                    }
                }
            ]
        }
    }
)

server.registerPrompt(
    'find-movies-by-character',
    {
        title: 'Find movies by character',
        description: 'Search for Star Wars movies where a specific character appears',
        argsSchema: {
            character: z.string()
        }
    },
    async ({ character }) => {
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `In which Star Wars movies does ${character} appear?`
                    }
                }
            ]
        }
    }
)

async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    const outputInfo = `${serverInfo.name} ${serverInfo.version}`.trim()
    console.error(`MCP Server ${outputInfo} running on stdio`)
}

main().catch((error) => {
    console.error('Fatal error in main():', error)
    process.exit(1)
})