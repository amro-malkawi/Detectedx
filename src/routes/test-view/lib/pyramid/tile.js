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
        this.isLoaded = false;

        // construct the url for this tile
        this.url = urlTemplate.replace('[depth]', level.depth)
            .replace('[col]', col)
            .replace('[row]', row);
        if(urlTemplate.indexOf('http') !== 0) {
            this.url = Apis.apiHost + this.url;
        }
    }

    draw() {
        if (!this.isLoaded || !this.pyramid.pyramidShow)
            return;

        this.pyramid.context.drawImage(
            this.image,
            this.x, this.y,
            this.width, this.height
        );

        cornerstone.invalidateImageId(this.pyramid.imageId);
    }

    loadTileImage() {
        return new Promise(((resolve, reject) => {
            if(this.image === undefined) {
                this.image = new Image();
                this.image.crossOrigin="anonymous";
                this.image.src = this.url;

                this.image.onload = () => {
                    this.isLoaded = true;
                    this.draw();
                    resolve();
                };

            } else {
                this.pyramid.context.clearRect(
                    this.x, this.y,
                    this.width, this.height
                );
                this.draw();
            }
        }))
    }

    loadTileForWorker() {
        return new Promise(((resolve, reject) => {
            if(this.image === undefined) {
                this.image = new Image();
                this.image.crossOrigin="anonymous";
                this.image.src = this.url;
                this.image.onload = () => {
                    this.isLoaded = true;
                    resolve();
                };
                this.image.onerror = function(e) {
                    resolve();
                };
            } else {
                resolve()
            }
        }))
    }
}
