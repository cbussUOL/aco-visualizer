// Example Test Graph
/*var eles = cy.add([
    {group: 'nodes', data: {id: 'n0', antCount: '10'}},
    {group: 'nodes', data: {id: 'n1', antCount: '20'}},
    {group: 'nodes', data: {id: 'n2', antCount: '30'}},
    {group: 'nodes', data: {id: 'n3', antCount: '40'}},
    {group: 'nodes', data: {id: 'n4', antCount: '50'}},
    {group: 'nodes', data: {id: 'n5', antCount: '60'}},
    {group: 'nodes', data: {id: 'n6', antCount: '70'}},
    {group: 'edges', data: {id: 'e0', source: 'n0', target: 'n1', pheromoneCount: 0}},
    {group: 'edges', data: {id: 'e1', source: 'n0', target: 'n2', pheromoneCount: 10}},
    {group: 'edges', data: {id: 'e2', source: 'n0', target: 'n3', pheromoneCount: 20}},
    {group: 'edges', data: {id: 'e3', source: 'n1', target: 'n4', pheromoneCount: 30}},
    {group: 'edges', data: {id: 'e5', source: 'n2', target: 'n4', pheromoneCount: 50}},
    {group: 'edges', data: {id: 'e6', source: 'n2', target: 'n5', pheromoneCount: 60}},
    {group: 'edges', data: {id: 'e7', source: 'n3', target: 'n5', pheromoneCount: 70}},
    {group: 'edges', data: {id: 'e8', source: 'n4', target: 'n6', pheromoneCount: 80}},
    {group: 'edges', data: {id: 'e9', source: 'n5', target: 'n6', pheromoneCount: 90}}

]);*/



let networkSize = 4;
for (let i = 0; i < networkSize; i++){
    addACONode();
}


let options = {
    name: 'cose',

    // Called on `layoutready`
    ready: function () {
    },

    // Called on `layoutstop`
    stop: function () {
    },

    // Whether to animate while running the layout
    // true : Animate continuously as the layout is running
    // false : Just show the end result
    // 'end' : Animate with the end result, from the initial positions to the end positions
    animate: 'end',

    // Easing of the animation for animate:'end'
    animationEasing: undefined,

    // The duration of the animation for animate:'end'
    animationDuration: 500,

    // A function that determines whether the node should be animated
    // All nodes animated by default on animate enabled
    // Non-animated nodes are positioned immediately when the layout starts
    animateFilter: function (node, i) {
        return true;
    },


    // The layout animates only after this many milliseconds for animate:true
    // (prevents flashing on fast runs)
    animationThreshold: undefined,

    // Number of iterations between consecutive screen positions update
    refresh: 20,

    // Whether to fit the network view after when done
    fit: true,

    // Padding on fit
    padding: 30,

    // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    boundingBox: undefined,

    // Excludes the label when calculating node bounding boxes for the layout algorithm
    nodeDimensionsIncludeLabels: true,

    // Randomize the initial positions of the nodes (true) or use existing positions (false)
    randomize: true,

    // Extra spacing between components in non-compound graphs
    componentSpacing: 400,

    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: function (node) {
        return 2048;
    },

    // Node repulsion (overlapping) multiplier
    nodeOverlap: 4,

    // Ideal edge (non nested) length
    idealEdgeLength: function (edge) {
        return 32;
    },

    // Divisor to compute edge forces
    edgeElasticity: function (edge) {
        return 32;
    },

    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor: 1.2,

    // Gravity force (constant)
    gravity: 1,

    // Maximum number of iterations to perform
    numIter: 1000,

    // Initial temperature (maximum node displacement)
    initialTemp: 1000,

    // Cooling factor (how the temperature is reduced between consecutive iterations
    coolingFactor: 0.99,

    // Lower temperature threshold (below this point the layout will end)
    minTemp: 1.0
};
setAsStartNode(cy.nodes().first());
console.log(startNode);
setAsEndNode(cy.nodes().last());
console.log(endNode);
cy.layout(options);
cy.layout(options).run();
cy.fit();
cy.resize();