
export class Genetic {

    constructor(pop0, fitness, mutate, nkeep, npop) {
        this.population = pop0;
        this.fitnessFunc = fitness;
        this.mutateFunc = mutate;
        this.fitness = [];
        this.selection_type = 'roulette'; // roulette, topn

        // number of population
        this.npop = npop || len(this.population);
        // number of fit parents to reproduce
        this.nkeep = nkeep || round(len(this.population)*0.1);

        this.iter = 0;
    }

    run(runiter) {
        const enditer = this.iter + runiter;
        this.fitness = Array.apply(null, Array(this.population.length)).map(()=>0);

        while(true) {
            let parents = [];

            // evaluate fittness for population members
            this.fitness = this.population.map(this.fitnessFunc);

            // elitism - most fit parent always survives
            let best = this.best;
            parents.push(best.unit);

            // Natural selection -  make fit parents breed
            const survivors = this.natural_selection(this.selection_type);
            let children = [], n_children = this.npop - len(survivors);
            for(let i of survivors)
                if (i!=best.index)
                    parents.push(this.population[i]);

            // console.log("-----------------------")
            // for(let pop of this.population)
            //     console.log(pop)

            // if (this.iter > 2)
            //     break;

            for(let _ of range(n_children))
            {
                // select 2 rnd unique parents to breed
                random.shuffle(parents);
                
                if (parents.length == 0) {
                    console.error("WTF parents == 0", this.npop, this.population, survivors);
                    break;
                }

                let father = parents[0], mother = parents[1] || parents[0];
                // crossover step - replace random range
                let child = this.crossover(father, mother);

                // mutate step
                for (let gene of child)
                    this.mutateFunc(gene);
                
                children.push(child);
            }
            
            this.population = parents.concat(children);

            // step iteration
            this.iter++;
            if (this.iter > enditer)
                break;
        }
    }

    get best() {
        // recalculate fitness so that arrays are in order
        this.fitness = this.population.map(this.fitnessFunc);

        
        let bfitness = Math.max(...this.fitness);
        let bindex = this.fitness.indexOf(bfitness);

        return {
            unit: this.population[bindex],
            index: bindex,
            fitness: bfitness
        };
    }

    crossover(father, mother) {
        const L = len(father);

        let start_i = random.randint(0, L);
        let end_i = random.randint(start_i, L);

        // @TODO: crossover is WRONG

        // colors must stay in place idiot

        // swap genes
        let child = [];
        for(let i of range(L))
            child.push(father[i].clone());

        for(let i of range(start_i, end_i))
            child[i] = mother[i].clone();

        return child;
    }

    natural_selection() {
        let survivors;
    
        // natural selection (keep N fittest)
        switch(this.selection_type) {
            case "roulette":
                const total_fitness = sum(this.fitness);
                const dist = {};

                // define distrib table from fittness weighs
                for(let i of range(len(this.population)))
                    dist[i] = this.fitness[i] / total_fitness;

                // N selections of distrib table
                survivors = new Set();
                for(let _ of range(this.nkeep))
                    survivors.add(random.distribution(dist));
                
                // cut off excess parents
                survivors = list(survivors);
                survivors.length = Math.min(this.nkeep, len(survivors));

                break;
            case "topn": default:
                survivors = list(range(len(this.population))).sort((i,j) => (this.fitness[i] > this.fitness[j]) ? 1 : -1);
                survivors.length = this.nkeep;
                break;
        }

        return survivors.map(int);
    }

    debug_pop(f) {
        console.log("-------------------------");
        for(let i in this.fitness) {
            console.log(i, this.fitness[i], f(this.population[i]), this.population[i]);
        }
    }
};