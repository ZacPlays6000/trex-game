
var trex ,trex_running;
var scoreCount=0
var PLAY=1
var END=0
var gameState=1

function preload(){
  trexRun=loadAnimation("trex1.png","trex3.png","trex4.png")
  trexJump=loadAnimation("trex1.png")
  groundImage=loadImage("ground2.png")
  cloudImage=loadImage("cloud.png")
  cactus1=loadImage("obstacle1.png")
  cactus2=loadImage("obstacle2.png")
  cactus3=loadImage("obstacle3.png")
  cactus4=loadImage("obstacle4.png")
  cactus5=loadImage("obstacle5.png")
  cactus6=loadImage("obstacle6.png")
  restartButton=loadImage("restart.png")
  gameOverImage=loadImage("gameOver.png")
  trexCollide=loadAnimation("trex_collided.png")

  jumpSound=loadSound("jump.mp3")
  dieSound=loadSound("die.mp3")
  checkpointSound=loadSound("checkpoint.mp3")

}

function setup(){
  createCanvas(windowWidth,windowHeight)
  trex=createSprite(50,height-130,20,40)
  trex.addAnimation("joe",trexRun)
  trex.addAnimation("jump",trexJump)
  trex.addAnimation("freeze",trexCollide)
  trex.scale=0.68
  trex.debug=false
  trex.setCollider("circle",0,0,40)
 
  ground=createSprite(300,height-120,600,10)
  ground.addImage(groundImage)
  invGround=createSprite(300,height-110,600,10)
  invGround.visible=false

  var R=Math.round(random(1,100))
  console.log(R)
  cloudGroup=createGroup()
  obstacleGroup=new Group()
  
  restart=createSprite(width/2,height/2,0,0)
  restart.addImage(restartButton)
  restart.scale=0.7

  gameOver=createSprite(width/2,height/2-50,0,0)
  gameOver.addImage(gameOverImage)
  gameOver.scale=0.7
}

function draw(){
  background("lightgrey")
  drawSprites()
  text("Score:"+scoreCount,width-100,25)
  trex.collide(invGround) 
  console.log(scoreCount)

  if (gameState===1){
    ground.velocityX=-(4+scoreCount/50)
    if (scoreCount%150===0&&scoreCount>0){
      checkpointSound.play()
    }

    scoreCount=scoreCount+Math.round(getFrameRate()/60)
    if (ground.x<0) {
      ground.x=ground.width/2
    }
  
    if (touches.length>0||keyWentDown("space")&&trex.y>height-150) {
      trex.velocityY=-15
      jumpSound.play()
      touches=[]
    }
    if (trex.y>148) {
      trex.changeAnimation("joe")
    }
    else{
      trex.changeAnimation("jump")
    }
    trex.velocityY+=0.75
    spawnClouds()
    spawnObstacles()
    if (obstacleGroup.isTouching(trex)){
      gameState=0
      dieSound.play()

    // trex.velocityY=-15
    }
    gameOver.visible=false
    restart.visible=false
  }
  else if(gameState===0){
    ground.velocityX=0
    cloudGroup.setVelocityXEach(0)
    obstacleGroup.setVelocityXEach(0)
    restart.visible=true
    gameOver.visible=true
    trex.changeAnimation("freeze")
    cloudGroup.setLifetimeEach(-3)
    obstacleGroup.setLifetimeEach(-3)
    trex.velocityY=0
    if (mousePressedOver(restart)){
      gameState=1
      cloudGroup.destroyEach()
      obstacleGroup.destroyEach()
      scoreCount=0
    }
  }
 // console.log(getFrameRate())

}

function spawnClouds(){
  if (frameCount%70===0){
    cloud=createSprite(width,25,50,20)
    cloud.scale=1.5
    cloud.addImage(cloudImage)
    cloud.velocityX=-(3+scoreCount/50)
    cloud.y=Math.round(random(20,200))
    trex.depth=cloud.depth
    trex.depth+=1
    cloud.lifetime=width/cloud.velocityX
    cloudGroup.add(cloud)
    restart.depth=cloud.depth
    gameOver.depth=cloud.depth
  }

}

function spawnObstacles(){
  if (frameCount%100===0){
    cactus=createSprite(width,height-140,20,70)
    cactus.velocityX=-(4+scoreCount/50)
    x=Math.round(random(1,6))
    switch(x){
      case 1:
        cactus.addImage(cactus1)
        break

      case 2:
        cactus.addImage(cactus2)
        break

      case 3:
        cactus.addImage(cactus3)
        break

      case 4:
        cactus.addImage(cactus4)
        break

      case 5:
        cactus.addImage(cactus5)
        break

      case 6:
        cactus.addImage(cactus6)
        break

      default:
        break
    }
    cactus.scale=0.58
    cactus.lifetime=width/cactus.velocityX
    obstacleGroup.add(cactus)
  }
}
