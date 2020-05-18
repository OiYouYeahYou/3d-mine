import React, { Component } from 'react'
import { Field } from './Field'
import { game } from '../glue'
import { GameBanner } from './GameBanner'

export class App extends Component {
	render() {
		const update = () => this.forceUpdate()

		return (
			<div
				className="App"
				onContextMenu={event => event.preventDefault()}
			>
				<GameBanner update={update} game={game} />
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
