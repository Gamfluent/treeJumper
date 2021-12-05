var gameState = "start";

var bear, bearIdle, bearRun, bearJump, bearFall;
var acornGroup, acornImage;
var branchesGroup, branchImage;
var invisBlockGroup;
var jumpVelocity = 20;
var Xvel = 0;
var friction = 0.6;
var lives;
var acornGroup;
var acorn;
var score = 0;

function preload(){
    acornImage = loadImage("Images/acorn.png");
    branchImage = loadImage("Images/branch.png");

    bearIdle = loadAnimation("Images/bear/idle1.png", "Images/bear/idle2.png");
    bearRun = loadAnimation("Images/bear/run1.png", "Images/bear/run2.png", "Images/bear/run3.png", "Images/bear/run4.png", "Images/bear/run5.png", "Images/bear/run6.png");
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    
    bear = createSprite(windowWidth/2, windowHeight/2);
    bear.addAnimation("Idle", bearIdle);
    bear.addAnimation("Run", bearRun);
    bear.debug = false;

    bgImg = loadImage("Images/bg.jpg");

    branchesGroup = new Group();
    acornGroup = new Group();
    invisBlockGroup = new Group();

    spawnBranches();
}

function draw(){
    background(bgImg);
    bear.x += Xvel;
    Xvel = Xvel * friction;
    bear.velocityY += 0.8;

    if(gameState === "start"){
        bear.x = windowWidth/2;
        bear.y = windowHeight/2;
        bear.velocityY = 0;
        Xvel = 0;
        lives = 3;
        score = 0;
    }

    if(gameState === "start" && keyDown("space")){
        gameState = "level1";
    }

    if(gameState === "level1"){
        spawnAcron(60);
        touchingAcorn();
        touchingBranch();

        console.log(getFrameRate());

        //Score
        if(bear.velocityY < 0){
            score += Math.round(getFrameRate()/30);
        }

        textSize(20);
        fill("white");
        text("Score : " + score, 50, 50);

        //Displaying text
        text("Lives : " + lives, windowWidth/2, 50);

        //Player movement
        if(keyDown("RIGHT_ARROW")){
        Xvel = 10;
        } else if (keyDown("LEFT_ARROW")){
        Xvel = -10;
        } 

        //Player Animation
        if(Xvel < 0.1 && Xvel > -0.1){
        bear.changeAnimation("Idle", bearIdle);
        } else if(Xvel > 0 || Xvel < 0){
        bear.changeAnimation("Run", bearRun);
        }

        if(bear.velocityY > 0){
            bear.changeAnimation("Jump", bearJump);
        } else if(bear.velocityY < 0){
            bear.changeAnimation("Fall", bearFall);
        }

        //Touching Branches
        if(bear.isTouching(branchesGroup)){
            bear.velocityY = 0;
        }

        if(keyDown("UP_ARROW") && branchesGroup.isTouching(bear)){
            bear.velocityY = -20;
        }

        //Touching invis block
        if(bear.isTouching(invisBlockGroup)){
            bear.Xvel = bear.Xvel * -1;
        }

        if(bear.y < 0){
            bear.y = windowHeight/2;
            bear.x = windowWidth/2;
            branchesGroup.destroyEach();
            invisBlockGroup.destroyEach();
            spawnBranches();
        }

        if(lives === 0){
            gameState = "end";
        }

        if(bear.y > windowHeight){
            gameState = "end";
        }
    }

    if(gameState === "end"){
        reset();
        if(gameState === "end" && keyDown("SPACE")){
            gameState = "level1";
        }
    }

    drawSprites();
}

function reset(){
    gameState = "start";
    branchesGroup.destroyEach();
    acornGroup.destroyEach();
    invisBlockGroup.destroyEach();
}

function touchingAcorn(){
    for(var i = 0; i < acornGroup.length; i++){
        if(bear.isTouching(acornGroup.get(i))){
            acornGroup.get(i).destroy();
            lives -= 1;
        }
    }
}

function touchingBranch(){
    for(var a = 0; a < branchesGroup.length; a++){
        if(bear.isTouching(branchesGroup.get(a))){
            branchesGroup.get(a).lifetime = 5;
        }
    }
}

function spawnAcron(speed){
    if(frameCount % speed === 0){
        var acorn = createSprite(600, 0, 50, 50);
        acorn.x = random(50, windowWidth - 50);
        acorn.addImage(acornImage);
        acorn.scale = 0.3;
        acorn.velocityY += 10;

        acorn.setCollider("rectangle", 0, 10, 100, 140);
        acorn.debug = true;

        acorn.lifetime = windowHeight/10;

        acornGroup.add(acorn);
    }
}

function spawnBranches(){
    var branch;
    var invisBlock;
    var invisBlcok2;
    offsetX = 140;
    offsetY = 20;
    //for(var i = 0; i < 4; i += 1){
        for(var i = 0; i < windowWidth; i += random(300, 800)){
            branch = createSprite(i, 100, 200, 20);
            branch.x = random(50, windowWidth);
            branch.y = random(windowHeight/2, windowHeight);
            branch.addImage(branchImage);
            branchesGroup.add(branch);
            branch.scale = 0.75;
            branch.setCollider("rectangle",30,20,400,50);
            branch.debug = false;

            invisBlock = createSprite(100, 100, 20, 60);
            invisBlock.x = branch.x - offsetX;
            invisBlock.y = branch.y + 20;
            invisBlockGroup.add(invisBlock);

            invisBlock2 = createSprite(100, 100, 20, 60);
            invisBlock2.x = branch.x + offsetX + 20;
            invisBlock2.y = branch.y + offsetY;
            invisBlockGroup.add(invisBlock2);
        }
    //}

    //for(var k = 0; k < 5; k += 1){
        for(var j = 0; j < windowWidth; j += random(300, 800)){
            branch = createSprite(j, 100, 20);
            //branch.x = random(100, windowWidth - 100);
            branch.y = random(150, windowHeight/3);
            branch.addImage(branchImage);
            branchesGroup.add(branch);
            branch.scale = 0.75;
            branch.setCollider("rectangle", 30, 20, 400, 50);
            branch.debug = false;

            invisBlock = createSprite(100, 100, 20, 60);
            invisBlock.x = branch.x - offsetX;
            invisBlock.y = branch.y + offsetY;
            invisBlockGroup.add(invisBlock);

            invisBlock2 = createSprite(100, 100, 20, 60);
            invisBlock2.x = branch.x + offsetX + 20;
            invisBlock2.y = branch.y + offsetY;
            invisBlockGroup.add(invisBlock2);
        }
    //}
}

