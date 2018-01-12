/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

var game;
var highscore = 0;
var firstInit = true;

var isApp = false; //is it a Cordova mobile app?
var removeGameButtons = true;

var app = {
    // Application Constructor
    initialize: function() {
        //Init Event Listeners
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
                
        window.addEventListener('DOMContentLoaded', this.onDeviceReady, false);
        
        if(MobileAndTabletCheck()){
            /*------PHONE CONTROL-------*/
            window.addEventListener('touchmove', function(e) {
                // Prevent scrolling
                //e.preventDefault();
            }, false);
            
            document.body.className += "isMobile";
            console.log("Mobile device detected");
        }
        else{
            /*-------KEYBOARD CONTROL-------*/
            window.addEventListener("keydown", function (e) {
                for(i in game.isKeyDown)
                    if(game.isKeyDown.hasOwnProperty(i) && e.keyCode == i)
                        game.isKeyDown[e.keyCode] = true;
            }, false);

            window.addEventListener("keyup", function (e) {
                if(game.isKeyDown[e.keyCode] != undefined)
                    game.isKeyDown[e.keyCode] = false;

                for(var j=0;j<game.controls["game_pause"].length;j++)
                    if(e.keyCode==game.controls["game_pause"][j] && !game.gameOver){
                        game.togglePause();
                        break;
                    }
                
                for(var j=0;j<game.controls["game_mute"].length;j++)
                    if(e.keyCode==game.controls["game_mute"][j] && !game.gameOver){
                        game.toggleMute();
                        break;
                    }

                for(var j=0;j<game.controls["game_over"].length;j++)            
                    if(e.keyCode==game.controls["game_over"][j] && game.gameOver){
                        game.restartGame();
                        break;
                    }
                
                if(firstInit){
                    game.restartGame();
                }

            }, false);
        }
         
        var gameBtns = {
            "backRunning":document.getElementsByClassName("game_button")[1],
            "running":document.getElementsByClassName("game_button")[0],
            "sprinting":document.getElementsByClassName("game_button")[2]
        }
        
        var leftBtns = document.getElementById("game_menu").getElementsByClassName("button");
        
        var menuBtns = {
            "backBtn":leftBtns[0],
            "infoBtn":leftBtns[1],
            "pauseBtn":document.getElementsByClassName("pause-btn")[0],
            "volBtn":document.getElementsByClassName("vol-btn")[0]
        };
        
        if(MobileAndTabletCheck()){
            //Mobile Support via touch event listeners
            
            //Game Control Btns
            gameBtns["backRunning"].addEventListener("touchstart", function (e) {
                //e.preventDefault();
                game.isButtonPressed["backRunning"] = true;
                
                gameBtns["backRunning"].className = gameBtns["backRunning"].className.replaceAll(" inactive"," active"); 
            }, false);

            gameBtns["backRunning"].addEventListener("touchend", function (e) {
                //e.preventDefault();
                game.isButtonPressed["backRunning"] = false;
                
                gameBtns["backRunning"].className = gameBtns["backRunning"].className.replaceAll(" active"," inactive");
            }, false);

            gameBtns["running"].addEventListener("touchstart", function (e) {
                //e.preventDefault();
                game.isButtonPressed["running"] = true;
                
                gameBtns["running"].className = gameBtns["running"].className.replaceAll(" inactive"," active");
            }, false);

            gameBtns["running"].addEventListener("touchend", function (e) {
                //e.preventDefault();
                game.isButtonPressed["running"] = false;
                
                gameBtns["running"].className = gameBtns["running"].className.replaceAll(" active"," inactive");
            }, false);

            gameBtns["sprinting"].addEventListener("touchstart", function (e) {
                //e.preventDefault();
                game.isButtonPressed["sprinting"] = true;
                
                gameBtns["sprinting"].className = gameBtns["sprinting"].className.replaceAll(" inactive"," active");
            }, false);

            gameBtns["sprinting"].addEventListener("touchend", function (e) {
                //e.preventDefault();
                game.isButtonPressed["sprinting"] = false;
                
                gameBtns["sprinting"].className = gameBtns["sprinting"].className.replaceAll(" active"," inactive");
            }, false);
            
            //Menu Buttons (Back, Pause and Mute)
            menuBtns["backBtn"].addEventListener("touchend",function(){
                game.gameOver = true;
                firstInit = true;
            
                document.getElementById("instructionsSplashScreen").className = document.getElementById("instructionsSplashScreen").className.replaceAll(" disappear"," appear");
                        
                document.getElementById("splashScreen").className = document.getElementById("splashScreen").className.replaceAll(" appear"," disappear");
                
                if(MobileAndTabletCheck()) document.getElementById("instructionsSplashScreen").addEventListener("touchend",game.restartGame);
            }, false);
            
            menuBtns["pauseBtn"].addEventListener("touchend", function(){
                game.togglePause();
            }, false);
            
            menuBtns["volBtn"].addEventListener("touchend", function(){
                game.toggleMute();
            }, false);
        }
        else{
            if(removeGameButtons){
                //If not mobile device, remove buttons to avoid distraction/confusion
                var a;
                for(a in gameBtns){
                    if(gameBtns.hasOwnProperty(a))
                        gameBtns[a].parentNode.removeChild(gameBtns[a]);
                }

                console.log("Game Buttons removed.");
            }
            else{
                //Game Control Btns
                gameBtns["backRunning"].addEventListener("mousedown", function (e) {
                    //e.preventDefault();
                    game.isButtonPressed["backRunning"] = true;

                    gameBtns["backRunning"].className = gameBtns["backRunning"].className.replaceAll(" inactive"," active"); 
                }, false);

                gameBtns["backRunning"].addEventListener("mouseup", function (e) {
                    //e.preventDefault();
                    game.isButtonPressed["backRunning"] = false;

                    gameBtns["backRunning"].className = gameBtns["backRunning"].className.replaceAll(" active"," inactive");
                }, false);

                gameBtns["running"].addEventListener("mousedown", function (e) {
                    //e.preventDefault();
                    game.isButtonPressed["running"] = true;

                    gameBtns["running"].className = gameBtns["running"].className.replaceAll(" inactive"," active");
                }, false);

                gameBtns["running"].addEventListener("mouseup", function (e) {
                    //e.preventDefault();
                    game.isButtonPressed["running"] = false;

                    gameBtns["running"].className = gameBtns["running"].className.replaceAll(" active"," inactive");
                }, false);

                gameBtns["sprinting"].addEventListener("mousedown", function (e) {
                    //e.preventDefault();
                    game.isButtonPressed["sprinting"] = true;

                    gameBtns["sprinting"].className = gameBtns["sprinting"].className.replaceAll(" inactive"," active");
                }, false);

                gameBtns["sprinting"].addEventListener("mouseup", function (e) {
                    //e.preventDefault();
                    game.isButtonPressed["sprinting"] = false;

                    gameBtns["sprinting"].className = gameBtns["sprinting"].className.replaceAll(" active"," inactive");
                }, false);
            }
            
            //Game menu buttons functions
            menuBtns["backBtn"].addEventListener("mouseup",function(){
                game.gameOver = true;
                firstInit = true;
            
                document.getElementById("instructionsSplashScreen").className = document.getElementById("instructionsSplashScreen").className.replaceAll(" disappear"," appear");
                        
                document.getElementById("splashScreen").className = document.getElementById("splashScreen").className.replaceAll(" appear"," disappear");
            }, false);
            
            menuBtns["pauseBtn"].addEventListener("mouseup",function(){
                game.togglePause();
            }, false);
            
            menuBtns["volBtn"].addEventListener("mouseup",function(){
                game.toggleMute();
            }, false);
            
            //Game menu buttons hover animation            
            for(i in menuBtns){
                if(!menuBtns.hasOwnProperty(i)) continue;
                
                menuBtns[i].className+=" inactive";
                
                menuBtns[i].addEventListener("mouseover", function(){
                    this.className = this.className.replaceAll(" inactive"," active");
                }, false);

                menuBtns[i].addEventListener("mouseout", function(){
                    this.className = this.className.replaceAll(" active"," inactive");
                }, false);
            }
        }
        
        console.log("Global event listeners added.");
    },
    
    onDeviceReady: function() {
        console.log("DEVICE READY!");
        
        var muted;
        
        isApp = !((typeof device)=="undefined");
        
        //Highscores
        if(LocalStorageCheck()){
            if(typeof localStorage["highscore"] == "undefined"){
                localStorage["highscore"] = "00:00:00.00";
            }
            
            if(typeof localStorage["muted"] == "undefined"){
                localStorage["muted"] = "false";
            }

            highscore = localStorage["highscore"];
            muted = JSON.parse(localStorage["muted"]);
            
            console.log("LocalStorage enabled. Currrent highscore: "+localStorage["highscore"]);
        }
        else{
            console.log("LocalStorage "+LocalStorageCheck(specific));
        }
        
        //Game Start
        document.getElementById("splashScreen").className += " disappear";
        document.getElementById("instructionsSplashScreen").className += " disappear";
    
        var gArgs = {
            "gameMuted":muted
        };
        
        game = new Game(gArgs);
        game.start();
        
        if(isApp){
            document.addEventListener("pause", function(){ //when app moves to background
                game.togglePause(true);
            }, false);
            document.addEventListener("resume", function(){ //when app moves back to background
                //this.togglePause(false);
            }, false);
        }
        else{
            window.addEventListener("blur", function(){ //when window is off-focus
                game.audio["mainMusic"].pause();
                //game.audio["mainMusic"].release();
                game.togglePause(true);
            }, false);
            window.addEventListener("focus", function(){ //when app window is in focus
                //game.togglePause(false);
            }, false);
        }        
    }
};

