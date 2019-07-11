var database;
var usersRef;
var squareRef;
var boardRef;
var logRef;
var desc;
var weight;
var message;

var username = "Anonymous";
var userColor = "#aabbee";

var localBoard = Array(25);
var users = [];
var localPotentialSquares = [];
var consoleChildCount = 0;
var test = 0;

var translations = [[0], [0, 50], [0, -75, 75], [0, 0, -50, -100]];

function setAllGoals(){
	
	str = ['Poochyena', 'TM05 (Roar)', 'HM05 (Flash)', 'Coin Case', 'Tentacool', 'A Pokemon with a stat related ability', 'Soot Sack', 'TM36 (Sludge Bomb)', 'Slakoth', '7 Different Berries', 'Numel', 'Lava Cookie', '10 pokemon owned', 'Zangoose or Seviper', '6 different water type Pokemon', 'Double Kick or Mud Shot', 'Plusle or Minun', 'Defeat Winstrate Family', 'Participate in a Contest', 'Mawile or Sableye', '10 TMs', 'Ether', 'Magikarp', 'Full Daycare', 'A powder item', 'No money on hand', 'Do not catch a Legendary Pokemon', 'Trade with an NPC', '6 differentflying type Pokemon', 'Feed a Pokemon a Pokeblock', 'A Pokemon with a status related ability', 'Volbeat or Illumise', 'Defeat a Slugma', 'A Pokemon with a weather related ability', 'Defeat all 5 cyclists on Cycling Road', 'Complete a Trick House maze', 'Dustox or Beautifly', 'Do not heal at any Pokemon Centers', 'Sell a Rare Candy', 'Make a secret base', 'Gloom', 'A Pokemon with 4 moves with STAB', 'Exp Share', 'TM44 (Rest)', 'Pearl or Big Pearl', 'Spoink', 'Hatch an egg', 'Make a Pokémon relearn a move', 'Swablu', 'Do not use any TMs', 'Ninjask or Shedinja', 'Three type-boosting items', 'Golbat', 'Solrock or Lunatone', 'A Pokemon with 4 non-TM status moves', 'Pokemon with an evasion boosting move', '7 different types of Poke Ball', 'Barboach', 'Evolve 5 different Pokémon', 'A baby Pokemon', '20 Pokemon owned', 'Stop starterevolving 6 times', 'Lileep or Anorith', 'Pelipper', 'TM19 (Giga Drain)', 'Use a stone to evolve a Pokemon', 'Shuppet or Duskull', '50 pokemon seen', 'Defeat 4 Kecleons', 'Gyarados', 'Defeat all 7 trainers on Route 123', 'Breloom', 'Vulpix', 'Defeat 10 Swimmers', 'Catch something from Safari Zone', '5 Valuable Items', 'Burn a Kecleon', '20 TMs', 'HM02 (Fly)', 'Sea or Lax Incense', 'Featherbadge', 'Magneton', '$50,000', 'Put a Pokeblock into a Safari Zone Container', 'Two different non-key exchangeable items', 'A Trade Evolution Item', 'Wobbuffet', '3 different level 30 Pokemon', 'TM21 (Frustration) or TM27 (Return)', 'All rods', 'Defeat 5 Ninja Boys', 'HM08 (Dive)', 'Seadra', 'Grovyle', 'TM04 (Calm Mind)', 'Relicanth or Wailord', 'Defeat all 6 Trainers on Route 125', 'Catch a Dragon-type Pokemon', 'All badges', 'Heracross or Pinsir'];
	
	
	for(let i = 0; i < str.length; i++){
		squaresRef.add({
			desc: str[i],
			weight: 0
		});
	}
	
}


function generateBoard(){
	
	for(let i = 0; i < 25; i++){
		localBoard[i] = 
		{
			selected: false,
			users: []
		};
	}	
	
	var firebaseConfig = {
		apiKey: "AIzaSyDyYnYcpQxivsyYZlscRepS1YsQpOsR0nY",
		authDomain: "bingo-6ec10.firebaseapp.com",
		databaseURL: "https://bingo-6ec10.firebaseio.com",
		projectId: "bingo-6ec10",
		storageBucket: "",
		messagingSenderId: "886427982690",
		appId: "1:886427982690:web:86b01bc430ba9d1e"
	};

	firebase.initializeApp(firebaseConfig);
	database = firebase.firestore();
	
	
	usersRef = database.collection('users');
	squaresRef = database.collection('squares');
	boardRef = database.collection('board');
	logRef = database.collection('logs');
	
	
	usersRef.onSnapshot(querySnapshot => {
		querySnapshot.docChanges().forEach(change => {
			users[change.doc.data().name] = change.doc.data().color;
		});
	});
	
	
	
	boardRef.onSnapshot(querySnapshot => {
		querySnapshot.docChanges().forEach(change => {
			updateLocalBoard(change);
		});
	});
	
	
	logRef.onSnapshot(querySnapshot => {
		querySnapshot.docChanges().forEach(change => {
			let aa = change.doc.data().data;
			$("#log_list").empty();
			for(let i = 0; i < aa.length; i++){
				log(aa[i]);
			}
		});
	});
	
	
	getAllPotentialSquares();
	
	
	$(".bingoSquare").each(function(index){
		$(this).prepend("<div class='b_color'></div>");
		$(this).prepend("<div class='b_color'></div>");
		$(this).prepend("<div class='b_color'></div>");
		$(this).prepend("<div class='b_color'></div>");
		
	})
	
	$("#add_challenge").click(function(){
		desc = $("#desc_input").val();
		weight = $("#weight_input").val();
		if ((desc != "" && desc != null) && (weight != "" && weight != null)) {
			$("#desc_input").val("");
			$("#weight_input").val("");

			addChallenge(desc, weight)
		}
	});
	
	$("#join").click(function(){
		username = $("#name_picker").val();
		userColor = $("#color_picker").val();
		
		$("#join").prop("disabled", true);
		sendMessage(""+username+" joined");
		joinAsUser();
	});

	$("#send_message").click(function(){
		message = $("#message_input").val();
		$("#message_input").val("");
		sendMessage(message);
	});
}


