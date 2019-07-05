import cornerstoneTools from 'cornerstone-tools';

class Tool {
    constructor(element, toolbar, synchronizer) {
        this.element = element;
        element.tool = this;
        this.name = element.dataset.tool;
        this.synchronizer = synchronizer;
        this.isSynchronize = (element.dataset.synchronize !== undefined && element.dataset.synchronize === "true");
        element.addEventListener('click', _ => {
            toolbar.activate(this);
        });
    }

    activate() {
        this.element.classList.add('active');
        cornerstoneTools.setToolActive(this.name, {
            mouseButtonMask: 1
        });
        // if(this.isSynchronize) this.synchronizer.enabled = true;
    }

    deactivate() {
        this.element.classList.remove('active');
        // this.synchronizer.enabled = false;
        if (this.name != 'Marker') {
            cornerstoneTools.setToolDisabled(this.name);
        }else {
            cornerstoneTools.setToolPassive(this.name);
        }
    }
}

export default class Toolbar {
    constructor(synchronizer) {
        window.viewerToolbar = this;
        this.tools = [];

        for (let element of document.querySelectorAll('#toolbar .tool.option')) {
            let tool = new Tool(element, this, synchronizer);
            this.tools.push(tool);
        }

        this.activate(this.tools[0]);
    }

    activate(tool) {
        if (tool == this.currentTool)
            return;

        if (this.currentTool) {
            this.currentTool.deactivate();
        }
        this.currentTool = tool;
        this.currentTool.activate();
    }
}
