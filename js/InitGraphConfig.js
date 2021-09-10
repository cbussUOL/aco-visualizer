var cy = cytoscape({
    // very commonly used options
    container: document.getElementById('cy'),
    style: [
        {
            selector: 'node' ,
            style: {
                shape: 'hexagon',
                label: 'data(id)',
                color: 'white'
            }
        },
        {
            selector: 'edge' ,
            style: {
                'label' : function ( ele){
                    return Math.floor(ele.data('pheromoneCount'));
                },
                'line-color': 'mapData(pheromoneCount, 1, 50,  #ffcc66, #ff0000)',
                'opacity': 'mapData(pheromoneCount, 1, 50, 0.03, 1)',
                color: "white"
            }
        },
        {
            selector: '.startNode' ,
            style: {
                'background-color' : 'GREEN'
            }
        },
        {
            selector: '.endNode' ,
            style: {
                'background-color' : 'RED'
            }
        }

    ],
    // initial viewport state:
    zoom: 4,
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