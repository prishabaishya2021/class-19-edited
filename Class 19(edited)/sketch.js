

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var rabbit, rabbit_running, rabbit_collided;
var ground,  invisibleGround, groundImage;


var obstaclesGroup, obstacle1, obstacle2
var score=0;

var gameOver, restart;


function preload(){

    forest= loadImage("backgroundImg.png")
    sunAnimation = loadImage("sun.png");
    groundImage = loadImage("ground.png")
    rabbit_running=loadAnimation("running.png","running1.png","running2.png");
    rabbit_collided=loadAnimation("running1.png");
    obstacle1=loadImage("rock1.png");
    obstacle2=loadImage("rock2.png");
    
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");

    
    jumpSound = loadSound("sounds/jump.wav")
    collidedSound = loadSound("sounds/collided.wav")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  sun = createSprite(width-50,100,10,10);
  sun.addImage("sun", sunAnimation);
  sun.scale = 0.1
 

  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);

  rabbit = createSprite(50,height-70,20,50);
  rabbit.scale =0.5
  rabbit.addAnimation("running", rabbit_running);
  rabbit.addAnimation("collided", rabbit_collided);

  

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.13;
  
  
  
  obstaclesGroup = new Group();
  rabbit.setCollider("circle",0,0,rabbit.width-10);
  rabbit.debug=true
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(forest);
  stroke("red");
  textSize(30)
  text("Score: "+ score, 30,50);
  
  if (gameState===PLAY){
    gameOver.visible = false;
    restart.visible = false;
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    //change the trex animation
    rabbit.changeAnimation("running", rabbit_running);
    
    //rabbit jump
    if(keyDown("space") && rabbit.y >= height-160) {
      jumpSound.play( )
      rabbit.velocityY = -12;
    }
    console.log(ground.x)
    
    //gravity
    rabbit.velocityY = rabbit.velocityY + 0.8
  
    if (ground.x >0){
      ground.x = ground.width/2;
    }
    
    rabbit.collide(invisibleGround);
    
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(rabbit)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    rabbit.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    
    //change the trex animation
    rabbit.changeAnimation("collided",rabbit_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}



function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  score = 0;
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(1000,height-95,10,40);
    //obstacle.debug = true;
    
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.23;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