function updateLocalBoard(change){
	let id = change.doc.id;
	localBoard[id].users = change.doc.data().state;
	$("#"+id).children().last().text(change.doc.data().goal);
	localBoard[id].goal = change.doc.data().goal;
	
	let colors = [];
	for(let i = 0; i < localBoard[id].users.length; i++){
		let u = localBoard[id].users[i];
		colors.push(users[u]);
	}

	toggleSquareColor($("#"+id), colors);
	
	
}

function toggleSquareColor(j_square, colors){
	let numColors = colors.length;
	
	j_square.css("background-color", "#181818");
	for(let i = 0; i < 4; i++){
		j_square.children().eq(i).css("background-color", "#00000000").css("transform", "skew(0rad) translateX(0%)" );
	}
	
	for(let i = 0; i < colors.length; i++){
		let tr = translations[numColors-1][i];
		let skew = (i==0?0:-0.746743);
		j_square.children().eq(i).css("background-color", colors[i]).css("transform", "skew("+skew+"rad) translateX("+tr+"%)" );
	}
}


function setBoardState(index){
	
	let sel = localBoard[index].selected;
	let r = Math.floor(index / 5) + 1;
	let c = index % 5 + 1;
	
	if(sel){
		boardRef.doc(""+index).update({
			state: firebase.firestore.FieldValue.arrayUnion(username)
		}).then(function(){
			sendMessage(""+username+" clicked ("+r+","+c+") {"+localBoard[index].goal+"}");
		});
	}else{
		boardRef.doc(""+index).update({
			state: firebase.firestore.FieldValue.arrayRemove(username)
		});
	}
}


function resetBoard(){
	
	let newSeed = $("#seed_picker").val();
	$("#seed_picker").val("");
	if(newSeed == ""){
		newSeed = ""+Math.round((Math.random() * 9999999));
	}
	
	Math.seedrandom(newSeed);
	let randomArray = getPermutationArray();
	
	for(let i = 0; i < 25; i++){
		let g = localPotentialSquares[randomArray[i]];
		boardRef.doc(""+i).set({
			goal: g,
			state : []
		}, {merge: true});
	}
	
	clearLogs();
	sendMessage(""+username+" reset with seed " + newSeed);
	
}

function getPermutationArray(){
	
	var arr = []
	while(arr.length < 25){
		var r = Math.floor(Math.random()*localPotentialSquares.length);
		if(arr.indexOf(r) === -1) arr.push(r);
	}
	return arr;
}


function addUser(){
	usersRef.doc(username).set({
		name: username,
		color: userColor
	});
}

function addChallenge(desc_text, weight_text) {
	squaresRef.add({
		desc: desc_text,
		weight: weight_text
	})
	.then(function(docRef) {
		sendMessage("Square " + desc + " successfully added!");
	})
	.catch(function(error) {
		sendMessage("Square " + desc + " failed to be added!");
	});
}


function joinAsUser(){
	
	addUser();
	
	$("#reset").click(function(){
		resetBoard();
	});
	
	$(".bingoSquare").click(function(){
		let id = $(this).attr('id');
		localBoard[id].selected = !localBoard[id].selected;
		setBoardState(id);
	});
}

function getAllPotentialSquares(){
	$("#challenge_list").val = "";
	let query = squaresRef.get()
	  .then(snapshot => {
		snapshot.forEach(doc => {
			localPotentialSquares.push(doc.data().desc);
			$("#challenge_list").val = $("#challenge_list").val.concat(doc.data().desc+"\n")
		});	
		
	});
}


function log(str){
	$("#log_list").append(str);
	$('#log_block').scrollTop($('#log_block')[0].scrollHeight);
}

function sendMessage(str){
	
	let st = new Date().toLocaleTimeString() + "  :  " + str;
	let msg = "<li style=\'color:"+userColor+";\'>"+st+"</li>";
	logRef.doc("log").update({
		data: firebase.firestore.FieldValue.arrayUnion(msg)
	});
}

function clearLogs(){
	logRef.doc("log").update({
		data: []
	});
}

window.onload = generateBoard();


