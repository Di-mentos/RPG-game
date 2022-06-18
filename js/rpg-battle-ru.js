//Вывод сообщений в окне лога
var view = {
	logLutiy: function(move){
		var message = document.getElementById("message");
		message.innerHTML += "<div><span class='messages__nameLutiy'>Лютый</span> атакует! Он использовал умение: " + 
		"<span class='messages__moveName'>" + move.name + "</span></div>";
		scrollDown(message);
	},

	logEvstafiy: function(move){
		var message = document.getElementById("message");
		message.innerHTML += "<div><span class='messages__nameEvstafiy'>Евстафий</span> отвечает! Он использовал умение: " + 
		"<span class='messages__moveName'>" + move.name + "</span></div>";
		scrollDown(message);
	},

	logDamage: function(damageLutiy, damageEvstafiy){
		var message = document.getElementById("message");
		var str1 = "<div class='messages__damage'><span class='messages__nameLutiy'>Лютый</span> нанёс " + damageLutiy + " урона. ";
		var str2 = "<span class='messages__nameEvstafiy'>Евстафий</span> нанёс " + damageEvstafiy + " урона.</div>";
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
	name: "Лютый",
	maxHealth: 10,
	healthTemp: 10,
	moves: [
		{
			name: "Удар когтистой лапой",
			physicalDmg: 3, // физический урон
            magicDmg: 0,    // магический урон
            physicArmorPercents: 20, // физическая броня; при получении урона часть его блокируется процентом брони от этого урона 
            magicArmorPercents: 20,  // магическая броня
		},
		{
			name: "Огненное дыхание",
            physicalDmg: 0,
            magicDmg: 4,
            physicArmorPercents: 10,
            magicArmorPercents: 10,
		},
		{
			name: "Удар хвостом",
            physicalDmg: 5,
            magicDmg: 0,
            physicArmorPercents: 40,
            magicArmorPercents: 0,
		}
	],

	/*Метод случайного выбора умений Лютого*/
	pickLutiy: function(){
		var index = Math.floor(Math.random() * this.moves.length);
		view.logLutiy(this.moves[index]);
		lutiy.moveLutiy = this.moves[index];
	}
};

const evstafiy = {
	name: "Евстафий",
	maxHealth: 10,
	healthTemp: 10,
	moves: [
		{
            name: "Удар боевым кадилом",
            physicalDmg: 3,
            magicDmg: 0,
            physicArmorPercents: 10,
            magicArmorPercents: 50,
        },
        {
            name: "Вертушка левой пяткой",
            physicalDmg: 4,
            magicDmg: 0,
            physicArmorPercents: 10,
            magicArmorPercents: 40,
        },
        {
            name: "Каноничный фаербол",
            physicalDmg: 0,
            magicDmg: 4,
            physicArmorPercents: 30,
            magicArmorPercents: 10,
        },
        {
            name: "Магический блок",
            physicalDmg: 0,
            magicDmg: 0,
            physicArmorPercents: 100,
            magicArmorPercents: 100,
        }
	],

	//Выбор умения для Евстафия из списка на странице
	pickEvstafiy: function(){
		var actions = document.getElementById("actions-list");
		var tagSpan = document.getElementsByClassName("messages__winner")[0];

		if(tagSpan){
			for(var i=0; i<actions.childElementCount; i++){
				actions.children[i].innerHTML += "<span class='actions__noSelection'>(недоступно)</span>";
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
		//Урон(физический), который наносит Лютый, частично блокируется % от брони Евстафия
		var damagePhysLutiy = moveLutiy.physicalDmg - ((moveEvstafiy.physicArmorPercents * moveLutiy.physicalDmg) / 100);
		var damagePhysEvstafiy = moveEvstafiy.physicalDmg - ((moveLutiy.physicArmorPercents * moveEvstafiy.physicalDmg) / 100);

		//То же самое и с магическим
		var damageMagLutiy = moveLutiy.magicDmg - ((moveEvstafiy.magicArmorPercents * moveLutiy.magicDmg) / 100);
		var damageMagEvstafiy = moveEvstafiy.magicDmg - ((moveLutiy.magicArmorPercents * moveEvstafiy.magicDmg) / 100);

		var damageTotalLutiy = damagePhysLutiy + damageMagLutiy;
		var damageTotalEvstafiy = damagePhysEvstafiy + damageMagEvstafiy;

		this.reduceHealthBar(damageTotalLutiy, damageTotalEvstafiy);

		//Уменьшение здоровья
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

	//Метод проверки на 0 уровень здоровья
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

		lutiyObj.ontransitionend = drawHealth; //Вызов ф-и обработчика по окончании анимации уменьшения здоровья
		evstafiyObj.ontransitionend = drawHealth; 
	},

	//Метод проверки окончания игры
	checkEndGame: function(){
		if(lutiy.maxHealth > 0 && evstafiy.maxHealth > 0){
			lutiy.pickLutiy();
			evstafiy.pickEvstafiy();
		}
		else if(lutiy.maxHealth <= 0 && evstafiy.maxHealth <= 0){
			var strRefresh = "<div><span class='messages__winner'>Для начала новой игры перезагрузите страницу</span></div>";
			var strWin = "<div><span class='messages__winner'>Ничья!</span></div>" + strRefresh;
			view.logWinner(strWin);

			evstafiy.pickEvstafiy(); //Повторный вызов метода для предотвращения клика по элементу списка
		}
		else if(lutiy.maxHealth <= 0){
			var strRefresh = "<div><span class='messages__winner'>Для начала новой игры перезагрузите страницу</span></div>";
			var strWin = "<div><span class='messages__winner'>Победил </span>" + evstafiy.name + "!</div>" + strRefresh;
			view.logWinner(strWin);

			evstafiy.pickEvstafiy();
		}
		else if(evstafiy.maxHealth <= 0){
			var strRefresh = "<div><span class='messages__winner'>Для начала новой игры перезагрузите страницу</span></div>";
			var strWin = "<div><span class='messages__winner'>Победил </span>" + lutiy.name + "!</div>" + strRefresh;
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