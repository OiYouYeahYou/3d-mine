import React, { Component } from 'react'
import './App.css'
import { MineMap } from './js/Map'

const height = 10
const width = 10
const bombsToStart = 10

let map = new MineMap(height, width, bombsToStart)
let reveal = false

class App extends Component {
	render() {
		const { hasWon, dead, BombCount } = map
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
						map = new MineMap(height, width, bombsToStart)
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
				<br />
				<Field map={map} update={update} />
				<Field map={map} update={update} />
			</div>
		)
	}
}

class Field extends Component {
	render() {
		const { map, update } = this.props

		return (
			<table
				style={{
					margin: '0px auto',
					border: '3px',
					borderStyle: 'solid',
				}}
			>
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
		)
	}
}

class Tile extends Component {
	render() {
		const { tile, update, map } = this.props
		const { x, y, hasBomb, neighbourBombCount, open, flagged } = tile

		let content = ''
		let colour = 'aqua'

		if (open || map.dead || map.hasWon || reveal) {
			if (hasBomb) {
				colour = map.hasWon ? 'green' : 'red'
				content = 'x'
			} else if (neighbourBombCount === 0) {
				content = ''
				colour = 'white'
			} else {
				content = neighbourBombCount
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
					padding: '3px',
				}}
				onClick={() => {
					map.open(x, y)
					update()
				}}
				onDoubleClick={event => {
					event.preventDefault()
					map.takeABet(x, y)
					update()
				}}
				onContextMenu={event => {
					event.preventDefault()
					tile.flagged = !tile.flagged
					update()
				}}
			>
				{content}
			</td>
		)
	}
}

export default App
