let sliderSet = 0;

function qs(sSelector) {
    return document.querySelector(sSelector);
}

let btnMakePaperclip = qs("#btnMakePaperclip");

function runAutoclicker() {
    btnMakePaperclip.click();
    if (!wireBuyerFlag && wire < wireSupply / 10) {
        qs("#btnBuyWire").click();
    }
    if (humanFlag === 1) {
        setClipPrice();
        buyAutoClippers();
        buyMarketing();
        doInvestments();
    }else if (!spaceFlag){
        buyBuildings();
        setSlider();
    }else {
        spaceAge();
        setSlider();
    }
    buyComputation();
    buyProjects();
    clickQChips();
    doStrategicModeling();
}

function setClipPrice() {
    //Calculate the clips demanded. This is *not* clips demanded each second. That would be * 10.
    //I don't know why but perfectly lining up clips demanded with clips produced does not give optimal revenue.
    //I arrived at *4 by trying different numbers and seeing if it felt right.
    let clipsDemanded = Math.floor(.7 * Math.pow(demand, 1.15)) * 4;
    if ((clipsDemanded) <= clipRate && margin > 0.02){
        qs("#btnLowerPrice").click();
    }else if ((clipsDemanded > clipRate*1.1 || clipsDemanded > 1000) && clipRate > 0) {
        qs("#btnRaisePrice").click();
    }else if (clipRate === 0) {
        qs("#btnLowerPrice").click();
    }
}

function buyAutoClippers() {
    //Whenever buying clippers, always make sure you have enough left to buy wire. Else you can run out and screw everything up.
    if (funds > wireCost + clipperCost) {
        qs("#btnMakeClipper").click();
    }

    if (funds > wireCost + megaClipperCost) {
        qs("#btnMakeMegaClipper").click();
    }
}

function buyComputation() {
    //Keep 3x as many memory units as processors.
    //No hard logic, just seems to be a nice balance of ops/second and purchasing power.
    if (memory <= processors * 3) {
        qs("#btnAddMem").click();
    }else {
        qs("#btnAddProc").click();
    }
}

function buyProjects() {
    //Buy projects as soon as they are affordable, in orer top-bottom.
    let projectButtons = document.querySelectorAll(".projectButton");
    for (let projectButton of projectButtons) {
        if (operations > 0 && !projectButton.disabled) {
            projectButton.click();
            return;
        }
    }
}

function buyMarketing() {
    if (funds > wireCost + adCost && clipperCost > wireCost + adCost) {
        qs("#btnExpandMarketing").click();
    }
}

function clickQChips() {
    let q = qCompAutoclicker();

    if (q > 0) {
        qs("#btnQcompute").click();
    }
}

function qCompAutoclicker(){
    let q = 0;


    if (qChips[0].active > 0) {
        for (let i = 0; i<qChips.length; i++){
            q = q+qChips[i].value;
        }

        return Math.ceil(q*360);
    }
    return 0;
}

function doInvestments() {
    if (!investmentEngineFlag) {
        return;
    }

    //Aggressively invest until you reach $30,000,000
    let chosenInvestStrat = (secTotal < 30000000) ? "hi" : "med"
    if (qs("#investStrat").value !== chosenInvestStrat) {
        qs("#investStrat").value = chosenInvestStrat;
    }

    //Once investments are unlocked, it's essential to make as much money as possible.
    //Every second there's an approx 33% chance to invest as long as you have more than 1/3 of your wire remaining.
    if (Math.random() < 0.03 && wire > wireSupply / 3) {
        qs("#btnInvest").click();
    }

    if (project40b.flag) {
        //This needs $64,000,000
        if (secTotal > 30000000 && bankroll > 70000000) {
            investWithdraw();
        }
    }else {
        //Keep piling money into investments until you can withdraw $10,000,000. That's the most money you need at one time.
        //Maintain a pool of $30,000,000 to keep making money after withdrawing.
        if (secTotal > 30000000 && bankroll > 10000000) {
            investWithdraw();
        }
    }

    qs("#btnImproveInvestments").click();
}

function doStrategicModeling() {
    if (!strategyEngineFlag || operations < memory * 1000) {
        return;
    }

    //TODO create intelligent strategic modelling logic.
    //Right now it just sums the payoffs of A and B and goes all-in on whichever one is higher.

    qs("#btnNewTournament").click();
    let totalAValue = payoffGrid.valueAA + payoffGrid.valueAB + payoffGrid.valueBA;
    let totalBValue = payoffGrid.valueBB + payoffGrid.valueAB + payoffGrid.valueBA;
    if (strats.length == 1) {
        qs("#stratPicker").value = 0;
    }else if (stratA100.active && stratB100.active) {
        if (totalAValue > totalBValue) {
            qs("#stratPicker").value = 1;
        }else {
            qs("#stratPicker").value = 2;
        }
    }

    qs("#btnRunTournament").click();
}

