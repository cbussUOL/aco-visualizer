//Manages Colony of Ant Objects and passes results
class AntColony {
    constructor() {
        this.evaporation = 0.5;
        this.Q = 500;
        this.alpha = 1;
        this.beta = 5;
        this.maxPopSize = 10;
        this.curPopSize = 0;
        this.curIteration = 0;
        this.maxIterations = 10;
        this.bestSolution = null;
        this.bestSolutionLength = null;
        this.population = [];
        this.paused = false;
        this.randomFactor = 0.01;
        this.timesResultChanged = 0;
    }

    generateRandomSolution() {
        let route = cy.collection();
        route.push(startNode);
        console.log(route);
        //console.log(endNode);
        while (!route.includes(endNode)) {
            let edges = route[route.length-1].connectedEdges();
            let targets = edges.connectedNodes();
            let chosenNode = targets[Math.floor(Math.random() * targets.length)];
            if (!route.includes(chosenNode)) {
                route.push(chosenNode);
            }
        }
        return route;
    }

    //Initializes Population from Scratch
    initPopulation() {
        //TODO add support for flexible pop sizes
        for (let i = 0; i < this.maxPopSize - this.curPopSize; i++) {
            this.population.push(new Ant());
        }
    }

    //Updates the best solution
    updateBest() {
        if (this.bestSolution === null) {
            this.bestSolution = this.generateRandomSolution();
            this.bestSolutionLength = calcRouteLength(this.bestSolution);
            document.getElementById('curBest').innerHTML = routeToString(this.bestSolution) + ' (Initial Random Result)';
            document.getElementById('curBestLength').innerHTML = this.bestSolutionLength + ' (Initial Random Result)';
            //this.bestSolution = this.population[0].route;
            //this.bestSolutionLength = this.population[0].calcRouteLength();
        }else {
            for (const a of this.population) {
                if (a.route[a.route.length - 1] === endNode) {
                    console.log(a.route);
                    if (calcRouteLength(a.route) < this.bestSolutionLength) {
                        this.bestSolution = a.route;
                        this.bestSolutionLength = calcRouteLength(a.route);
                        this.timesResultChanged++;
                        document.getElementById('curBest').innerHTML = routeToString(this.bestSolution);
                        document.getElementById('curBestLength').innerHTML = this.bestSolutionLength;
                        document.getElementById('resultChangedCount').innerHTML = this.timesResultChanged;
                    }
                }
            }
        }
    }

    //Updates Pheromone Counts after completed iteration
    updatePheromones() {
        let edges = cy.edges();
        let pheromones = new Array(edges.length);
        let contribution = new Array(edges.length);
        contribution.fill(0);
        for (let i = 0; i < edges.length; i++ ){
            pheromones[i] = edges[i].data('pheromoneCount');
        }
        console.log(pheromones);
        //Beta evaporation
        for (let i = 0; i < edges.length; i++) {
            pheromones[i] *= this.evaporation;
        }
        console.log(pheromones);
        for (let i = 0; i < this.population.length; i++){
            let a = this.population[i];
            console.log(a.routeEdges);
            console.log(a.visited);
            for (let j = 0; j < edges.length; j++) {
                let element = a.routeEdges[j];
                if (a.routeEdges.contains(element)){
                   contribution[j] += this.Q / calcRouteLength(a.routeEdges.connectedNodes())
                }
            }
            console.log(contribution);
        }
        for (let i = 0; i < edges.length; i++) {
            edges[i].data('pheromoneCount', pheromones[i] + contribution[i]);
        }
    }


    start() {
            console.log('Starting Algorithm...');
            this.initializeACO();
    }

    initializeACO() {
        console.log("Initializing population...");
        this.initPopulation();
        console.log("Updating best solution...");
        this.updateBest();
        resetPheromoneTrails();

    }

    doIteration() {
        document.getElementById('curIteration').innerHTML = this.curIteration;
        this.moveAnts();
        this.updatePheromones();
        this.updateBest()
        console.log("Starting Algorithm...")
        console.log("Best tour length: " + this.bestSolutionLength);
        console.log("Best Solution: " + this.bestSolution);
        this.curIteration++;
    }


    moveAnts() {
        for (const a of this.population) {
            while (!a.routeEdges.connectedNodes().includes(endNode)) {
                console.log('entered node chooser')
                console.log(a.currentNode)
                console.log(endNode);
                a.visitEdge(a.chooseNextEdge());
            }
            console.log('Calculated Route:')
            console.log(a.routeEdges);
            console.log(calcRouteLength(a.routeEdges.connectedNodes()))
        }
    }
}

function calcDistanceBetweenPoints(point1, point2) {
    let a = point1.position('x') - point2.position('x')
    let b = point1.position('y') - point2.position('y')
    return Math.sqrt(a * a + b * b);
}


function resetPheromoneTrails() {
    let edges = cy.edges();
    console.log(edges.length);
    for (let i = 0; i < edges.length; i++) {
        edges[i].data('pheromoneCount', 1)
    }
}

function calcRouteLength(route) {
    let routeLength = 0;
    for (let i = 0; i < route.length - 1; i++) {
        routeLength += calcDistanceBetweenPoints(route[i], route[i + 1])
    }
    return routeLength;
}

let antColony = new AntColony();