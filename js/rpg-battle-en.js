//Log window with output messages
var view = {
	logLutiy: function(move){
		var message = document.getElementById("message");
		message.innerHTML += "<div><span class='messages__nameLutiy'>Lutiy</span> is attacking! He used an ability: " + 
		"<span class='messages__moveName'>" + move.name + "</span></div>";
		scrollDown(message);
	},

	logEvstafiy: function(move){
		var message = document.getElementById("message");
		message.innerHTML += "<div><span class='messages__nameEvstafiy'>Evstafiy</span> have responded! He used an ability: " + 
		"<span class='messages__moveName'>" + move.name + "</span></div>";
		scrollDown(message);
	},

	logDamage: function(damageLutiy, damageEvstafiy){
		var message = document.getElementById("message");
		var str1 = "<div class='messages__damage'><span class='messages__nameLutiy'>Lutiy</span> did " + damageLutiy + " damage. ";
		var str2 = "<span class='messages__nameEvstafiy'>Evstafiy</span> did " + damageEvstafiy + " damage.</div>";
		message.innerHTML += str1 + str2;
		scrollDown(message);
	},

	logWinner: function(winnerMessage){
		var message = document.getElementById("message");
		message.innerHTML += winnerMessage;
		scrollDown(message);
	}
};

function scrollDown(message){
	message.scrollTop = message.scrollHeight;
}

const lutiy = {
	name: "Lutiy",
	maxHealth: 10,
	healthTemp: 10,
	moves: [
		{
			name: "Strike with a clawed paw",
			physicalDmg: 3, // physical damage
            magicDmg: 0,    // magic damage
            physicArmorPercents: 20, // physical armor 
            magicArmorPercents: 20,  // magic armor 
		},
		{
			name: "Fiery breath",
            physicalDmg: 0,
            magicDmg: 4,
            physicArmorPercents: 10,
            magicArmorPercents: 10,
		},
		{
			name: "Tail kick",
            physicalDmg: 5,
            magicDmg: 0,
            physicArmorPercents: 40,
            magicArmorPercents: 0,
		}
	],

	/*Custom choosing abilities of Lutiy method*/
	pickLutiy: function(){
		var index = Math.floor(Math.random() * this.moves.length);
		view.logLutiy(this.moves[index]);
		lutiy.moveLutiy = this.moves[index];
	}
};

const evstafiy = {
	name: "Evstafiy",
	maxHealth: 10,
	healthTemp: 10,
	moves: [
		{
            name: "Attack with a fighting staff",
            physicalDmg: 3,
            magicDmg: 0,
            physicArmorPercents: 10,
            magicArmorPercents: 50,
        },
        {
            name: "Left foot kick",
            physicalDmg: 4,
            magicDmg: 0,
            physicArmorPercents: 10,
            magicArmorPercents: 40,
        },
        {
            name: "Huge fireball",
            physicalDmg: 0,
            magicDmg: 4,
            physicArmorPercents: 30,
            magicArmorPercents: 10,
        },
        {
            name: "Magic shield",
            physicalDmg: 0,
            magicDmg: 0,
            physicArmorPercents: 100,
            magicArmorPercents: 100,
        }
	],

	//Choosing one of the list of Evstafiy's abilities
	pickEvstafiy: function(){
		var actions = document.getElementById("actions-list");
		var tagSpan = document.getElementsByClassName("messages__winner")[0];

		if(tagSpan){
			for(var i=0; i<actions.childElementCount; i++){
				actions.children[i].innerHTML += "<span class='actions__noSelection'>(unavailable)</span>";
			} 
			actions.onclick = noSelection; 
		}
		else{
			actions.onclick = chooseOption; 
		}
	}
};

function chooseOption(e){
	var actions = document.getElementById("actions-list");
	for(var i=0; i<actions.childElementCount; i++){
		if(e.target.innerHTML == actions.children[i].innerHTML){
			view.logEvstafiy(evstafiy.moves[i]);
			evstafiy.moveEvstafiy = evstafiy.moves[i];

			battle.makingDamage(lutiy.moveLutiy, evstafiy.moveEvstafiy);
		}
	}
}

function noSelection(e){
	//console.log("Game over!");
}