function Game(_args){
    if(_args == null){
        _args = {};    
    }
    
    var self = this;
    
    //Canvas
    this.canvas = null;
    this.canvasRatio = 16/9; // width:height | 16:9 since most screens are of this resolution.
    this.canvasWidth;
    this.canvasHeight;
    this.oldCanvasWidth = null;
    this.oldCanvasHeight = null;
    
    //Scores
    this.score = 0;
    
    //Others
    this.gamePaused = false;
    this.gameMuted = false;
    this.gameOver = false;
    
    this.scoreTimer;
    this.timer;
    this.refreshTimer;
    this.pauseTimer;
    this.timePaused = 0;
    
    //Controls
    this.controls = {
        "back_run":[65,37],
        "run":[83,40],
        "sprint":[68,39],
        "game_over":[32,13],
        "game_pause":[80],
        "game_mute":[77]
    };
    
	this.isButtonPressed = {
		"running":false,
		"backRunning":false,
		"sprinting":false
	};
    
    this.isKeyDown = {};
    
    //Audio
    this.audio = {};
    
    //Obstacles
    this.obstacleArray = [];
    this.firstObstacle = true;
    this.obstacleTimer = new Date().getTime();
    this.obstaclesReloadTime = 800; //ms
    this.obstacleWidth = 7; //percent of canvas width
    
    //Buttons & Misc
    this.flagEle;
    this.sprintBar;
    this.scoreDiv;
    this.pauseBtn;
    this.volBtn;
    this.backBtn;
    this.infoBtn;
    
    this.gameBtns = [];
    this.gameBtnWidth = 15; //percent of canvas width
        
    //Player
    this.treadmill = {
        speed: 5, //percentage of canvas width per "run" [35]
        img: null
    };
    
    this.hero = {
        x:0,
        y:0,
        width:430,
        height:307,
        hwratio:0,
        pwidth: 10, //percentage width relative to canvas
        
        sprintLevel: 100,
        sprintSpeed: 1.8, //multiplier
        sprinting: false,
        sprintReload: {"time":100,"add":0.1}, //milliseconds
        backRunningSpeed: 0.8,
        backRunning: false,
        
        animations:{
            "runAnimations":true,
            "spritesheet":"url('img/hero_spritesheet.png')",
            "totalWidth":30,
            
            "names":["still","running","sprinting","backRunning"],
            
            "still":{
                "total_frames":1,
                "id":0
            }, 
            "running":{
                "current_frame":0,
                "total_frames":30,
                "id":3 //for some reason, if id=1, does not register for mobile??!
            },
            "sprinting":{
                "current_frame":0,
                "total_frames":18,
                "id":2
            }, 
            "backRunning":{
                "current_frame":0,
                "total_frames":30,
                "id":3
            }
        },
        
        portalsPassed:0,
        scoreMultiplier:1.5,
        
        speed: 20, //percentage of canvas width per "run" [100]
        running: false,
        holder: null,
        img: null,
        destroy: function(){
            this.holder.style.opacity = 0;
		}
    };
    
    this.start = function(){
        //Allow arguments to override default
        if(_args["hero"]!=null)
            this.hero = _args["hero"];
        
        if(_args["treadmill"]!=null)
            this.treadmill = _args["treadmill"];
        
        if(_args["controls"]!=null)
            this.canvasHeight = _args["controls"];
        
        if(_args["obstaclesReloadTime"]!=null)
            this.obstaclesReloadTime = _args["obstaclesReloadTime"];
        
        if(_args["obstacleWidth"]!=null)
            this.obstacleWidth = _args["obstacleWidth"];
        
        if(_args["canvasRatio"]!=null)
            this.canvasRatio = _args["canvasRatio"];
        
        if(_args["canvasWidth"]!=null)
            this.canvasWidth = _args["canvasWidth"];
        
        if(_args["canvasHeight"]!=null)
            this.canvasHeight = _args["canvasHeight"];   
        
        if(_args["audio"]!=null)
            this.audio = _args["audio"];   
        
        if(_args["gameMuted"]!=null)
            this.gameMuted = _args["gameMuted"];   
        
        //Controls & Event Listeners
        for(var i in this.controls)
            if(this.controls.hasOwnProperty(i))
                for(var j=0;j<this.controls[i].length;j++)
                    this.isKeyDown[this.controls[i][j]] = false;

        //Canvas
        this.canvas = document.getElementById("game_canvas");
        window.addEventListener("resize",
            function(){
                self.canvasResize(self);
            }
        );
        
        document.getElementById("splashScreen").className = document.getElementById("splashScreen").className.replaceAll(" appear"," disappear");
                
        self.sprintBar = document.getElementById("sprintlevel");
        self.scoreDiv = document.getElementById("scoreDiv");
        
        //Hero Holder + Img init
        self.hero.hwratio = self.hero.height/self.hero.width;
        
        self.hero.holder = document.getElementById("game_player");
        self.hero.img = self.hero.holder.getElementsByClassName("img")[0];
        
        self.hero.holder.style.opacity = 1;
        
        self.treadmill.img = document.getElementById("game_treadmill");
        
        if(MobileAndTabletCheck()){
            //No treadmill animations
            self.treadmill.img.animationPlayState = "paused";
        }
        else{
            self.treadmill.img.animationPlayState = "running";
        }
        
        //Game Buttons
        self.gameBtns = document.getElementsByClassName("game_button");
        
        var leftBtns = document.getElementById("game_menu").getElementsByClassName("button");
        
        self.backBtn = leftBtns[0];
        self.infoBtn = leftBtns[1];
        self.pauseBtn = document.getElementsByClassName("pause-btn")[0];
        self.volBtn = document.getElementsByClassName("vol-btn")[0];
        
        //Set Canvas
        self.canvasResize(self);
        
        //Set hero stats (after resize)        
        self.hero.x = self.canvasHeight/2-self.hero.width/2;
        self.hero.y = self.canvasHeight*0.9-self.hero.height;
        
        //First Init
        //Do not start timer; show controls; set audio
        if(firstInit){
            //Start audio
            self.audio["mainMusic"] = new Music("mainMusic",true,true);
            self.audio["mainMusic"].setVolume(0.3);
                
            if(self.gameMuted){
                self.gameMuted = false;
                self.toggleMute();
            }
            else{
                self.audio["mainMusic"].play();
            }
            
            //Make instructions splash screen appear
            document.getElementById("instructionsSplashScreen").className = document.getElementById("instructionsSplashScreen").className.replaceAll(" disappear"," appear");
            
            if(MobileAndTabletCheck()){
                //Content is different for mobile
                var eleArr = document.getElementById("instructionsSplashScreenHolder").getElementsByTagName("div")[0].getElementsByTagName("div");
                
                eleArr[1].innerHTML = "<h2>CONTROLS</h2>";
                eleArr[1].innerHTML+= 'Move with the <span class="icon-run-backwards"></span>, <span class="icon-run"></span> and <span class="icon-sprint"></span> buttons<br>(<span class="icon-sprint"></span> and <span class="icon-run-backwards"></span> consume energy)</i>';
                
                eleArr[2].innerHTML = "<h3>-- TAP TO START --</h3>";     
              
                //Mobile needs a tap event listener for continue
                document.getElementById("instructionsSplashScreen").addEventListener("touchend",game.restartGame);
                
                //Mobile circle & content needs to be smaller
                var eleArrHolder = [];
                eleArrHolder[0] = document.getElementById("instructionsSplashScreenHolder");
                eleArrHolder[1] = document.getElementById("instructionsSplashScreenHolder").getElementsByClassName("center")[0];
                
                eleArrHolder[0].style.width = "280px";
                eleArrHolder[0].style.height = "280px";
                
                eleArrHolder[1].style.width = "250px";
                eleArrHolder[1].style.height = "190px";
                
            }
    
            return;
        }
        
        document.getElementById("instructionsSplashScreen").className = document.getElementById("instructionsSplashScreen").className.replaceAll(" appear"," disappear");
        
        //Timer & Tick
        this.timer = new Date().getTime();
        this.scoreTimer = new Date().getTime();
        this.refreshTimer = new Date().getTime();
        
        this.tick();
        
        console.log("Let the games begin.");
    };
    
    this.canvasResize = function(obj){
        if(obj.oldCanvasHeight == null && obj.oldCanvasWidth == null){
            obj.oldCanvasWidth = document.body.clientWidth;
            obj.oldCanvasHeight = document.body.clientHeight;
        }
        
        //Resize Canvas        
        obj.canvas.style.width = document.body.clientWidth + "px";
        obj.canvas.style.height = document.body.clientWidth/obj.canvasRatio +"px";
        
        if(parseFloat(obj.canvas.style.height) >= document.body.clientHeight){
            obj.canvas.style.height = document.body.clientHeight + "px";
            obj.canvas.style.width = document.body.clientHeight*obj.canvasRatio +"px";
        }
        
        obj.oldCanvasWidth = obj.canvasWidth;
        obj.oldCanvasHeight = obj.canvasHeight;
        
        obj.canvasWidth = parseFloat(obj.canvas.style.width);
        obj.canvasHeight = parseFloat(obj.canvas.style.height);
        
        //Change x & y coords of objects accordingly
        for(var i=0;i<obj.obstacleArray.length;i++){
            var obs = obj.obstacleArray[i];
            
            obs.x /= obj.oldCanvasWidth/obj.canvasWidth;
            obs.y /= obj.oldCanvasHeight/obj.canvasHeight;
            obs.updateWidthHeight();
        }
        
        obj.hero.x /= obj.oldCanvasWidth/obj.canvasWidth;
        obj.hero.y /= obj.oldCanvasHeight/obj.canvasHeight;
        
        obj.hero.img.style.width = obj.canvasWidth*(obj.hero.pwidth/100)+"px";
        obj.hero.holder.style.width = obj.hero.img.style.width;
        
        obj.hero.width = parseFloat(obj.hero.holder.style.width);
        obj.hero.height = obj.hero.width*obj.hero.hwratio;
        
        obj.hero.img.style.height = obj.hero.height+"px";
        obj.hero.img.style.backgroundSize = (obj.hero.width*obj.hero.animations.totalWidth)+"px "+(obj.hero.height*obj.hero.animations.names.length)+"px";
        
        //Load all spritesheets first
        obj.hero.img.style.backgroundImage = obj.hero.animations.spritesheet;
        
        obj.hero.img.style.backgroundPositionX = "0px";
        obj.hero.img.style.backgroundPositionY = (obj.hero.height*obj.hero.animations["still"].id)+"px";
        
        
        
        //Game button resize
        for(var i=0;i<obj.gameBtns.length;i++){
            var gBtn = obj.gameBtns[i];
            gBtn.style.fontSize = obj.canvasWidth*obj.gameBtnWidth*0.6/100+"px";
            gBtn.style.padding = obj.canvasWidth*obj.gameBtnWidth*0.15/100+"px";
            
            gBtn.parentElement.style.height = obj.canvasWidth*obj.gameBtnWidth*0.8/100+"px";
        }
    }
    
    this.render = function () {
        //OBSTACLES
        var ob;

        for(var i=0;i<self.obstacleArray.length;i++){
            //if(!self.obstacleArray.hasOwnProperty(i)) return;
            ob = self.obstacleArray[i];
            
            ob.img.style.left = ob.x + "px";
            ob.img.style.top = ob.y + "px";
        }
        
        //PLAYER
        var plyr = self.hero;
        
        plyr.holder.style.left = plyr.x + "px";
        plyr.holder.style.top = plyr.y + "px";
        
        self.sprintBar.style.width = plyr.sprintLevel+"%";
        
        if(!self.gamePaused){
            var delta = new Date().getTime() - self.scoreTimer - self.timePaused +plyr. portalsPassed*plyr.scoreMultiplier*60000;
            var seconds = parseFloat((delta/1000)%60).toFixed(2);
            if(seconds<10){
                seconds = "0"+seconds;   
            }
            var minutes = Math.floor(delta/60000)%60;
            if(minutes<10){
                minutes = "0"+minutes;   
            }
            var hours = Math.floor(delta/3.6E6)%60;
            if(hours<10){
                hours = "0"+hours;   
            }
            
            self.score = hours+":"+minutes+":"+seconds;
            self.scoreDiv.innerHTML = self.score;
            
            var delta = new Date().getTime() - self.refreshTimer;
            if(delta>=plyr.sprintReload["time"]){
                self.refreshTimer = new Date().getTime();
                plyr.sprintLevel+=plyr.sprintReload["add"];
            }
        }
        
        //TREADMILL ANIMATIONS
        self.treadmill.img.style.animationDuration = (2/self.treadmill.speed)+"s";
    };
    
    this.movePlayer = function(mod){
        var plyr = self.hero;
        var overallSpd = -self.treadmill.speed*mod;

        //Turn off Animations for Mobile App because of lag.
        //if(isApp) self.hero.animations.runAnimations = false;
        
        var _pos; //for animations        
        
        if(plyr.sprinting){
            if(plyr.sprintLevel>0){
                overallSpd += plyr.speed*plyr.sprintSpeed*mod;
                plyr.sprintLevel--;
            }
            else{
                overallSpd += plyr.speed*mod;
            }
           
            if(plyr.animations.runAnimations){
                //Animations
                plyr.animations["sprinting"].current_frame+=1;
                _pos = (plyr.animations["sprinting"].current_frame)%(plyr.animations["sprinting"].total_frames);

                plyr.img.style.backgroundPositionY = (plyr.height*plyr.animations["sprinting"].id)+"px";
                plyr.img.style.backgroundPositionX = "-"+(_pos*plyr.width)+"px";
            }
        }
        else if(plyr.backRunning){
            if(plyr.sprintLevel>0){
                overallSpd -= plyr.speed*plyr.backRunningSpeed*mod;
                plyr.sprintLevel--;
            }
            else{
                overallSpd -= plyr.backRunningSpeed*mod;
            }
            
            //Animations
            if(plyr.animations.runAnimations){
                plyr.animations["backRunning"].current_frame+=1;
                _pos = (plyr.animations["backRunning"].current_frame)%(plyr.animations["backRunning"].total_frames);

                plyr.img.style.backgroundPositionY = (plyr.height*plyr.animations["backRunning"].id)+"px";
                plyr.img.style.backgroundPositionX = "-"+(_pos*plyr.width)+"px";
            }
            
        }
        else if(plyr.running){
            overallSpd += plyr.speed*mod;
         
            //Animations
            if(plyr.animations.runAnimations){
                plyr.animations["running"].current_frame+=1;
                _pos = (plyr.animations["running"].current_frame)%(plyr.animations["running"].total_frames);

                plyr.img.style.backgroundPositionY = ((plyr.height)*(plyr.animations["running"].id))+"px";
                plyr.img.style.backgroundPositionX = "-"+(_pos*plyr.width)+"px";
            }
            
        }
        else{
            //Reset to Still 
            plyr.img.style.backgroundPositionX = "0px";
            plyr.img.style.backgroundPositionY = (plyr.height*plyr.animations["still"].id)+"px";
            
            for(var i=0;i<plyr.animations.names.length;i++){ //reset all frames
                var _name = plyr.animations.names[i];
                
                plyr.animations[_name].current_frame = 0;
            }
            
            plyr.sprintLevel += 0.1;    
        }
        
        plyr.sprintLevel = Math.max(Math.min(100,plyr.sprintLevel),0);
        plyr.x += (overallSpd/100)*game.canvasWidth;
    };
    
    this.moveObstacles = function(mod){
        var ob;
        for(var i=0;i<self.obstacleArray.length;i++){
            if(!self.obstacleArray.hasOwnProperty(i)) return;
            
            ob = self.obstacleArray[i];

            //Move Obstacle
            if(ob.type == 0){
                ob.x += ((ob.speed*mod)/100)*game.canvasHeight;   
                ob.speed += ob.acc;
            }
            else{
                ob.y += ((ob.speed*mod)/100)*game.canvasHeight;
                ob.speed += ob.acc;
            }

            //Check for Gameover
            // * Check for obstacle out of stage
            if(ob.x<0 || ob.y>self.canvasHeight){
                ob.destroy();
            }
            
            // * Centered Player & Obstacle Co-ordinates
            obx = ob.x+ob.width/2; 
            oby = ob.y+ob.height/2;
            
            plyrx = self.hero.x+self.hero.width/2;
            plyry = self.hero.y+self.hero.height/2;
            
            //console.log(ob.img.getElementsByTagName("img")[0]);
            
            if(Math.abs(obx-plyrx)<=(ob.width+self.hero.width-ob.hitTestPadX)/2 && Math.abs(oby-plyry)<=(ob.height+self.hero.height-ob.hitTestPadY)/2){ //hittest with player
                self.game_over(false);
            }
        }
    };
    
    this.generateObstacles = function(){
        var self = this;
        
        var d = new Date().getTime();
        
        if(!self.firstObstacle) if(Math.abs(d-self.obstacleTimer)<=self.obstaclesReloadTime) return;
        
        var plyrx = self.hero.x+self.hero.width/2;
        
        var t = Math.random()<0.95;
        var w = self.canvasWidth*(self.obstacleWidth/100);
        var h = w;
        var range = w*4; //maximum range away from center of player
        var pad = 10;

        if(!t){
            //Bottom Spike
            //self.obstacleArray.push(new Obstacle(t,w+self.canvasWidth,self.canvasHeight-h));
        }
        else{ //Staglamite
            if(Math.random()<0.3) dir=-1; else dir = 1; //choose whether spike is behind or in front of player
            var r = dir*rand(0,range)+plyrx; //make it such that it's near to the player positon (muhaha)
            r = Math.min(self.canvasWidth-w, Math.max(w,r)); //ensure still within range
            
            self.obstacleArray.push(new Obstacle(t,r,-h-pad));
        }    
        
        self.obstacleTimer = new Date().getTime();
        self.firstObstacle = false;
    }
    
    this.tick = function(){
        if(self.gameOver){
            self.game_over();
            return;
        }
        var now = new Date().getTime();
        var delta = now - self.timer;
        self.timer = now;
        
        if(!self.gamePaused){            
            //Check keyPresses
            
			//FOR RUNNING
            self.hero.running = false;
            for(var j=0;j<self.controls["run"].length;j++)
                if(self.isKeyDown[self.controls["run"][j]]){
                    self.hero.running = true;
                }
			if(self.isButtonPressed["running"]) self.hero.running = true;
			
			//FOR BACKRUNNING
            self.hero.backRunning = false;
            for(var j=0;j<self.controls["back_run"].length;j++)
                if(self.isKeyDown[self.controls["back_run"][j]]){
                    self.hero.backRunning = true;
                }
			if(self.isButtonPressed["backRunning"]) self.hero.backRunning = true;
			           
			//FOR SPRINTING
            self.hero.sprinting = false;
            for(var j=0;j<self.controls["sprint"].length;j++)
                if(self.isKeyDown[self.controls["sprint"][j]]){
                    self.hero.sprinting = true;
                }
			if(self.isButtonPressed["sprinting"]) self.hero.sprinting = true;
            
            self.movePlayer(delta/ 1000);
            self.moveObstacles(delta/ 1000);
            self.render();
            
            //Check for gameover by offscreen
            //NOTE: Gameover by obstacle is in moveObstacles function
            if(self.hero.x<=-self.hero.width){
                self.game_over();
                return;
            }
            
            //Check for win status
            if(self.hero.x>=self.canvasWidth-self.hero.width){
                self.game_over(true);
                return;
            }
            
            self.generateObstacles(); //Constantly generate obstacles
        }
        else if(MobileAndTabletCheck()){
            //Pressing the game buttons while paused will unpause the game.
            
			if(self.isButtonPressed["running"] || self.isButtonPressed["backRunning"] || self.isButtonPressed["sprinting"]) 
                game.togglePause();
        }
        
        if(!self.gameOver) requestAnimationFrame(self.tick);
    };
    
    this.togglePause = function(forcedPauseState){
        if(self.gameOver) return; //disable pausing once game over
        
        self.gamePaused = (typeof forcedPauseState == "undefined")?!self.gamePaused:forcedPauseState;
        
        if(self.gamePaused){
            self.pauseTimer = new Date().getTime();
            
            self.pauseBtn.innerHTML = "play_arrow";
            
            self.audio["mainMusic"].pause();
            
            //Pause CSS Animations
            for(var i=0;i<self.obstacleArray.length;i++){
                self.obstacleArray[i].img.style.animationPlayState = "paused";
            }
            self.treadmill.img.style.animationPlayState = "paused";
        }
        else if(!self.gamePaused){
            var now = new Date().getTime();
            self.timePaused += now-self.pauseTimer;
            
            self.pauseBtn.innerHTML = "pause";
            
            if(!self.gameMuted) self.audio["mainMusic"].play();
            
            //Play CSS Animations
            for(i=0;i<self.obstacleArray.length;i++){
                self.obstacleArray[i].img.style.animationPlayState = "running";
            }
            if(!MobileAndTabletCheck() && !isApp){
               self.treadmill.img.style.animationPlayState = "running";
            }
        }
    };
    
    this.toggleMute = function(forcedMuteState){
        self.gameMuted = (typeof forcedMuteState == "undefined")?!self.gameMuted:forcedMuteState;
        
        if(self.gameMuted){
            self.audio["mainMusic"].pause();
            self.volBtn.innerHTML = "volume_off";
        }
        else{
            self.audio["mainMusic"].play();
            self.volBtn.innerHTML = "volume_up";
        }
        
        if(LocalStorageCheck())
            localStorage["muted"] = JSON.stringify(self.gameMuted);
    };
    
    this.upLevel = function(){
        self.hero.portalsPassed+=1;
            
        self.hero.sprintLevel += Math.max(25*Math.pow(0.9,self.hero.portalsPassed),10);

        self.obstaclesReloadTime *= 0.9-0.01*self.hero.portalsPassed;
        self.obstaclesReloadTime = Math.max(self.obstaclesReloadTime,250);
        self.treadmill.speed *= 1.2;
        self.treadmill.speed = Math.min(self.treadmill.speed,self.hero.speed*0.5);
    };
    
    this.game_over = function(win){
        self.firstObstacle = true;
        self.gameOver = true;
        
        if(typeof win == "undefined") win = false;
        
        //Destroy everything
        while(self.obstacleArray.length){
               self.obstacleArray[0].destroy();
        }
        
        self.hero.destroy();
        
        if(win){
            console.log("Keep Going!");
            console.log("Score: "+self.score);    
            
            self.gameOver = false;
            
            self.upLevel();
            self.start();
            
            return;
        }
        
        console.log("-----GAME OVER-----");
        console.log("Score: "+self.score);
            
        if(convertTimeToInt(self.score)>convertTimeToInt(highscore)){
            highscore = self.score;
            if(LocalStorageCheck()) localStorage["highscore"] = highscore;
        }
        
        /*--------New Game Screen--------*/
        //Make splash screen appear
        if(!firstInit) document.getElementById("splashScreen").className = document.getElementById("splashScreen").className.replaceAll(" disappear"," appear");
        
        //Update scores
        document.getElementById("splashScreenScore").innerHTML = "<b class='bold'>Score: </b>"+self.score+"<br><b class='bold'>Highscore: </b>"+highscore;
        
        //Update Try Again info
        document.getElementsByClassName("splashScreenInfo")[0].innerHTML = 
        (MobileCheck())?"<b>-- Tap to Try Again --</b>":"-- Space to Try Again --";
        
        //Add tap event listener
        if(MobileAndTabletCheck()) document.getElementById("splashScreen").addEventListener("touchend",game.restartGame);
    };
    
    this.restartGame = function(){
        document.getElementById("splashScreen").className = document.getElementById("splashScreen").className.replaceAll(" appear"," disappear");
        
        document.getElementById("instructionsSplashScreen").className = document.getElementById("instructionsSplashScreen").className.replaceAll(" appear"," disappear");

        if(MobileAndTabletCheck()){
            document.getElementById("splashScreen").removeEventListener("touchend",game.restartGame);    
          
            if(firstInit)       document.getElementById("instructionsSplashScreen").removeEventListener("touchend",game.restartGame);
        }
        
        firstInit = false;
        
        self.pauseBtn.innerHTML = "pause";
        
        var gArgs = {
            "audio":game.audio,
            "gameMuted":game.gameMuted
        }
        
        game = new Game(gArgs);
        game.start();
    };
};

