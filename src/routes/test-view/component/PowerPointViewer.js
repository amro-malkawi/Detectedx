import React, {useState, useEffect, useRef} from "react";

function PowerPointViewer({filePath, allowSkip, onEnded}) {
    const contentRef = useRef();

    useEffect(() => {
    }, []);

    const getIframe = () => {
    }

    return (
        <iframe
            ref={contentRef}
            id="pptx-container"
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${filePath}&amp;wdStartOn=1&amp;wdPrint=0&amp;wdEmbedCode=1`}
            frameBorder={0}
            style={{width: '100%', height: '100%'}}
        />
    )
}

export default PowerPointViewer;