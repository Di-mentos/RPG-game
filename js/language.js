chooseLanguage();

function chooseLanguage(){
	var ru = document.getElementById("RU");
	var en = document.getElementById("EN");

	en.onclick = function(){
		var body = document.getElementsByTagName('body')[0];
		var script = document.createElement("script");
		script.src = "js/rpg-battle-en.js";
		body.append(script);

		translateHTMLEn();
	}
	ru.onclick = function(){
		var body = document.getElementsByTagName('body')[0];
		var script = document.createElement("script");
		script.src = "js/rpg-battle-ru.js";
		body.append(script);
	}
}

function translateHTMLEn(){
	var title = document.getElementById("item-title");
	var actions = document.getElementById("actions-list");
	var log = document.getElementById("log-title");

	title.innerHTML = "What can Evstafiy do?";
	var arrItems = [];
	for(var i=0; i<actions.childElementCount; i++){
		arrItems.push(actions.children[i]);
	}

	arrItems[0].innerHTML = "Attack with a fighting staff";
	arrItems[1].innerHTML = "Left foot kick";
	arrItems[2].innerHTML = "Huge fireball";
	arrItems[3].innerHTML = "Magic shield";

	log.innerHTML = "Battle information";
}