var Obstacle = function(_type,_x,_y,_args){
    /* Obstacles
     * 0: Spikes
     * 1: Staglamite
    //*/
    
    var self = this;
    
    this.type = _type;
    this.x = _x;
    this.y = _y;
    this.args = (typeof _args == "undefined")?{}:_args;
    
    if(typeof this.args["hitTestPadX"] == "undefined") this.args["hitTestPadX"] = 10;
    if(typeof this.args["hitTestPadY"] == "undefined") this.args["hitTestPadY"] = 10;
    
    this.hitTestPadX = this.args["hitTestPadX"];
    this.hitTestPadY = this.args["hitTestPadY"];
    
    this.updateWidthHeight = function(updateImg){
        if(typeof updateImg == "undefined") updateImg = true;
        
        self.width = game.canvasWidth*(game.obstacleWidth/100);
        self.height = self.width;
        
        if(updateImg){
            self.img.getElementsByTagName("img")[0].width = self.width;
            self.img.getElementsByTagName("img")[0].height = self.height;
        }
    }
    
    this.updateWidthHeight(false);
    
    this.multiplier = 1;
    
    this.destroyed = false;
    
    //Create div element
    var obs_ele = document.createElement("div");
    obs_ele.className = "obstacle ";
    
    if(!this.type){
        obs_ele.className += "spike";
    }
    else{
        obs_ele.className += "spike_top";
    }

    obs_ele.style.width = this.width + "px";
    obs_ele.style.height = this.height + "px";
    
    obs_ele.style.top = _y+"px";
    obs_ele.style.left = _x+"px";
    
    document.getElementById("game_canvas").appendChild(obs_ele);
    
    this.img = obs_ele;

    //Set Speed
    if(this.type){
        this.speed = 0;
        this.acc = 0.5;
    }
    else{
        this.speed = -game.treadmill.speed*this.multiplier;
        this.acc = 0;
    }
    
    this.destroy = function(){
        self.destroyed = true;
        self.img.parentElement.removeChild(self.img);
        game.obstacleArray.removeItem(self);
    }
}