var battle = {
	moveCount: 0,
	makingDamage: function(moveLutiy, moveEvstafiy){
		//Damage(physical), that Lutiy makes, is blocking with % from Evstafiy's armor
		var damagePhysLutiy = moveLutiy.physicalDmg - ((moveEvstafiy.physicArmorPercents * moveLutiy.physicalDmg) / 100);
		var damagePhysEvstafiy = moveEvstafiy.physicalDmg - ((moveLutiy.physicArmorPercents * moveEvstafiy.physicalDmg) / 100);

		//Same with magic damage
		var damageMagLutiy = moveLutiy.magicDmg - ((moveEvstafiy.magicArmorPercents * moveLutiy.magicDmg) / 100);
		var damageMagEvstafiy = moveEvstafiy.magicDmg - ((moveLutiy.magicArmorPercents * moveEvstafiy.magicDmg) / 100);

		var damageTotalLutiy = damagePhysLutiy + damageMagLutiy;
		var damageTotalEvstafiy = damagePhysEvstafiy + damageMagEvstafiy;

		this.reduceHealthBar(damageTotalLutiy, damageTotalEvstafiy);

		//Reducing of health
		lutiy.maxHealth = lutiy.maxHealth - damageTotalEvstafiy;
		evstafiy.maxHealth = evstafiy.maxHealth - damageTotalLutiy;
		this.drawHealthBars();
		this.zeroHealthBar(lutiy.hpObject, evstafiy.hpObject);

		view.logDamage(damageTotalLutiy, damageTotalEvstafiy);
		
		this.moveCount++;
		this.checkEndGame();
	},

	reduceHealthBar: function(damageLutiy, damageEvstafiy){
		lutiy.hpObject = document.getElementById("health-lutiy");
		lutiy.hpValue = parseInt(window.getComputedStyle(lutiy.hpObject).width);
		evstafiy.hpObject = document.getElementById("health-evstafiy");
		evstafiy.hpValue = parseInt(window.getComputedStyle(lutiy.hpObject).width);

		if(damageLutiy && damageEvstafiy){
			//Величина уменьшения в пикселях для полоски здоровья
			var reducedLutiy = lutiy.hpValue - ((damageEvstafiy * lutiy.hpValue) / lutiy.maxHealth);
			//console.log("Lutiy: " + reducedLutiy);
			lutiy.hpObject.style.width = reducedLutiy + "px";

			var reducedEvstafiy = evstafiy.hpValue - ((damageLutiy * evstafiy.hpValue) / evstafiy.maxHealth);
			//console.log("Evstafiy: " + reducedEvstafiy);
			evstafiy.hpObject.style.width = reducedEvstafiy + "px";
		}
	},

	//Checking health of players for reducing health bar
	zeroHealthBar: function(healthLutiy, healthEvstafiy){
		if(lutiy.maxHealth <= 0 && evstafiy.maxHealth <= 0){
			healthLutiy.style.width = "0";
			healthEvstafiy.style.width = "0";
		}
		else if(lutiy.maxHealth <= 0){
			healthLutiy.style.width = "0";
		}
		else if(evstafiy.maxHealth <= 0){
			healthEvstafiy.style.width = "0";
		}
	},

	drawHealthBars: function(){
		var lutiyObj = lutiy.hpObject;
		var evstafiyObj = evstafiy.hpObject;

		lutiyObj.ontransitionend = drawHealth; 
		evstafiyObj.ontransitionend = drawHealth; 
	},

	//Method of checking end of the game
	checkEndGame: function(){
		if(lutiy.maxHealth > 0 && evstafiy.maxHealth > 0){
			lutiy.pickLutiy();
			evstafiy.pickEvstafiy();
		}
		else if(lutiy.maxHealth <= 0 && evstafiy.maxHealth <= 0){
			var strRefresh = "<div><span class='messages__winner'>To begin a new game refresh the page</span></div>";
			var strWin = "<div><span class='messages__winner'>Nobody wins!</span></div>" + strRefresh;
			view.logWinner(strWin);

			evstafiy.pickEvstafiy();
		}
		else if(lutiy.maxHealth <= 0){
			var strRefresh = "<div><span class='messages__winner'>To begin a new game refresh the page</span></div>";
			var strWin = "<div><span class='messages__winner'>The winner is </span>" + evstafiy.name + "!</div>" + strRefresh;
			view.logWinner(strWin);

			evstafiy.pickEvstafiy();
		}
		else if(evstafiy.maxHealth <= 0){
			var strRefresh = "<div><span class='messages__winner'>To begin a new game refresh the page</span></div>";
			var strWin = "<div><span class='messages__winner'>The winner is </span>" + lutiy.name + "!</div>" + strRefresh;
			view.logWinner(strWin);

			evstafiy.pickEvstafiy();
		}
	}
};

function drawHealth(e){
	if(e.target.getAttribute("id") == "health-lutiy"){
		drawHealthLutiy();
	}
	else if(e.target.getAttribute("id") == "health-evstafiy"){
		drawHealthEvstafiy();
	}
}

function drawHealthLutiy(){
	if(lutiy.maxHealth <= lutiy.healthTemp/2 && lutiy.maxHealth > lutiy.healthTemp/4){
		lutiy.hpObject.setAttribute("class", "block-item__darker");
	}
	else if(lutiy.maxHealth <= lutiy.healthTemp/4){
		lutiy.hpObject.setAttribute("class", "block-item__red");
	}
}

function drawHealthEvstafiy(){
	if(evstafiy.maxHealth <= evstafiy.healthTemp/2 && evstafiy.maxHealth > evstafiy.healthTemp/4){
		evstafiy.hpObject.setAttribute("class", "block-item__darker");
	}
	else if(evstafiy.maxHealth <= evstafiy.healthTemp/4){
		evstafiy.hpObject.setAttribute("class", "block-item__red");
	}
}

var controller = {
	start: function(){
		var screen = document.getElementsByClassName("screen")[0];
		screen.style.zIndex = "-10";
		
		lutiy.pickLutiy();
		evstafiy.pickEvstafiy();
	}
}

window.onload = controller.start();