import React, { Component } from 'react'
import { game, reveal, hoveredTile, hover } from '../glue'

export class Tile extends Component {
	render() {
		const { tile, update } = this.props
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
					hover(null)
					update()
				}}
			>
				{content}
			</td>
		)
	}
}
