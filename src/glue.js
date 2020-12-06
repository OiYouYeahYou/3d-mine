import './App.css'
import { Game } from './js/Game'

const layers = 4
const height = 12
const width = 12
const bombsToStart = 25

export let game
export let reveal = false
export const newGame = () =>
	(game = new Game(layers, height, width, bombsToStart))
export const toggleReveal = () => (reveal = !reveal)

newGame()

export let hoveredTile
export const hover = tile => (hoveredTile = tile)
