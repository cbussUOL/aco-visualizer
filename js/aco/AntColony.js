//Manages Colony of Ant Objects and passes results
class AntColony {
    constructor() {
        this.evaporation = document.getElementById('evapSlider').value / 100;
        this.Q = document.getElementById('q').value;
        this.alpha = document.getElementById('alpha').value;
        this.beta = document.getElementById('beta').value;
        this.targetPopSize = document.getElementById('population').value;
        this.curIteration = 0;
        this.maxIterations = 10;
        this.bestSolution = null;
        this.bestSolutionLength = null;
        this.population = [];
        this.randomFactor = 0.01;
        this.timesResultChanged = 0;
        this.autoInterval = null;
    }

    generateRandomSolution() {
        let route = cy.collection();
        route.push(cy.nodes()[Math.floor(Math.random() * cy.nodes().length)])
        while (!route.same(cy.nodes())) {
            let edges = route[route.length - 1].connectedEdges();
            let targets = edges.connectedNodes();
            let chosenNode = targets[Math.floor(Math.random() * targets.length)];
            if (!route.includes(chosenNode)) {
                route.push(chosenNode);
            }
        }
        route.push(route.first());
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
        this.population = []
        for (let i = 0; i < this.targetPopSize; i++) {
            this.population.push(new Ant());
        }
    }

    //Updates the best solution
    updateBest() {
        //Generates random solution if no best Solution set
        if (this.bestSolution === null) {
            this.bestSolution = this.generateRandomSolution();
            this.bestSolutionLength = calcRouteLength(this.bestSolution);
            document.getElementById('curBest').innerHTML = routeToString(this.bestSolution) + ' (Initial Random Result)';
            document.getElementById('curBestLength').innerHTML = this.bestSolutionLength + ' (Initial Random Result)';
            document.getElementById('resultChangedCount').innerHTML = '0';
        } else {
            for (const a of this.population) {
                //Condition for new best is either a shorter route or change of nodes in graph
                if (calcRouteLength(a.route) < this.bestSolutionLength || a.route.length !== this.bestSolution.length) {
                    this.bestSolution.first().removeClass('startNode');
                    this.bestSolution = a.route.slice();
                    this.bestSolutionLength = calcRouteLength(a.route);
                    this.timesResultChanged++;
                    document.getElementById('curBest').innerHTML = routeToString(this.bestSolution);
                    document.getElementById('curBestLength').innerHTML = this.bestSolutionLength;
                    document.getElementById('resultChangedCount').innerHTML = this.timesResultChanged;
                    appendRouteTable(this.bestSolution, this.bestSolutionLength, this.curIteration);
                    this.bestSolution.first().addClass('startNode');
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
        pheromones.fill(0);
        console.log(pheromones);
        console.log(contribution);
        for (let i = 0; i < edges.length; i++) {
            pheromones[i] = edges[i].data('pheromoneCount');
        }
        //console.log(pheromones);
        //Evaporation
        cy.batch(function () {
            for (let i = 0; i < edges.length; i++) {
                edges[i].data('pheromoneCount', edges[i].data('pheromoneCount') * (1 - this.evaporation));
            }
        }.bind(this));
        //console.log(pheromones);
        for (let i = 0; i < this.population.length; i++) {
            let a = this.population[i];
            //console.log(a.routeEdges);
            //console.log(a.visited);
            let antContribution = this.Q / calcRouteLength(a.routeEdges.connectedNodes())
            cy.batch(function () {
                for (let j = 0; j < a.routeEdges.length; j++) {
                    let element = a.routeEdges[j];
                    //console.log(element);
                    //console.log(element.data('pheromoneCount'));
                    element.data('pheromoneCount', Math.max(element.data('pheromoneCount') + antContribution), 1);
                    //contribution[j] += antContribution;

                }
            }.bind(this));
            //console.log(contribution);
        }
        console.log("New Pheromones:")
        console.log(pheromones)
        console.log(contribution)
        /*        for (let i = 0; i < edges.length; i++) {
                    edges[i].data('pheromoneCount', pheromones[i] + contribution[i]);
                }*/
    }


    //Compound function that sets up ACO structure
    initializeACO() {
        console.log("Initializing population...");
        this.initPopulation();
        console.log("Updating best solution...");
        this.updateBest();
        resetPheromoneTrails();
        //Event that updates route length on change of graph
        cy.on('position', function (event) {
            //console.log('Node moved');
            antColony.bestSolutionLength = calcRouteLength(antColony.bestSolution);
            document.getElementById("curBestLength").innerHTML = antColony.bestSolutionLength;
        });

    }

    doIteration() {
        document.getElementById('curIteration').innerHTML = this.curIteration;
        this.initPopulation();
        this.moveAnts();
        this.updatePheromones();
        this.updateBest()
        console.log("Starting Algorithm...")
        console.log("Best tour length: " + this.bestSolutionLength);
        console.log("Best Solution: " + routeToString(this.bestSolution));
        this.curIteration++;
    }

    //Method that generates a solution for every Ant of the population
    moveAnts() {
        for (const a of this.population) {
            while (a.routeEdges.connectedNodes().length < cy.nodes().length) {
                console.log("Current Node of Ant:");
                console.log(a.currentNode);
                a.visitEdge(a.chooseNextEdge());
            }
            //Add return back to initial node to complete round trip
            let edgeBackToStart = a.route.last().edgesWith(a.route.first())
            //console.log(edgeBackToStart);
            a.visitEdge(edgeBackToStart);
            console.log('Calculated Route:')
            console.log(a.routeEdges);
            console.log('Route Length: ' + calcRouteLength(a.routeEdges.connectedNodes()))
        }
    }

    //Enables and disables automatic Iteration interval
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
    document.getElementById('autoIterationBox').checked = false;
    clearInterval(antColony.autoInterval);
    antColony = new AntColony();
    antColony.initializeACO();
    document.getElementById('curIteration').innerText = "0";
    resetTable();
}

function appendRouteTable(route, routeLength, iteration) {
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
    let newText3 = document.createTextNode(routeLength);
    newCell3.appendChild(newText3);
}

function resetTable() {
    let table = document.getElementById('table');
    let tbody = table.getElementsByTagName('tbody')[0];
    let newTBody = document.createElement('tbody');
    table.replaceChild(newTBody, tbody);
}

function updateEvap(value) {
    antColony.evaporation = value / 100;
    document.getElementById('evapLabel').innerHTML = value + '%';
}

let antColony = null;
document.addEventListener('DOMContentLoaded', function () {
    antColony = new AntColony();
    antColony.initializeACO();
})
