class Ant {

    constructor() {
        this.route = cy.collection();
        this.route.add(startNode);
        this.routeEdges = cy.collection();
        this.currentNode = startNode;
        this.visited = cy.collection();
    }

    visitEdge(edge) {
        this.routeEdges.push(edge);
        let connectedNodes = edge.connectedNodes();
        for (let i = 0; i < connectedNodes.length; i++) {
            if (this.currentNode !== connectedNodes[i]) {
                this.currentNode = connectedNodes[i];
                this.route.push(connectedNodes[i]);
            }
        }
        this.visited.push(edge.connectedNodes())
        console.log(this.visited.contains(connectedNodes[0]));
    }


    chooseNextEdge() {
        let edges  = this.currentNode.connectedEdges();
        let targets  = edges.targets();
        //Rolls if Random nodes should be chosen
/*        if (Math.random() < antColony.randomFactor) {
            return targets[0]
        }*/
        let probabilities = this.calcProbabilities();
        console.log(probabilities)
        let r = Math.random();
        let total = 0;
        for (let i = 0; i < edges.length; i++){
            total += probabilities[i];
            console.log('Total vs R')
            console.log(total)
            console.log(r)
            if (total >= r) {
                return edges[i];
            }
        }
        throw "We aint found shit"

    }
    //Calculates the probabilities of a certain edge being chosen
    //This is based on pheromones and distance
    //The two factors are weighted by alpha and beta respectively
    calcProbabilities() {
        let edges  = this.currentNode.connectedEdges();
        //console.log(edges);
        let probabilities = [];
        let pheromone = 0.0;
        for (let i = 0; i < edges.length; i++) {
            //console.log("entered inner loop of calc:")
            //console.log(this.routeEdges);
            //console.log(this.routeEdges.contains(edges[i]))
            if (!this.routeEdges.contains(edges[i])) {
                //console.log("entered contains check")
                //console.log(Math.pow(edges[i].data('pheromoneCount'), antColony.alpha))
                pheromone +=
                    Math.pow(edges[i].data('pheromoneCount'), antColony.alpha) * Math.pow(1.0 / calcDistanceBetweenPoints(edges[i].connectedNodes()[0],edges[i].connectedNodes()[1]), antColony.beta);
                //console.log(pheromone);
            }
        }
        for (let j = 0; j < edges.length; j++) {
            if (this.routeEdges.contains(edges[j])) {
                probabilities[j] = 0.0;
            } else {
                //console.log("numerator case entered")
                let numerator =
                    Math.pow(edges[j].data('pheromoneCount'), antColony.alpha) * Math.pow(1.0 / calcDistanceBetweenPoints(edges[j].connectedNodes()[0],edges[j].connectedNodes()[1]), antColony.beta);
                probabilities[j] = numerator / pheromone;
                //console.log(numerator);
                //console.log(pheromone);
                //console.log(probabilities[j])
            }
        }
        console.log(probabilities);
        return probabilities;
    }

}