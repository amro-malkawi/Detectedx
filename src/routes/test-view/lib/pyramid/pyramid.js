import Level from './level';

export default class Pyramid {
    constructor(imageId, data, stack) {
        let {id, width, height, max_depth, tileSize, urlTemplate} = data;
        this.imageId = imageId;    // cornerstone image id, not db image id
        this.max_depth = max_depth;
        this.width = width;
        this.height = height;
        this.levels = [];
        this.pyramidShow = true;

        // as the image is panned and zoomed, higher levels (higher
        // res) are loaded. If the image is zoomed out, we don't
        // want to draw a lower res level over the top of the existing
        // higher res level, so we track the highest res level
        // loaded, and only load a new level if it's greater than this.
        this.maxLoadedLevel = -1;

        // store a reference to this pyramid on the relevant image
        // element so layers can be loaded in response to pannning
        // and zooming.
        let imageElement = document.querySelector(`#image${id} .dicom`);
        if (imageElement.pyramid === undefined) imageElement.pyramid = {};
        imageElement.pyramid[stack] = this;

        // as tiles load they're drawn into this (offscreen) canvas
        // before telling cornerstone to redraw from the canvas
        if (imageElement.canvas === undefined) {
            imageElement.canvas = document.createElement('canvas');
        }
        this.canvas = imageElement.canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, width, height);

        // keep track of the current level's dimensions (lower levels
        // are half the size of the next level)
        let levelWidth = width;
        let levelHeight = height;
        for (let depth = max_depth; depth >= 0; depth--) {
            let level = new Level({
                pyramid: this,
                width: levelWidth,
                height: levelHeight,
                tileSize,
                depth,
                urlTemplate
            });

            this.levels.unshift(level);
            levelWidth = Math.round(levelWidth / 2);
            levelHeight = Math.round(levelHeight / 2);
        }
    }

    get imageData() {
        return this.context.getImageData(0, 0, this.width, this.height);
    }

    get pixelData() {
        return this.imageData.data;
    }

    reset() {
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.pyramidShow = true;
        this.levels.forEach((v) => v.isLoaded = false);
    }

    loadTilesForViewport(viewport) {
        let displayedWidth = this.width * viewport.scale;
        let displayedHeight = this.height * viewport.scale;

        // find the first level with width and height greater
        // than the displayed resolution
        let level = this.levels.find(level => {
            return level.width >= displayedWidth &&
                level.height >= displayedHeight;
        });

        if (level === undefined)
            level = this.levels[this.levels.length - 1];

        // if (level.depth <= this.maxLoadedLevel) return;

        this.maxLoadedLevel = level.depth;
        level.load();
    }
}
