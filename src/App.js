import React, { Component } from 'react'
import './App.css'
import { Game } from './js/Game'

const layers = 4
const height = 12
const width = 12
const bombsToStart = 25

let game = new Game(layers, height, width, bombsToStart)
let reveal = false
let showBrakedown = false

let hoveredTile
const hover = tile => (hoveredTile = tile)

class App extends Component {
	render() {
		const { dead, hasWon, BombCount } = game
		let gameText = 'Keep Going'

		if (hasWon) {
			gameText = 'you has won'
		} else if (dead) {
			gameText = 'You is deaded'
		}

		const update = () => this.forceUpdate()

		return (
			<div className="App">
				bombs: {BombCount}
				<br />
				{gameText}
				<br />
				<span
					onClick={() => {
						game = new Game(layers, height, width, bombsToStart)
						update()
					}}
				>
					reset map
				</span>
				<br />
				<span
					onClick={() => {
						reveal = !reveal
						update()
					}}
				>
					reveal
				</span>
				<br />
				<span
					onClick={e => {
						e.preventDefault()
						showBrakedown = !showBrakedown
						update()
					}}
				>
					Neigbours:
					{showBrakedown ? (
						<table
							style={{
								margin: '0px auto',
							}}
						>
							<tbody>
								<tr>
									<td>All:</td>
									<td style={{ width: '2em' }}>
										{hoveredTile && hoveredTile.counts.all}
									</td>
								</tr>
								<tr>
									<td>Face:</td>
									<td style={{ width: '2em' }}>
										{hoveredTile && hoveredTile.counts.face}
									</td>
								</tr>
								<tr>
									<td>Edge:</td>
									<td style={{ width: '2em' }}>
										{hoveredTile && hoveredTile.counts.edge}
									</td>
								</tr>
								<tr>
									<td>Vertex:</td>
									<td style={{ width: '2em' }}>
										{hoveredTile && hoveredTile.counts.vert}
									</td>
								</tr>
							</tbody>
						</table>
					) : null}
				</span>
				<br />
				<br />
				{game.layerArray.map(layer => (
					<Field
						map={layer}
						update={update}
						key={`layer-${layer.z}`}
					/>
				))}
			</div>
		)
	}
}

class Field extends Component {
	render() {
		const { map, update } = this.props

		return (
			<div
				style={{
					margin: '0px auto',
					border: '3px',
					borderStyle: 'solid',
					display: 'inline-block',
				}}
			>
				<table>
					<tbody>
						{Object.values(map.rows).map((row, x) => (
							<tr key={`row-${x}`}>
								{row.map((tile, y) => (
									<Tile
										key={`tile-${y}-${x}`}
										map={map}
										tile={tile}
										update={update}
									/>
								))}
							</tr>
						))}
					</tbody>
				</table>
				bombs: {map.BombCount}
			</div>
		)
	}
}

class Tile extends Component {
	render() {
		const { tile, update, map } = this.props
		const { x, y, z, hasBomb, neighbourBombCount, open, flagged } = tile

		let content = ''
		let colour = 'aqua'

		if (open || game.dead || game.hasWon || reveal) {
			if (hasBomb) {
				colour = game.hasWon ? 'green' : 'red'
				content = 'x'
			} else if (neighbourBombCount === 0) {
				content = ''
				colour = 'white'
			} else {
				content = neighbourBombCount
				// - tile.neigbours.reduce((acc, tile) => acc + tile.flagged, 0)

				if (content === 0) {
					content = '.'
				}
				colour = 'white'
			}
		} else if (flagged) {
			content = 'f'
			colour = 'green'
		}

		return (
			<td
				style={{
					width: '1.5em',
					height: '1.5em',
					background: colour,
					margin: '0',
					padding: '0',
					border: '1px',
					borderStyle: 'solid',
					borderColor:
						hoveredTile && hoveredTile.neigbours.includes(tile)
							? 'black'
							: 'white',
				}}
				onClick={() => {
					game.open(x, y, z)
					update()
				}}
				onDoubleClick={event => {
					event.preventDefault()
					game.takeABet(x, y, z)
					update()
				}}
				onContextMenu={event => {
					event.preventDefault()
					tile.flagged = !tile.flagged
					update()
				}}
				onWheel={e => console.log(e)}
				onMouseEnter={e => {
					e.preventDefault()
					hover(tile)
					update()
				}}
				onMouseLeave={e => {
					e.preventDefault()
					hoveredTile = null
					update()
				}}
			>
				{content}
			</td>
		)
	}
}

export default App
