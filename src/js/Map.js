export class MineMap {
	constructor(height, width, bombs) {
		const tiles = (this.tiles = {})
		const tileArray = (this.tileArray = [])
		const rows = (this.rows = {})
		this.height = height
		this.width = width
		this.dead = false

		for (var i = 0; i < height; i++) {
			rows[i] = []
		}

		for (var y = 0; y < width; y++) {
			const col = (tiles[y] = {})

			for (var x = 0; x < height; x++) {
				const tile = (col[x] = {
					x,
					y,
					hasBomb: bombs.shift(),
					flagged: false,
					opened: false,
					layer: undefined,
				})

				rows[y].push(tile)
				tileArray.push(tile)
			}
		}
	}

	getTile(x, y) {
		return this.tiles[y] && this.tiles[y][x]
	}

	open(x, y) {
		const tile = this.getTile(x, y)

		if (tile.open || tile.flagged) {
			return
		} else if (tile.hasBomb) {
			this.dead = true
		} else {
			tile.open = true

			if (tile.neighbourBombCount === 0) {
				const voildTiles = [tile]
				const push = t => voildTiles.push(t)
				let existing = voildTiles.length
				let n = 0

				const filterForVoid = t =>
					t.neighbourBombCount === 0 && !voildTiles.includes(t)
				const process = t =>
					t.neigbours.filter(filterForVoid).forEach(push)

				while (existing !== n) {
					existing = voildTiles.length
					voildTiles.forEach(process)
					n = voildTiles.length
				}

				const filterForNew = t => !voildTiles.includes(t)

				voildTiles.forEach(t =>
					t.neigbours.filter(filterForNew).forEach(push)
				)

				voildTiles.forEach(tile => (tile.open = true))
			}
		}
	}

	get BombCount() {
		let bombs = 0
		let flagged = 0

		for (const tile of this.tileArray) {
			bombs += tile.hasBomb
			flagged += !tile.open && tile.flagged
		}

		return bombs - flagged
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
}
