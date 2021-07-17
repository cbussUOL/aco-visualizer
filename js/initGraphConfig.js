var cy = cytoscape({
    // very commonly used options
    container: document.getElementById('cy'),
    style: [
        {
            selector: 'node' ,
            style: {
                shape: 'hexagon',
                label: 'data(antCount)'
            }
        },
        {
            selector: 'edge' ,
            style: {
                'label' : 'data(pheromoneCount)',
                'line-color': 'mapData(pheromoneCount, 0, 100, #CEF1DE, #226D41)'
            }
        }

    ],
    // initial viewport state:
    zoom: 1,
    pan: { x: 0, y: 0 },

    // interaction options:
    minZoom: 1,
    maxZoom: 4,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    panningEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: true,
    selectionType: 'single',
    touchTapThreshold: 8,
    desktopTapThreshold: 4,
    autolock: false,
    autoungrabify: false,
    autounselectify: false,

    // rendering options:
    headless: false,
    styleEnabled: true,
    hideEdgesOnViewport: false,
    textureOnViewport: false,
    motionBlur: false,
    motionBlurOpacity: 0.2,
    pixelRatio: 'auto'
});