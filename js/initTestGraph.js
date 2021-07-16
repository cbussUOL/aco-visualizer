// Example Test Graph
var eles = cy.add([
    { group: 'nodes', data: { id: 'n0' }},
    { group: 'nodes', data: { id: 'n1' }},
    { group: 'nodes', data: { id: 'n2' }},
    { group: 'nodes', data: { id: 'n3' }},
    { group: 'nodes', data: { id: 'n4' }},
    { group: 'nodes', data: { id: 'n5' }},
    { group: 'nodes', data: { id: 'n6' }},
    { group: 'edges', data: { id: 'e0', source: 'n0', target: 'n1' } },
    { group: 'edges', data: { id: 'e1', source: 'n0', target: 'n2' } },
    { group: 'edges', data: { id: 'e2', source: 'n0', target: 'n3' } },
    { group: 'edges', data: { id: 'e3', source: 'n1', target: 'n4' } },
    { group: 'edges', data: { id: 'e4', source: 'n2', target: 'n4' } },
    { group: 'edges', data: { id: 'e5', source: 'n2', target: 'n4' } },
    { group: 'edges', data: { id: 'e6', source: 'n2', target: 'n5' } },
    { group: 'edges', data: { id: 'e7', source: 'n3', target: 'n5' } },
    { group: 'edges', data: { id: 'e8', source: 'n4', target: 'n6' } },
    { group: 'edges', data: { id: 'e9', source: 'n5', target: 'n6' } }

]);

let options = {
    name: 'random',

    fit: true, // whether to fit to viewport
    padding: 30, // fit padding
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
    transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
};

cy.layout(options);