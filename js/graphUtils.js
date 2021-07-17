let randomConfig = {
    name: 'random',

    fit: true, // whether to fit to viewport
    padding: 50, // fit padding
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    animate: true, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
    transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
};


function randomizeGraph() {
    cy.layout(options).run();
}

function fitGraphToScreen() {
    cy.fit(50);
}