import * as Apis from 'Api';
export default function MyWorker({imageId}) {
    console.log('start worker');
    Apis.imagesUrlTemplate(imageId).then((resp) => {
        const {urlTemplate, stack_count, max_depth, tileSize, width, height} = resp;
        console.log(stack_count, max_depth)
        for(let i = 0; i < stack_count; i++) {
        // let i = 1;
        let levelWidth = width;
        let levelHeight = height;
            for(let j = max_depth; j >= 0; j--) {
                const cols = Math.ceil(levelWidth / tileSize);
                const rows = Math.ceil(levelHeight / tileSize);
                console.log(levelWidth, levelHeight, cols, rows)
                for (let k = 0; k < cols; k++) {
                    for (let l = 0; l < rows; l++) {
                        const url = urlTemplate.replace('[stack]', i).replace('[depth]', j).replace('[col]', k).replace('[row]', l);
                        // const img = new Image();
                        // img.crossOrigin="anonymous";
                        // img.src = url;
                    }
                }

                levelWidth = Math.round(levelWidth / 2);
                levelHeight = Math.round(levelHeight / 2);
            }
        }
    }).catch((e) => {

    });

    let onmessage = e => { // eslint-disable-line no-unused-vars
        console.warn('worker message');


        postMessage("finished");
    };
}