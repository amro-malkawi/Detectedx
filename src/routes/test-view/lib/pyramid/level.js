import Tile from './tile';

export default class Level {
    constructor(options) {
        let { pyramid, width, height, depth, tileSize, urlTemplate } = options;
        this.pyramid  = pyramid;
        this.width    = width;
        this.height   = height;
        this.depth    = depth;
        this.tiles    = [];
        this.isLoaded = false;

        this.cols = Math.ceil(width / tileSize);
        this.rows = Math.ceil(height / tileSize);

        let scale = Math.pow(2, pyramid.max_depth - this.depth);
        let lastColWidth  = width - ((this.cols - 1) * tileSize);
        let lastRowHeight = height - ((this.rows - 1) * tileSize);

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let x = (col * tileSize) * scale;
                let y = (row * tileSize) * scale;
                let width  = tileSize * scale;
                let height = tileSize * scale;

                // adjust the height of the last row
                if (row === (this.rows - 1))
                    height = lastRowHeight * scale;

                // adjust the width of the last col
                if (col === (this.cols - 1))
                    width = lastColWidth * scale;

                let tile = new Tile({
                    level: this,
                    col,
                    row,
                    x,
                    y,
                    width,
                    height,
                    urlTemplate
                });

                this.tiles.push(tile);
            }
        }
    }

    load() {
        if (!this.isLoaded) {
            this.tiles.forEach(tile => tile.loadTileImage())
            this.isLoaded = true;
        }
    }

    loadLevelForWorker() {
        return Promise.all(this.tiles.map((tile) => tile.loadTileForWorker()));
    }

    tile(options) {
        let {row, col} = options;
        let offset = (row * this.cols) + col;
        return this.tiles[offset];
    }
}
