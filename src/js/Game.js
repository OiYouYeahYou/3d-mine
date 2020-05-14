import { MineMap } from './Map'

export class Game {
	constructor(layerCount, height, width, bombCount) {
		const layers = (this.layers = {})
		const tileArray = (this.tileArray = [])
		this.layerArray = []

		const bombs = Array.from(
			{ length: layerCount * height * width },
			(_, i) => bombCount > i
		)

		shuffle(bombs)
		shuffle(bombs)
		shuffle(bombs)

		for (var i = 0; i < layerCount; i++) {
			const map = new MineMap(height, width, bombs)
			layers[i] = map
			map.z = i
			this.layerArray.push(map)
			map.tileArray.forEach(tile => {
				tile.z = i
				this.tileArray.push(tile)
			})
		}

		tileArray.forEach(tile => {
			const getTile = (a, b, c) =>
				this.getTile(tile.x + a, tile.y + b, tile.z + c)

			const face = [
				getTile(+0, +0, +1),
				getTile(+0, +0, -1),

				getTile(+0, +1, +0),
				getTile(+0, -1, +0),
				getTile(+1, +0, +0),
				getTile(-1, +0, +0),
			].filter(Boolean)
			const edge = [
				getTile(+0, +1, +1),
				getTile(+0, -1, +1),
				getTile(+1, +0, +1),
				getTile(-1, +0, +1),

				getTile(+1, +1, +0),
				getTile(-1, -1, +0),
				getTile(+1, -1, +0),
				getTile(-1, +1, +0),

				getTile(+0, +1, -1),
				getTile(+0, -1, -1),
				getTile(+1, +0, -1),
				getTile(-1, +0, -1),
			].filter(Boolean)
			const vert = [
				getTile(+1, +1, +1),
				getTile(-1, -1, +1),
				getTile(+1, -1, +1),
				getTile(-1, +1, +1),

				getTile(+1, +1, -1),
				getTile(-1, -1, -1),
				getTile(+1, -1, -1),
				getTile(-1, +1, -1),
			].filter(Boolean)

			const neigbours = (tile.neigbours = [])
			neigbours.push(...face, ...edge, ...vert)
			tile.neighbourBombCount = neigbours.reduce(neighbourBombReducer, 0)

			tile.counts = {
				all: neigbours.reduce(neighbourBombReducer, 0),
				face: face.reduce(neighbourBombReducer, 0),
				edge: edge.reduce(neighbourBombReducer, 0),
				vert: vert.reduce(neighbourBombReducer, 0),
			}
		})

		tileArray.forEach(tile => {
			if (tile.neighbourBombCount === 0 && !tile.hasBomb) {
				tile.open = true
				tile.neigbours.forEach(tile => (tile.open = true))
			}
		})
	}

	getLayer(z) {
		return this.layers[z]
	}

	getTile(x, y, z) {
		const layer = this.getLayer(z)

		return layer && layer.getTile(x, y)
	}

	open(x, y, z) {
		const layer = this.getLayer(z)

		return layer && layer.open(x, y)
	}

	takeABet(x, y, z) {
		const tile = this.getTile(x, y, z)
		const { neigbours, neighbourBombCount } = tile
		const flaggedNeighbours = neigbours.filter(
			tile => !tile.open && tile.flagged
		)

		if (flaggedNeighbours.length !== neighbourBombCount) {
			return
		}

		const neigboursToOpen = neigbours.filter(
			({ open, flagged }) => !open && !flagged
		)

		neigboursToOpen.forEach(({ x, y, z }) => this.open(x, y, z))
	}

	get BombCount() {
		if (this.hasWon) {
			return 0
		}

		return this.layerArray.reduce((v, l) => v + l.BombCount, 0)
	}

	get hasWon() {
		const remaining = this.tileArray.filter(
			tile => !tile.open && !tile.hasBomb
		)

		if (remaining.length === 0) {
			return true
		}

		for (const tile of this.tileArray) {
			if (tile.hasBomb !== tile.flagged) {
				return false
			}
		}

		return true
	}

	get dead() {
		return this.layerArray.some(l => l.dead)
	}
}

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}
}

const neighbourBombReducer = (cnt, { hasBomb }) => cnt + hasBomb
