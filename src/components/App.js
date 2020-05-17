import React, { Component } from 'react'
import { Field } from './Field'
import { game, newGame, toggleReveal, hoveredTile } from '../glue'

export class App extends Component {
	state = {
		showBrakedown: false,
	}

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
			<div
				className="App"
				onContextMenu={event => event.preventDefault()}
			>
				bombs: {BombCount}
				<br />
				{gameText}
				<br />
				<span
					onClick={() => {
						newGame()
						update()
					}}
				>
					reset map
				</span>
				<br />
				<span
					onClick={() => {
						toggleReveal()
						update()
					}}
				>
					reveal
				</span>
				<br />
				<span
					onClick={e => {
						e.preventDefault()
						this.setState({
							showBrakedown: !this.state.showBrakedown,
						})
						update()
					}}
				>
					Neigbours:
					{this.state.showBrakedown ? (
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
