class Ant {

    constructor() {
        this.currentNode = cy.nodes()[Math.floor(Math.random() * cy.nodes().length)]
        this.route = cy.collection();
        this.route.push(this.currentNode);
        this.routeEdges = cy.collection();
        this.visited = cy.collection();
    }

    //Add Edge to current route
    visitEdge(edge) {
        let connectedNodes = edge.connectedNodes();
        for (let i = 0; i < connectedNodes.length; i++) {
            //console.log('Is node equal to current?')
            //console.log(this.currentNode);
            //console.log(connectedNodes[i]);
            //console.log(this.currentNode === connectedNodes[i])
            if (this.currentNode !== connectedNodes[i]) {
                //console.log(this.currentNode);
                this.routeEdges.push(edge);
                this.currentNode = connectedNodes[i];
                this.route.push(connectedNodes[i]);
                //console.log(this.currentNode);
                break;
            }
        }
        this.visited.push(edge.connectedNodes())
        //console.log(this.visited);
        //console.log(this.routeEdges);
        //console.log(this.route);
    }

    //Method to pick next Edge based on weighted randomness
    chooseNextEdge() {
        let edges = this.currentNode.connectedEdges();
        //Rolls if Random nodes should be chosen
        /*        if (Math.random() < antColony.randomFactor) {
                    return targets[0]
                }*/
        let probabilities = this.calcProbabilities();
        //console.log(probabilities)
        let r = Math.random();
        let total = 0;
        for (let i = 0; i < edges.length; i++) {
            total += probabilities[i];
            //console.log('Total vs R')
            //console.log(total)
            //console.log(r)
            if (total >= r) {
                return edges[i];
            }
        }
        throw "We ant found shit"

    }

    //Calculates the probabilities of a certain edge being chosen
    //This is based on pheromones and distance
    //The two factors are weighted by alpha and beta respectively
    calcProbabilities() {
        console.log("Calculating probabilities...")
        let edges = this.currentNode.connectedEdges();
        //console.log(edges);
        let probabilities = [edges.length];
        let pheromone = 0.0;
        for (let i = 0; i < edges.length; i++) {
            if (!edges[i].connectedNodes().every(c => this.route.includes(c))) {
                pheromone +=
                    Math.pow(edges[i].data('pheromoneCount'), antColony.alpha) * Math.pow(1.0 / calcDistanceBetweenPoints(edges[i].connectedNodes()[0], edges[i].connectedNodes()[1]), antColony.beta);
            }
        }
        for (let j = 0; j < edges.length; j++) {
            //Check if current Route already contains Edge
            if (edges[j].connectedNodes().every(c => this.route.includes(c))) {
                probabilities[j] = 0.0;
            } else {
                let numerator =
                    Math.pow(edges[j].data('pheromoneCount'), antColony.alpha) * Math.pow(1.0 / calcDistanceBetweenPoints(edges[j].connectedNodes()[0], edges[j].connectedNodes()[1]), antColony.beta);
                probabilities[j] = numerator / pheromone;
            }
        }
        console.log('Probabilities: ' + probabilities);
        return probabilities;
    }


}