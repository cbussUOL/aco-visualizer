class Ant {

    constructor() {
        this.route = [];
        this.route.push(startNode);
        this.currentNode = startNode;
        this.visited = new Map();
    }

    visitNode(node) {
        this.route.push(node);
        this.visited.set(node.id(), true);
        this.currentNode = node;
    }


    chooseNextNode() {
        let edges  = this.route[this.route.length-1].connectedEdges();
        let targets  = edges.targets();
        //Rolls if Random nodes should be chosen
/*        if (Math.random() < antColony.randomFactor) {
            return targets[0]
        }*/
        let probabilities = this.calcProbabilities();
        console.log(probabilities)
        let r = Math.random();
        let total = 0;
        for (let i = 0; i < targets.length; i++){
            total += probabilities[i];
            console.log('Total vs R')
            console.log(total)
            console.log(r)
            if (total >= r) {
                return i;
            }
        }
        throw "We aint found shit"

    }
    //Calculates the probabilities of a certain edge being chosen
    //This is based on pheromones and distance
    //The two factors are weighted by alpha and beta respectively
    calcProbabilities() {
        let edges  = this.currentNode.connectedEdges();
        let probabilities = [];
        let pheromone = 0.0;
        for (let i = 0; i < edges.length; i++) {
            //TODO edge liste hinzufügen
            if (this.route.includes(edges[i])) {
                pheromone +=
                    Math.pow(edges[i].data('pheromoneCount'), antColony.alpha) * Math.pow(1.0 / calcDistanceBetweenPoints(this.route[this.route.length-1],edges[i].target()), antColony.beta);
            }
        }
        for (let j = 0; j < edges.length; j++) {
            if (this.visited.get(edges[j].id())) {
                probabilities[j] = 0.0;
            } else {
                let numerator =
                    Math.pow(edges[j].data('pheromoneCount'), antColony.alpha) * Math.pow(1.0 / calcDistanceBetweenPoints(this.route[this.route.length-1],edges[j].target()), antColony.beta);
                probabilities[j] = numerator / pheromone;
            }
        }
        return probabilities;
    }

}