function convertTimeToInt(str){
    var t = str.split(":");
    var ts = t[2].split(".");
    
    return parseInt(t[0])*60*60*1000+parseInt(t[1])*60*1000+parseInt(ts[0])*1000+parseInt(ts[1]);
}

/*------------------AUDIO-------------------*/
var Music = function(name,loop,addToPage){
    this.audioObj = null;
    
    //Initialisation
    this.prevPosition = 0;
    this.prevVolume = 1;
    this.loop = (typeof loop == "undefined")?true:loop;
    this.addToPage = ((typeof addToPage == undefined) || isApp)?false:addToPage;
    
    this.init = function(){
        if(isApp){
            var src = ((device.platform.toLowerCase() === "android")?"/android_asset/www/":"")+("audio/"+name+".mp3");
            
            this.audioObj = new Media(src,null,null,this.mediaStatus);
        }
        else{
            var a = document.createElement("audio");
            a.id = "audio_"+name;
            a.loop = true;

            var fileSuffix = ["mp3","ogg","wav"];

            for(i=0;i<fileSuffix.length;i++){
                var s = document.createElement("source");
                s.src = "audio/"+name+"."+fileSuffix[i];
                a.appendChild(s);
            }
            
            this.audioObj = a;

            if(addToPage){
                document.body.appendChild(a);    
                a.load();
            }
        }
    };

    this.init();
    
    this.play = function(){
        //Reset to previous values
        if(isApp){
            this.audioObj.seekTo(this.prevPosition);
            this.audioObj.setVolume(this.audioObj.getCurrentAmplitude);
        }        
        else{
            this.audioObj.volume = this.prevVolume;
            this.audioObj.currentTime = this.prevPosition;
        }
        
        if(isApp) this.audioObj.play({ playAudioWhenScreenIsLocked : false })
        else this.audioObj.play();
    };
    
    this.pause = function(){
        this.audioObj.pause();
    };
    
    this.stop = function(){
        //Save previous values first in case we need it.
        if(isApp){
            this.prevPosition = this.audioObj.getCurrentPosition;
            this.prevVolume = this.audioObj.getCurrentAmplitude;
        }        
        else{
            this.prevVolume = this.audioObj.volume;
            this.prevPosition = this.audioObj.currentTime;
        }
        
        this.audioObj.stop();
        this.release();
    }
    
    this.release = function(){
        if(isApp) this.audioObj.release();
    }
    
    this.destroy = function(){
        this.release();
        
        if(!isApp) this.audioObj.parentNode.removeChild(this.audioObj);
    }
    
    this.setVolume = function(vol){
        if(isApp) this.audioObj.setVolume(vol);
        else this.audioObj.volume = vol;
        
        this.prevVolume = vol;
    }
    
    this.mediaStatus = function(){ //only for cordova
        if(!isApp) return;
        
        if(status === Media.MEDIA_STOPPED && this.loop){
            this.audioObj.seekTo(0);
            this.audioObj.play({ playAudioWhenScreenIsLocked : false });
        }
    }
}


