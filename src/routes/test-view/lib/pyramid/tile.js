import cornerstoneTools from 'cornerstone-tools';
import cornerstone from 'cornerstone-core';
import * as Apis from "Api";

export default class Tile {
    constructor(options) {
        let { level, col, row, x, y, width, height, urlTemplate } = options;

        // store (drawn- scaled) image dimensions and position
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;

        // cache the pyramid
        this.pyramid  = level.pyramid;

        // an Image object is used to load the tile image
        this.image    = new Image();
        this.image.crossOrigin="anonymous";
        this.isLoaded = false;
        this.image.onload = _ => this._loaded();

        // construct the url for this tile
        this.url = Apis.apiAddress + urlTemplate.replace('[depth]', level.depth)
                              .replace('[col]', col)
                              .replace('[row]', row);
    }

    _loaded() {
        this.isLoaded = true;
        this.draw();
    }

    load() {
        this.image.src = this.url;
    }

    draw() {
        if (!this.isLoaded)
            return;

        this.pyramid.context.drawImage(
            this.image,
            this.x, this.y,
            this.width, this.height
        );

        cornerstone.invalidateImageId(this.pyramid.imageId);
    }
}