function buyBuildings() {
//Factories  take 200MW each
//Solar farms make 50MW each
//Drones take 1MW each
    var powerSupply = farmLevel * farmRate/100;
    var dDemand = (harvesterLevel * dronePowerRate/100) + (wireDroneLevel * dronePowerRate/100);
    var fDemand = (factoryLevel * factoryPowerRate/100);
    var powerDemand = dDemand + fDemand;
    var powerCap = batteryLevel * batterySize;

    //Buy factories if you can buy them with 5 seconds of waiting
    var prioritizeFactory = factoryCost < clipRate * 5;
    //Buy solar farms if power demand is >90% of power supply
    var prioritizeFarm = (powerDemand >= powerSupply - (powerSupply * 0.1));

    if ((prioritizeFarm && unusedClips > farmCost) || availableMatter == 0) {
        let amount = Math.floor(unusedClips/farmCost);
        amount = amount > 10000 ? 10000 : amount;
        makeFarm(amount);
    }else if (powerCap < powerSupply * 100 && unusedClips > batteryCost) {
        makeBattery(1);
    }else if (unusedClips > factoryCost) {
        makeFactory();
    }else if (unusedClips > harvesterCost && harvesterLevel <= wireDroneLevel * 0.6666 ) {
        let amount = Math.floor(unusedClips/harvesterCost);
        amount = amount > 10000 ? 10000 : amount;
        makeHarvester(amount);
    }else if (unusedClips > wireDroneCost && !prioritizeFactory && !prioritizeFarm) {
        let amount = Math.floor(unusedClips/wireDroneCost);
        amount = amount > 10000 ? 10000 : amount;
        makeWireDrone(amount);
    }

    if (availableMatter == 0) {
        factoryReboot();
        wireDroneReboot();
        harvesterReboot();
    }
}

function setSlider() {
    if (!sliderSet) {
        qs("#slider").value = 100;
        sliderSet = 1;
    }
}

function spaceAge() {
    if (unusedClips > probeCost) {
        makeProbe();
    }

    if (yomi > probeTrustCost) {
        increaseProbeTrust();
    }

    if (swarmStatus === 3) {
        entertainSwarm();
    }

    if (honor > maxTrustCost) {
        increaseMaxTrust();
    }

    setProbeDesign();
}

let statTargets = [
    [1,1,6,6,2,2,2], //initial values
    [1,1,5,4,1,1,1,6], //after combat unlocked
    [1,1,6,6,1,1,1,6], //Fill out stats to increase drone numbers as trust becomes available
    [3,3,6,6,1,1,1,6], //fill out speed as trust becomes available. Subsequent trust will be added sequentially to all stats.
]

function setProbeDesign() {
    let probeCombatFlag = project131.flag;
    let maxTrustIncreasedFlag = maxTrust > 20;

    let currentStatTargets = getStatTargets();

    if (probeSpeed < currentStatTargets[0]) {
        raiseProbeSpeed();
    }else if (probeSpeed > currentStatTargets[0]) {
        lowerProbeSpeed();
    }
    if (probeNav < currentStatTargets[1]) {
        raiseProbeNav();
    }else if (probeNav > currentStatTargets[1]) {
        lowerProbeNav();
    }

    if (probeRep < currentStatTargets[2]) {
        raiseProbeRep();
    }else if (probeRep > currentStatTargets[2]) {
        lowerProbeRep();k
    }
    if (probeHaz < currentStatTargets[3]) {
        raiseProbeHaz();
    }else if (probeHaz > currentStatTargets[3]) {
        lowerProbeHaz();
    }

    if (probeFac < currentStatTargets[4]) {
        raiseProbeFac();
    }else if (probeFac > currentStatTargets[4]) {
        lowerProbeFac();
    }
    if (probeHarv < currentStatTargets[5]) {
        raiseProbeHarv();
    }else if (probeHarv > currentStatTargets[5]) {
        lowerProbeHarv();
    }
    if (probeWire < currentStatTargets[6]) {
        raiseProbeWire();
    }else if (probeWire > currentStatTargets[6]) {
        lowerProbeWire();
    }
    if (probeCombatFlag && probeCombat < currentStatTargets[7]) {
        raiseProbeCombat();
    }else if (probeCombatFlag && probeCombat > currentStatTargets[7]) {
        lowerProbeCombat();
    }
}

function getStatTargets() {
    let probeCombatFlag = project131.flag;

    if (!probeCombatFlag) {
        return statTargets[0];
    }else if (probeTrust == 20) {
        return statTargets[1];
    }else if (probeTrust <= 23) {
        return statTargets[2];
    }else if (probeTrust <= 27) {
        return statTargets[3];
    }else {
        return fillStatTargetsSequentially();
    }
}

function fillStatTargetsSequentially() {
    let initialTargets = [3,3,6,6,1,1,1,6];
    let amountInEachBucket = Math.floor((probeTrust - 27) / 8);
    let remainderAmount = (probeTrust - 27) % 8;

    for (let i = 0; i < initialTargets.length; i++) {
        initialTargets[i] += amountInEachBucket;
        if (i < remainderAmount) {
            initialTargets[i] += 1;
        }
    }

    return initialTargets;
}

let autoclicker = setInterval(runAutoclicker, 75);

