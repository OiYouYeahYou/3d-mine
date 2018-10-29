export class MineMap {
	constructor(height, width, bombCount) {
		const tiles = (this.tiles = {})
		const tileArray = (this.tileArray = [])
		const rows = (this.rows = {})
		this.height = height
		this.width = width
		this.dead = false

		for (var i = 0; i < height; i++) {
			rows[i] = []
		}

		const bombs = Array.from(
			{ length: height * width },
			(_, i) => bombCount > i
		)

		shuffle(bombs)
		shuffle(bombs)
		shuffle(bombs)

		for (var y = 0; y < width; y++) {
			const col = (tiles[y] = {})

			for (var x = 0; x < height; x++) {
				const tile = (col[x] = {
					x,
					y,
					hasBomb: bombs.shift(),
					flagged: false,
					opened: false,
				})

				rows[y].push(tile)
				tileArray.push(tile)
			}
		}

		tileArray.forEach(tile => {
			const { x, y } = tile
			const neigbours = [
				this.getTile(x + 0, y - 1),
				this.getTile(x + 1, y - 1),
				this.getTile(x + 1, y + 0),
				this.getTile(x + 1, y + 1),
				this.getTile(x + 0, y + 1),
				this.getTile(x - 1, y + 1),
				this.getTile(x - 1, y + 0),
				this.getTile(x - 1, y - 1),
			].filter(Boolean)

			tile.neigbours = neigbours
			tile.neighbourBombCount = neigbours.reduce(
				(cnt, { hasBomb }) => cnt + hasBomb,
				0
			)
		})
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

	takeABet(x, y) {
		const tile = this.getTile(x, y)
		const { neigbours, neighbourBombCount } = tile
		const flaggedNeighbours = neigbours.filter(tile => tile.flagged)

		if (flaggedNeighbours.length !== neighbourBombCount) {
			return
		}

		const neigboursToOpen = neigbours.filter(
			({ open, flagged }) => !open && !flagged
		)

		neigboursToOpen.forEach(({ x, y }) => this.open(x, y))
	}

	get BombCount() {
		let bombs = 0
		let flagged = 0

		for (const tile of this.tileArray) {
			bombs += tile.hasBomb
			flagged += tile.flagged
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

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}
}
