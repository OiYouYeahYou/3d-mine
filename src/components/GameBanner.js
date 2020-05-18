import React, { Component } from 'react'
import { newGame, toggleReveal, hoveredTile } from '../glue'

export class GameBanner extends Component {
	state = {
		showBrakedown: false,
	}

	render() {
		const {
			update,
			game: { dead, hasWon, BombCount },
		} = this.props
		let gameText = 'Keep Going'

		if (hasWon) {
			gameText = 'you has won'
		} else if (dead) {
			gameText = 'You is deaded'
		}

		return (
			<div>
				bombs: {BombCount}
				<br />
				{gameText}
				<br />
				<button
					onClick={() => {
						newGame()
						update()
					}}
				>
					new game
				</button>
				<button
					onClick={() => {
						toggleReveal()
						update()
					}}
				>
					reveal
				</button>
				<br />
				<span
					onClick={e => {
						e.preventDefault()
						this.setState({
							showBrakedown: !this.state.showBrakedown,
						})
					}}
				>
					Neigbours:
					{this.state.showBrakedown ? (
						<table style={breadownTableStyle}>
							<tbody>
								{breakDowns.map(({ name, key }) => (
									<tr>
										<td>{name}:</td>
										<td style={breakDownCellStyle}>
											{hoveredTile &&
												hoveredTile.counts[key]}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : null}
				</span>
			</div>
		)
	}
}

const breadownTableStyle = Object.freeze({ margin: '0px auto' })
const breakDownCellStyle = Object.freeze({ width: '2em' })
const breakDowns = Object.freeze(
	[
		{
			name: 'All',
			key: 'all',
		},
		{
			name: 'Face',
			key: 'face',
		},
		{
			name: 'Edge',
			key: 'edge',
		},
		{
			name: 'Vertex',
			key: 'vert',
		},
	].map(Object.freeze)
)
