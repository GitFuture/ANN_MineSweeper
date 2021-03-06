﻿Qt.include("Params.js")
Qt.include("Neuralnet.js");
Qt.include("Tank.js");
Qt.include("Landmine.js");

var controller;
function init(canvas) {
    var ctx = canvas.getContext("2d");
    controller = Controller.build();
    Landmine.ctx = ctx;
    var lmData = [];
    for(var i = 0; i < controller.mineNum; i++) {
        lmData.push(parseInt(Math.random()*canvas.width), parseInt(Math.random()*canvas.height));
    }

    LandmineSet.addLandminesFromData(lmData);

    Tank.ctx = ctx;
    controller.createTanks(1);
    controller.tanks[0].update(100, 100, 0);
}

function paint(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    controller.update();

    if( LandmineSet.mines.length < controller.mineNum ) {
        var lmData = [parseInt(Math.random()*canvas.width), parseInt(Math.random()*canvas.height)];
//        for(var i = LandmineSet.mines.length; i < controller.mineNum; i++) {
//            lmData.push(parseInt(Math.random()*canvas.width), parseInt(Math.random()*canvas.height));
//        }
        LandmineSet.addLandminesFromData(lmData);
    }
}

var Controller = {
    population: [],
    tanks: [],
    mineNum: 20,

    weightsNumInNN: 0, // weights in neural net
    avgFitness: 0, // the average fitness of each epoch
    bestFitness: 0, // the best fitness of each epoch
    tickNum: 0,
    ticks: 0, // the frame for each epoch
    build: function() {
        this.initSelfParams();
//        this.initNeuralnet();
        return this;
    },

    initSelfParams: function() {
        this.mineNum = Params.getParam("Controller_mineNum", 20);
        this.tickNums = Params.getParam("Controller_tickNum", 500);
    },

    update: function() {
        LandmineSet.drawAll();
        this.drawAllTanks();
        // check that if the mine should be cleared
        LandmineSet.destroyFromScale([controller.tanks[0].x - Tank.wheel_x, controller.tanks[0].x + Tank.wheel_x], [controller.tanks[0].y - Tank.wheel_y, controller.tanks[0].y + Tank.wheel_y]);

        this.tanks.forEach(function(tank){
            tank.updateState(LandmineSet.mines);
        });
        if ( this.ticks++ < this.tickNum ) {
        } else {
//            this.ticks = 0;
        }
    },

    /**
     * set exact tank's speed
     * {int} id
     * {double} speed
     */
    setTankSpeed: function(id, speed) {
        this.tanks[id].speed = speed;
    },

    /**
     * {int} num  the number of tanks needed to be created
     */
    createTanks: function(num) {
        for (var i = 0; i < num; i++) {
            this.tanks.push(Tank.create(i));
        }
    },

    drawAllTanks: function() {
        this.tanks.forEach(function(tank){
           tank.draw();
        });
    },

    initNeuralnet : function() {
        NeuralNet.build();
    },

}

function writeParams() {
    Params.writeParams();
}

function moveFirstTank(code) {
    // var t = controller.getTank(0);
    switch (code) {
        case Qt.Key_W:
            controller.tanks[0].move(-3, 0);
            break;
        case Qt.Key_A:
            controller.tanks[0].rotate -= 5;
            break;
        case Qt.Key_S:
            controller.tanks[0].move(3, 0);
            break;
        case Qt.Key_D:
            controller.tanks[0].rotate += 5;
            break;
    }
}
