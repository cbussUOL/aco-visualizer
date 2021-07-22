//Manages Colony of Ant Objects and passes results

class AntColony {
    constructor(popSize, maxIterations) {
        this.popSize = popSize;
        this.maxIterations = maxIterations;
        this.bestSolution = null;
        this.bestSolutionLength = null;
    }
}