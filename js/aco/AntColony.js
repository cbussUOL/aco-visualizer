//Manages Colony of Ant Objects and passes results
class AntColony {
    constructor() {
        this.evaporation = 0.5;
        this.Q = 500;
        this.alpha = 1;
        this.beta = 5;
        this.targetPopSize = 10;
        this.curPopSize = 0;
        this.curIteration = 0;
        this.maxIterations = 10;
        this.bestSolution = null;
        this.bestSolutionLength = null;
        this.population = [];
        this.paused = false;
        this.randomFactor = 0.01;
        this.timesResultChanged = 0;
        this.autoInterval = null;
    }

    generateRandomSolution() {
        let route = cy.collection();
        route.push(startNode);
        while (!route.same(cy.nodes())) {
            let edges = route[route.length - 1].connectedEdges();
            let targets = edges.connectedNodes();
            let chosenNode = targets[Math.floor(Math.random() * targets.length)];
            if (!route.includes(chosenNode)) {
                route.push(chosenNode);
            }
        }
        return route;
    }

    /*    generateRandomSolution() {
            let route = cy.collection();
            let currentNode = startNode;
            let routeNodes = [startNode];
            while (!route.connectedNodes().includes(endNode)) {
                let edges = currentNode.connectedEdges();
                let chosenEdge = edges[Math.floor(Math.random() * edges.length)];
                if (!route.includes(chosenEdge)) {
                    route.push(chosenEdge);
                    for (const n of chosenEdge.connectedNodes()){
                        if (n !== currentNode) {
                            routeNodes.push(n);
                            currentNode = n;
                            break;
                        }
                    }
                }
            }
            return routeNodes;
        }*/

    //Initializes Population from Scratch
    initPopulation() {
        //TODO add support for flexible pop sizes
        for (let i = 0; i < this.targetPopSize - this.curPopSize; i++) {
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
            document.getElementById('resultChangedCount').innerHTML = '0';
            //this.bestSolution = this.population[0].route;
            //this.bestSolutionLength = this.population[0].calcRouteLength();
        } else {
            for (const a of this.population) {
                console.log(a.route);
                console.log(this.bestSolution)
                console.log(a.route.length)
                console.log(this.bestSolution.length)
                console.log(a.route === this.bestSolution);
                if (calcRouteLength(a.route) < this.bestSolutionLength || a.route.length > this.bestSolution.length) {
                    this.bestSolution = a.route.slice();
                    this.bestSolutionLength = calcRouteLength(a.route);
                    this.timesResultChanged++;
                    document.getElementById('curBest').innerHTML = routeToString(this.bestSolution);
                    document.getElementById('curBestLength').innerHTML = this.bestSolutionLength;
                    document.getElementById('resultChangedCount').innerHTML = this.timesResultChanged;
                    appendRouteTable(this.bestSolution, this.bestSolutionLength, this.curIteration);
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
        for (let i = 0; i < edges.length; i++) {
            pheromones[i] = edges[i].data('pheromoneCount');
        }
        //console.log(pheromones);
        //Beta evaporation
               for (let i = 0; i < edges.length; i++) {
                    pheromones[i] *= this.evaporation;
                }
        //console.log(pheromones);
        for (let i = 0; i < this.population.length; i++) {
            let a = this.population[i];
            console.log(a.routeEdges);
            console.log(a.visited);
            let antContribution = this.Q / calcRouteLength(a.routeEdges.connectedNodes())
            for (let j = 0; j < edges.length; j++) {
                let element = a.routeEdges[j];
                if (a.routeEdges.includes(element)) {
                    contribution[j] += antContribution;
                }
            }
            //console.log(contribution);
        }
        console.log(pheromones)
        console.log(contribution)
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
        cy.on('dragfreeon', function (event) {
            console.log('moved')
            antColony.bestSolutionLength = calcRouteLength(antColony.bestSolution);
            document.getElementById("curBestLength").innerHTML = antColony.bestSolutionLength;
        });

    }

    doIteration() {
        document.getElementById('curIteration').innerHTML = this.curIteration;
        this.moveAnts();
        this.updatePheromones();
        this.updateBest()
        console.log("Starting Algorithm...")
        console.log("Best tour length: " + this.bestSolutionLength);
        console.log("Best Solution: " + routeToString(this.bestSolution));
        this.curIteration++;
    }


    moveAnts() {
        for (const a of this.population) {
            while (!a.routeEdges.connectedNodes().same(cy.nodes())) {
                console.log(a.currentNode)
                console.log(endNode);
                a.visitEdge(a.chooseNextEdge());
            }
            console.log('Calculated Route:')
            console.log(a.routeEdges);
            console.log(calcRouteLength(a.routeEdges.connectedNodes()))
        }
    }

    toggleAutoIteration() {
        let checkbox = document.getElementById("autoIterationBox");
        if (checkbox.checked) {
            this.autoInterval = setInterval(this.doIteration.bind(antColony), 1500);
        } else {
            clearInterval(this.autoInterval);
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

function resetACO() {
    antColony = new AntColony();
    antColony.initializeACO();
    resetTable();
}

function appendRouteTable (route, routeLength, iteration) {
    let table = document.getElementById('table');
    let tbody = table.getElementsByTagName('tbody')[0];
    let newRow = tbody.insertRow();
    let newCell = newRow.insertCell();
    let newText = document.createTextNode(iteration);
    newCell.appendChild(newText);
    let newCell2 = newRow.insertCell(1);
    let newText2 = document.createTextNode(routeToString(route));
    newCell2.appendChild(newText2);
    let newCell3 = newRow.insertCell(2);
    let newText3= document.createTextNode(routeLength);
    newCell3.appendChild(newText3);
}

function resetTable () {
    let table = document.getElementById('table');
    let tbody = table.getElementsByTagName('tbody')[0];
    let newTBody = document.createElement('tbody');
    table.replaceChild(newTBody, tbody);
}

function updateEvap(value) {
    antColony.evaporation = (100 - value) / 100;
    document.getElementById('evapLabel').innerHTML = value + '%';
}



let antColony = new AntColony();
antColony.initializeACO();