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
 //NOTE: For the mobile to work properly, we need to set forceIsApp to "true"
 //The web mobile version however, must have forceIsApp = false

 var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

 var Game;

var removeGameButtons = true;

var app = {
	// Application Constructor
	initialize: function() {
		Game = new SisyphusSheepGame();
		//Init Event Listeners

		this.bindEvents();
	},

	bindEvents: function() {
		if(MobileAndTabletCheck()){
			window.addEventListener('touchmove', function(e) {
				// Prevent scrolling
				e.preventDefault();
			}, { passive:false });

			_isMobile = true;
			console.log("Mobile device detected");
		}

		document.addEventListener('online', this.onConnectionChange.bind(this) );
		document.addEventListener('offline', this.onConnectionChange.bind(this) );

		if(isApp())
			document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		else
			window.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
	},

	onDeviceReady: function() {
		console.log((isApp())?"Device Ready!":"DOM Loaded...");

		//GPlay = new GooglePlayServices();

		FastClick.attach(document.body);
		Game.initStage();
	},

	onConnectionChange: function(e){
		if(e.type == "offline"){
			console.log("Oh no, you lost connection.");

			//GPlay.noConnection = true;
			Game.isOnline = false;
			Game.ads.updateButtons();
			Game.purchases.updateButtons();
		}
		else if(e.type == "online"){
			console.log("Yay! You are now back online!");

			//GPlay.noConnection = false;
			Game.isOnline = true;

			//Load Play Games and Ads
			if(!Game.isLoggedIn) Game.initPlayGames();
			if(!Game.ads.types["rewardvideo"].loaded) Game.ads.init();

			Game.ads.updateButtons();
			Game.purchases.updateButtons();
		}
	}
};

app.initialize();
