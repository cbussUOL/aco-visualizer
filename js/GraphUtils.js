let startNode;
let endNode;
let nodeIndex = 0;

let randomConfig = {
    name: 'random',
    fit: true, // whether to fit to viewport
    padding: 50, // fit padding
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    animate: true, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    animateFilter: function (node, i) {
        return true;
    }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
    transform: function (node, position) {
        return position;
    } // transform a given node position. Useful for changing flow direction in discrete layouts
};


function layoutGraph() {
    cy.layout(options).run();
}

function randomizeGraph() {
    cy.layout(optionsRandom).run();
}

function fitGraphToScreen() {
    cy.fit(50);
}

function setAsStartNode(node) {
    if (node.length === 0) {
        alert('Please Select a Node')
    } else if (node.same(endNode)) {
        alert('You cant set Start and End to the Same Node')
    } else {

        if (typeof startNode !== 'undefined') {
            startNode.removeClass('startNode');
        }
        startNode = node;
        startNode.addClass('startNode');
    }
}

function setAsEndNode(node) {
    if (node.length === 0) {
        alert('Please Select a Node')
    } else if (node.same(startNode)) {
        alert('You cant set Start and End to the Same Node')
    } else {
        if (typeof endNode !== 'undefined') {
            endNode.removeClass('endNode');
        }
        endNode = node;
        endNode.addClass('endNode');
    }
}

function addACONode() {
    let extent = cy.extent();
    let nodeX = Math.random() * (extent['x2'] - extent['x1']) + extent['x1'];
    let nodeY = Math.random() * (extent['y2'] - extent['y1']) + extent['y1'];
    let node = cy.add({
        group: 'nodes',
        position: {x: nodeX, y: nodeY},
        data: {
            id: 'N' + nodeIndex
        }
    });
    nodeIndex++;
    connectNodeToNetwork(node);
}

function connectNodeToNetwork(node) {
    for (let i = 0; i < cy.nodes().length - 1; i++) {
        if (node !== cy.nodes()[i]) {
            let edge = cy.add({
                group: 'edges',
                data: {source: node.id(), target: cy.nodes()[i].id(), pheromoneCount: 1}
            });
        }
    }
}

function removeACONode() {
    cy.remove(cy.nodes().last())
}

function routeToString(route) {
    let routeString = route.map(function (ele) {
        return " " + ele.id();
    });

    console.log(routeString);
    return routeString;
}