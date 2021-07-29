//Manages Colony of Ant Objects and passes results
class AntColony {
    constructor(popSize, maxIterations, alpha, beta, evaporation, Q, randomFactor) {
        this.evaporation = evaporation;
        this.Q = Q;
        this.alpha = alpha;
        this.beta = beta;
        this.maxPopSize = popSize;
        this.curPopSize = 0;
        this.maxIterations = maxIterations;
        this.bestSolution = null;
        this.bestSolutionLength = null;
        this.population = [];
        this.paused = false;
        this.randomFactor = randomFactor;
        this.timesResultChanged = 0;
    }

    generateRandomSolution() {
        let route = [];
        route.push(startNode);
        while (!route.includes(endNode)) {
            let edges = route[route.length - 1].connectedEdges();
            let targets = edges.targets();
            const chosenNode = targets[Math.floor(Math.random() * targets.length)];
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
                    }
                }
            }
        }
    }

    //Updates Pheromone Counts after completed iteration
    updatePheromones() {
        let edges = cy.edges();
        //Beta evaporation
        for (let i = 0; i < edges.length; i++) {
            edges[i].data('pheromoneCount', edges[i].data('pheromoneCount') * this.evaporation);
        }

        for (let i = 0; i < this.population.length; i++){
            const a = this.population[i];
            console.log(a.route);
            console.log(a.routeEdges);
            let contribution = this.Q / calcRouteLength(a.route);
            for (let j = 0; j < a.route.length-1; j++) {
                let element = a.route[j].edgesWith(a.route[j+1]);
                console.log(element.data('pheromoneCount'))
                let newContribution = element.data('pheromoneCount') + contribution;
                element.data('pheromoneCount', element.data('pheromoneCount') + newContribution);
            }
        }
    }


    start() {
        for (let i = 0; i <= this.maxIterations; i++) {
            console.log("Iteration #" + i + ':')
            this.solve();
        }
    }

    solve() {
        this.initPopulation();
        this.updateBest();
        resetPheromoneTrails();
        for (let i = 0; i < this.maxIterations; i++) {
            this.moveAnts();
            this.updatePheromones();
            this.updateBest();
        }
        console.log("Best tour length: " + this.bestSolutionLength);
        console.log("Best Solution: " + this.bestSolution);
    }


    moveAnts() {
        for (const a of this.population) {
            while (a.currentNode !== endNode) {
                console.log('entered node chooser')
                a.visitEdge(a.chooseNextEdge());
            }
            console.log('Calculated Route:')
            console.log(a.routeEdges);
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

let antColony = new AntColony(2, 2, 5, 0.5, 500, 500, 0.01);
//antColony.generateRandomSolution();
antColony.start();