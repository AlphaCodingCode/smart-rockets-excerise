// rockets and amount of rockets to display
let rockets = [];
let rocketCount = 40;
let mutationRate = 5;
let generationCount = 0; // current generation
let goal = {x : 700, y : 400}; // goal position to reach

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    // initialize rockets
    for (let i = 0; i < rocketCount; i++) {
        rockets.push(new Rocket(movement));
        rockets[i].generateMovements();
    }
}

function mouseClicked() {
    // click mouse to change goal position
    goal.x = mouseX;
    goal.y = mouseY;
}

function draw() {
    // Update
    let allDone = true;
    for (let i = 0; i < rockets.length; i++) {
        rockets[i].update();
        if (!rockets[i].pauseSimulation)
            allDone = false;
    }
    // all rockets are done their movements, make a new generation
    if (allDone) {
        generationCount++;
        newGeneration();
    }
    // Render
    background(0);
    noFill();
    stroke(255);
    ellipse(goal.x, goal.y, 50, 50);
    strokeWeight(3);
    stroke(255, 0, 0);

    // draw a line from the goal to the closest rocket to it
    rockets.sort((a, b) => b.fitness - a.fitness);
    line(goal.x, goal.y, rockets[0].position.x, rockets[0].position.y);
    strokeWeight(1);
    stroke(0);
    // render rockets
    for (let i = 0; i < rockets.length; i++) {
        rockets[i].render();
        // if a rocket has reached the goal, then stop animation
        if (dist(rockets[i].position.x, rockets[i].position.y, goal.x, goal.y) < 2) {
            noLoop();
        }
    }
    // draw generation count
    fill(255);
    textAlign(LEFT);
    textSize(20);
    text("Generation: " + generationCount, 0, 40);
}

function calculatePopulationFitness() {
    // go through the rockets and recompute fitness to be a number between 1 - 100
    let fitnessSum = 0;
    for (let i = 0; i < rockets.length; i++) {
        rockets[i].fitness = Math.pow(width, 3) + (Math.pow(rockets[i].fitness, 3));
        fitnessSum += rockets[i].fitness;
    }
    for (let i = 0; i < rockets.length; i++)
        rockets[i].fitness = (rockets[i].fitness / fitnessSum) * 100;
}


function getParent() {
    let fitnessThreshold = random(0, 100);
    let scoreRange = 100;
    for (let i = 0; i < rockets.length; i++) {
        scoreRange -= rockets[i].fitness;
        if (scoreRange <= fitnessThreshold)
            return rockets[i];
    }
}



function newGeneration() {
    let childRockets = [];

    // best rocket enters new generation untouched - make it white
    rockets.sort((a, b) => b.fitness - a.fitness);


    calculatePopulationFitness();


    while (childRockets.length < rocketCount) {
        // weighted parent selection
        let parent1 = getParent();
        let parent2 = getParent();
        while (parent1 === parent2)
            parent2 = getParent();

        // crossover


        // apply mutation



        childRockets.push(new Rocket(newMovements));
    }
    rockets = childRockets;
}
