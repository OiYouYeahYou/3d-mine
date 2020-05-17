import React, { Component } from 'react'
import { game, reveal, hoveredTile, hover } from '../glue'

export class Tile extends Component {
	render() {
		const { tile } = this.props
		const { hasBomb, neighbourBombCount, open, flagged } = tile

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
				onMouseUp={this.onMouseUp.bind(this)}
				onDoubleClick={this.takeABet.bind(this)}
				onMouseEnter={this.setCursor.bind(this)}
			>
				{content}
			</td>
		)
	}

	/**
	 * @param {React.MouseEvent<HTMLTableDataCellElement, MouseEvent>} event
	 */
	onMouseUp(event) {
		switch (event.button) {
			case 0: // left
				this.openTile(event)
				break
			case 1: // middle
				this.takeABet(event)
				break
			case 2: // right
				this.setFlag(event)
				break
			case 3: // back button
			case 4: // forward button
			default:
				break
		}
	}

	/**
	 * @param {React.MouseEvent<HTMLTableDataCellElement, MouseEvent>} event
	 */
	takeABet(event) {
		const { x, y, z } = this.props.tile
		event.preventDefault()
		game.takeABet(x, y, z)
		this.props.update()
	}

	/**
	 * @param {React.MouseEvent<HTMLTableDataCellElement, MouseEvent>} event
	 */
	openTile(event) {
		const { x, y, z } = this.props.tile
		event.preventDefault()
		game.open(x, y, z)
		this.props.update()
	}

	/**
	 * @param {React.MouseEvent<HTMLTableDataCellElement, MouseEvent>} event
	 */
	setCursor(event) {
		hover(this.props.tile)
		this.props.update()
	}

	/**
	 * @param {React.MouseEvent<HTMLTableDataCellElement, MouseEvent>} event
	 */
	setFlag(event) {
		const { tile, update } = this.props
		tile.flagged = !tile.flagged
		update()
	}
}