//*--------RANDOM UNIVERSAL FUNCTIONS--------*//
function MobileCheck() {
    if(isApp) return true;
    
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function MobileAndTabletCheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function LocalStorageCheck(specific){
    if(specific == null) specific = false;
    
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem('feature_test', 'yes');
            if (localStorage.getItem('feature_test') === 'yes') {
                localStorage.removeItem('feature_test');
                
                return (specific) ? "enabled" : true;
            } else {
                return (specific) ? "disabled" : false;
            }
        } catch(e) {
            return (specific) ? "disabled" : false;
        }
    } else {
        return (specific) ? "unavailable" : false;
    }
}
    
Array.prototype.removeItem = function(item){
    var ind = this.indexOf(item);
    if(ind!=-1) this.splice(ind,1);
}

Image.prototype.resize = function(w,h){
    var r = this.width/this.height;
    if(w==-1){
        this.height = h;
        this.width = h*r;
    }
    else if(h==-1){
        this.width = w;
        this.height = w/r;
    }
    else{
        this.width = w;
        this.height = h;
    }
}

function rand(lw,hg){
    var randNo = Math.floor(Math.random()*(1+hg-lw))+lw;
	return randNo;
}

String.prototype.replaceAll = function(find,rep){
    return this.split(find).join(rep);
}
    
app.initialize();