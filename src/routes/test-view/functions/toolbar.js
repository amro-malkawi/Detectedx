import cornerstoneTools from 'cornerstone-tools';

class Tool {
    constructor(element, toolbar) {
        this.element = element;
        element.tool = this;
        this.name = element.dataset.tool;

        element.addEventListener('click', _ => {
            toolbar.activate(this);
        });
    }

    activate() {
        this.element.classList.add('active');
        cornerstoneTools.setToolActive(this.name, {
            mouseButtonMask: 1
        });
    }

    deactivate() {
        this.element.classList.remove('active');

        if (this.name != 'Marker') {
            cornerstoneTools.setToolDisabled(this.name);
        }else {
            cornerstoneTools.setToolPassive(this.name);
        }
    }
}

export default class Toolbar {
    constructor() {
        window.viewerToolbar = this;
        this.tools = [];

        for (let element of document.querySelectorAll('#toolbar .tool')) {
            let tool = new Tool(element, this);
            this.tools.push(tool);
        }

        this.activate(this.tools[0]);
    }

    activate(tool) {
        if (tool == this.currentTool)
            return;

        if (this.currentTool)
            this.currentTool.deactivate();

        this.currentTool = tool;
        this.currentTool.activate();
    }
}
