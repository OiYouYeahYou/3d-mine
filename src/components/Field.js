import React, { Component } from 'react'
import { Tile } from './Tile'

export class Field extends Component {
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
