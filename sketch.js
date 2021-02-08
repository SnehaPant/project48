const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
var engine, world;
var back
var helicopterImage
var heli
var monster=[]
var obs=[]
var power=[]
var x=800
var bg
var score=0
var obsGroup
var monsterGroup
var powerGroup
var gameState="start"
var powerState="off"
var highestScore=[]

function preload(){
back=loadImage("background2.png")
helicopterImage=loadAnimation("helicop1.png","helicop2.png","helicop3.png","helicop4.png")
fireImage=loadAnimation("fire1.png","fire2.png","fire4.png","fire5.png","fire6.png")
explosion=loadSound("explosion.wav")
helicopSound=loadSound("helicopter.wav")
powerSound=loadSound("power.wav")
}



function setup() {
  createCanvas(1530,500);
bg=createSprite(width/2,height/2)
bg.addImage(back)
bg.velocityX=-5
bg.scale=2.5
  engine = Engine.create();
  world = engine.world;
heli=new Helicop()
var options={
  isStatic:true
  
}
this.button = createButton('reset');
this.button.position(displayWidth/2 + 30, displayHeight/2);
helicopSound.loop()
ground=Matter.Bodies.rectangle(width/2,height,width,20,options)
World.add(world,ground)
obsGroup=createGroup()
monsterGroup=createGroup()
powerGroup=createGroup()
}

function draw() {
  background(0);  
  Engine.update(engine); 
  
  drawSprites();
  textSize(32)
  fill("black")
  strokeWeight(5)
  
  text("SCORE :" +score,width-200,50)
  rectMode(CENTER)
  rect(ground.position.x,ground.position.y,width,20) 
 
 if(gameState=='play'){
   play()
 }
if(gameState=='end'){
  end()
}
if(gameState=="start"){
  Start()
}
if(bg.x<0){
  bg.x=width/2
}
}

function mouseDragged(){
  Matter.Body.setPosition(heli.body,{x:100,y:mouseY})
}
function play(){

  heli.helicop.visible=true
  score=score+Math.round(getFrameRate()/60)
  if(frameCount%200==0){
    x+=300
    monster.push(new Monster(x,Math.round(random(100,450)),50))
  }
 
  if(frameCount%60==0){
    x+=300
    obs.push(new Obstacle(x,Math.round(random(100,450)),Math.round(random(50,90)),Math.round(random(100,150))))
  }
  if(frameCount%200==0){
    x+=300
    power.push(new Power(x,Math.round(random(100,450)),50))
  }
 
  for(var i=0;i<obs.length;i++){
    obsGroup.add(obs[i].obs)
  }
  for(var i=0;i<monster.length;i++){
    monsterGroup.add(monster[i].sprite)
  }
  for(var i=0;i<power.length;i++){
    powerGroup.add(power[i].pow)
  }
  if(heli.helicop.isTouching(obsGroup)){
       heli.helicop.changeAnimation("fire",fireImage)
       gameState='end'
       highestScore.push(score)
    
   
      explosion.play()
      
  }
  if(heli.helicop.isTouching(monsterGroup)){
    heli.helicop.changeAnimation("fire",fireImage)
    gameState='end'
    highestScore.push(score)
    

   explosion.play()
  
}
if(heli.helicop.isTouching(powerGroup)){
powerState="on"
textSize(60)
  stroke("black")
  fill("blue")
  text("POWER",100,100)
  powerSound.play()
}
if(powerState=="on"){
Powers()

}
if(powerState=='off'){
  obsGroup.setVelocityXEach(-8)
  monsterGroup.setVelocityXEach(-8)

}

 
  heli.display()

}
function end(){
  
  textSize(40)
  stroke("black")
  fill("red")
  text("GAME OVER",width/2.5,height/2)
 
  highestScore.sort(function(a,b){
    return b-a
  })
  var l=highestScore.length
  if(score>=highestScore[l-1]){
         text("Highest Score :"+ score,width/2.5,height/2+50)
        
  }

  
  obsGroup.setVelocityXEach(0)
  monsterGroup.setVelocityXEach(0)
  powerGroup.setVelocityXEach(0)
    bg.velocityX=0
}
function Powers(){
  obsGroup.setVelocityXEach(-4)
  monsterGroup.setVelocityXEach(-4)
  setTimeout(changePowerState,10000)
 
}
function changePowerState(){
  powerState="off"
}
function Start(){
  textSize(60)
  stroke("black")
  fill("pink")
     text("HELICOBTER",width/2.8,100)
     textSize(50)
     fill("purple")
     text("RULES :",width/2.5,180)
     textSize(50)
     text("press *SPACE* to play",width/3,250)
     text("if it touches monster or obstcles then game will end  ",width/8,310)
     text(" play with mouse ",width/2.8,370)
     if(keyDown("space")){
       gameState="play"
     }
     heli.helicop.visible=false
     //this.button.hide()


}
this.reset.mousePressed(()=>{
gameState="play"
});