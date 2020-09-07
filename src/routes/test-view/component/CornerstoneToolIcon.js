import React from 'react'

export default function ({name}) {
    if (name === 'Pan') {
        return (
            <svg id="icon-tools-pan" viewBox="0 0 18 18">
                <title>Pan</title>
                <g id="icon-tools-pan-group" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path id="icon-tools-pan-line-v" d="M9,1 L9,17"/>
                    <path id="icon-tools-pan-line-h" d="M1,9 L17,9"/>
                    <polyline id="icon-tools-pan-caret-t" points="7 3 9 1 11 3"/>
                    <polyline id="icon-tools-pan-caret-r" points="15 11 17 9 15 7"/>
                    <polyline id="icon-tools-pan-caret-b" points="11 15 9 17 7 15"/>
                    <polyline id="icon-tools-pan-caret-l" points="3 7 1 9 3 11"/>
                </g>
            </svg>
        )
    } else if (name === 'Zoom') {
        return (
            <svg id="icon-tools-zoom" viewBox="0 0 17 17">
                <title>Zoom</title>
                <g id="icon-tools-zoom-group" fill="none" strokeWidth="2" strokeLinecap="round">
                    <path id="icon-tools-zoom-path" d="m11.5,11.5 4.5,4.5"/>
                    <circle id="icon-tools-zoom-circle" cx="7" cy="7" r="6"/>
                </g>
            </svg>
        )
    } else if (name === 'Wwwc') {
        return (
            <svg id="icon-tools-levels" viewBox="0 0 18 18">
                <title>Window</title>
                <g id="icon-tools-levels-group">
                    <path id="icon-tools-levels-path" d="M14.5,3.5 a1 1 0 0 1 -11,11 Z" stroke="none" opacity="0.8"/>
                    <circle id="icon-tools-levels-circle" cx="9" cy="9" r="8" fill="none" strokeWidth="2"/>
                </g>
            </svg>
        )
    } else if (name === 'Length') {
        return (
            <svg name="measure-temp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" fill="none">
                <title>Length</title>
                <g strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="6.5" cy="6.5" r="6" fill="transparent"/>
                    <path d="M6.5 3v7M3 6.5h7"/>
                    <path d="M22.5 6L6 22.5" strokeWidth="3" strokeDasharray="0.6666,5"/>
                </g>
            </svg>
        )
    } else if (name === 'Angle') {
        return (
            <svg name="angle-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" width="1em" height="1em" fill="currentColor">
                <title>Angle</title>
                <path
                    d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"/>
            </svg>
        )
    } else if (name === 'EllipticalRoi') {
        return (
            <svg name="circle-o" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
                <title>Circle</title>
                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"/>
            </svg>
        )
    } else if (name === 'RectangleRoi') {
        return (
            <svg name="square-o" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
                <title>Rectangle</title>
                <path
                    d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"/>
            </svg>
        )
    } else if (name === 'ArrowAnnotate') {
        return (
            <svg name="measure-non-target" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" fill="none" strokeLinecap="round"
                 strokeLinejoin="round">
                <title>Arrow annotate</title>
                <circle cx="6.5" cy="6.5" r="6" fill="transparent"/>
                <path d="M6.5 3v7M3 6.5h7"/>
                <path d="M23 7L8 22m-1-5v6h6" strokeWidth="2"/>
            </svg>
        )
    } else if (name === 'MarkerFreehand') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <title>MarkerFreehand</title>
                <path
                    d="M4.59 6.89c.7-.71 1.4-1.35 1.71-1.22.5.2 0 1.03-.3 1.52-.25.42-2.86 3.89-2.86 6.31 0 1.28.48 2.34 1.34 2.98.75.56 1.74.73 2.64.46 1.07-.31 1.95-1.4 3.06-2.77 1.21-1.49 2.83-3.44 4.08-3.44 1.63 0 1.65 1.01 1.76 1.79-3.78.64-5.38 3.67-5.38 5.37 0 1.7 1.44 3.09 3.21 3.09 1.63 0 4.29-1.33 4.69-6.1H21v-2.5h-2.47c-.15-1.65-1.09-4.2-4.03-4.2-2.25 0-4.18 1.91-4.94 2.84-.58.73-2.06 2.48-2.29 2.72-.25.3-.68.84-1.11.84-.45 0-.72-.83-.36-1.92.35-1.09 1.4-2.86 1.85-3.52.78-1.14 1.3-1.92 1.3-3.28C8.95 3.69 7.31 3 6.44 3 5.12 3 3.97 4 3.72 4.25c-.36.36-.66.66-.88.93l1.75 1.71zm9.29 11.66c-.31 0-.74-.26-.74-.72 0-.6.73-2.2 2.87-2.76-.3 2.69-1.43 3.48-2.13 3.48z"/>
            </svg>
        )
    } else if (name === 'Eraser') {
        return (
            <svg name="eraser" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 1792" width="1em" height="1em" fill="currentColor">
                <title>Eraser</title>
                <path fill="ACTIVE_COLOR"
                      d="M960 384l336 384H528L192 384h768zm1013 1077q15-34 9.5-71.5T1952 1324L1056 300q-38-44-96-44H192q-38 0-69.5 20.5T75 331q-15 34-9.5 71.5T96 468l896 1024q38 44 96 44h768q38 0 69.5-20.5t47.5-54.5z"/>
            </svg>
        )
    } else if (name === 'Marker') {
        return (
            <svg id="icon-tools-elliptical-roi" viewBox="0 0 24 28">
                <title>Marker</title>
                <path
                    d="M12 5.5c-4.688 0-8.5 3.813-8.5 8.5s3.813 8.5 8.5 8.5 8.5-3.813 8.5-8.5-3.813-8.5-8.5-8.5zM24 14c0 6.625-5.375 12-12 12s-12-5.375-12-12 5.375-12 12-12v0c6.625 0 12 5.375 12 12z"/>
            </svg>
        )
    } else if (name === 'Reset') {
        return (
            <svg name="reset" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 28" width="1em" height="1em" fill="currentColor">
                <path
                    d="M24 14c0 6.609-5.391 12-12 12a11.972 11.972 0 0 1-9.234-4.328.52.52 0 0 1 .031-.672l2.141-2.156a.599.599 0 0 1 .391-.141.51.51 0 0 1 .359.187A7.91 7.91 0 0 0 12 21.999c4.406 0 8-3.594 8-8s-3.594-8-8-8A7.952 7.952 0 0 0 6.563 8.14l2.141 2.156a.964.964 0 0 1 .219 1.078 1.002 1.002 0 0 1-.922.625h-7c-.547 0-1-.453-1-1v-7c0-.406.25-.766.625-.922a.964.964 0 0 1 1.078.219l2.031 2.016c2.203-2.078 5.187-3.313 8.266-3.313 6.609 0 12 5.391 12 12z"/>
            </svg>
        )
    } else if (name === 'More') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
                <title>Ellipse Circle</title>
                <path stroke="null"
                      d="m10.5,2.0625a8.4375,8.4375 0 0 1 0,16.87501a8.4375,8.4375 0 0 1 0,-16.87501m-4.21875,7.5a1.40625,1.40625 0 0 0 0,2.8125a1.40625,1.40625 0 0 0 0,-2.8125m4.21875,0a1.40625,1.40625 0 0 0 0,2.8125a1.40625,1.40625 0 0 0 0,-2.8125m4.21875,0a1.40625,1.40625 0 0 0 0,2.8125a1.40625,1.40625 0 0 0 0,-2.8125"/>
            </svg>
        )
    } else if (name === 'Grid') {
        return (
            <svg name="th" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
                <title>Grid</title>
                <path d="M149.333 56v80c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24h101.333c13.255 0 24 10.745 24 24zm181.334 240v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm32-240v80c0 13.255 10.745 24 24 24H488c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24zm-32 80V56c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm-205.334 56H24c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24zM0 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm386.667-56H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zm0 160H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zM181.333 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24z"/>
            </svg>
        )
    } else if (name === 'Magnify') {
        return (
            <svg name="circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
                <title>Magnify</title>
                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"/>
            </svg>
        )
    } else {
        return null;
    }
};