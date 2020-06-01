import './App.css'
import { Game } from './js/Game'

const layers = 12
const height = 20
const width = 20
const bombsToStart = 250

export let game
export let reveal = false
export const newGame = () =>
	(game = new Game(layers, height, width, bombsToStart))
export const toggleReveal = () => (reveal = !reveal)

newGame()

export let hoveredTile
export const hover = tile => (hoveredTile = tile)
