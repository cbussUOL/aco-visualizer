var cy = cytoscape({
    // very commonly used options
    container: document.getElementById('cy'),
    style: [
        {
            selector: 'node' ,
            style: {
                shape: 'hexagon',
                label: 'data(id)'
            }
        }

    ],
});