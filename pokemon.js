var gameInterval;
var gameCanvas;
var eventCatcherDiv;
var paused = false;
var all_Images = [];
var all_Audio = [];
var cursorobj = new gameObject("cursor",0,0);
var active_player = 0;
var next_player = 1;
var mode = "Standard";
var snakedir = 1;
var currentlyPlayingSoundEffects = [];
var pokemon_dict = {
    3: "Venusaur",
    6: "Charizard",
    9: "Blastoise",
    12: "Butterfree",
    15: "Beedrill",
    18: "Pidgeot",
    20: "Raticate",
    22: "Fearow",
    24: "Arbok",
    26: "Raichu",
    28: "Sandslash",
    31: "Nidoqueen",
    34: "Nidoking",
    36: "Clefable",
    38: "Ninetales",
    40: "Wigglytuff",
    42: "Golbat",
    45: "Vileplume",
    47: "Parasect",
    49: "Venomoth",
    51: "Dugtrio",
    53: "Persian",
    55: "Golduck",
    57: "Primeape",
    59: "Arcanine",
    62: "Poliwrath",
    65: "Alakazham",
    68: "Machamp",
    71: "Victreebel",
    73: "Tentacruel",
    76: "Golem",
    78: "Rapidash",
    80: "Slowbro",
    82: "Magneton",
    83: "Farfetchd",
    85: "Dodrio",
    87: "Dewgong",
    89: "Muk",
    91: "Cloyster",
    94: "Gengar",
    95: "Onix",
    97: "Hypno",
    99: "Kingler",
    101: "Electrode",
    103: "Exeggutor",
    105: "Marowak",
    106: "Hitmonlee",
    107: "Hitmonchan",
    108: "Lickitung",
    110: "Weezing",
    112: "Rhydon",
    113: "Chansey",
    114: "Tangela",
    115: "Kangaskhan",
    117: "Seadra",
    119: "Seaking",
    121: "Starmie",
    122: "Mr Mime",
    123: "Scyther",
    124: "Jynx",
    125: "Electabuzz",
    126: "Magmar",
    127: "Pinsir",
    128: "Tauros",
    130: "Gyrados",
    131: "Lapras",
    132: "Ditto",
    134: "Vaporeon",
    135: "Jolteon",
    136: "Flareon",
    137: "Porygon",
    139: "Omastar",
    141: "Kabutops",
    142: "Aerodactyl",
    143: "Snorlax",
    144: "Articuno",
    145: "Zapdos",
    146: "Moltres",
    149: "Dragonite"
};
var pokemon_list = [];
var player_names = ["Stefan", "Levi", "Edgar", "Chris"];
var player_list = [];
for(i in pokemon_dict){
    pokemon_list.push(i);
}
function preLoader(){
    for(var key in pokemon_dict){
        pokemon_name = pokemon_dict[key];
        pokemon_image = getImageFile("resources/" + pokemon_name + ".png");
        pokemon_image_small = getImageFile("resources/" + pokemon_name+"_small.png");
        pokemon_cry = new Audio("resources/" + format_name(key)+".wav");
        pokemon_dict[key] = [pokemon_name,pokemon_image,pokemon_image_small,pokemon_cry]
        all_Images.push(pokemon_image);
        all_Images.push(pokemon_image_small);
        all_Audio.push(pokemon_cry);
    }
    for(i=0;i<player_names.length;i++){
        new_player = new player(player_names[i]);
        new_player.image = getImageFile("resources/" + player_names[i] + ".jpg");
        all_Images.push(new_player.image);
        player_list.push(new_player);
    } 
}
function format_name(name){
    if (name.length==3)
        return name;
    if (name.length==2)
        return "0"+name;
    return "00"+name;
}
function getImageFile(filename){
    var imgVar = document.createElement("img");
    imgVar.setAttribute("src",filename);
    return imgVar;
}
function didEverythingLoad(){
    for (var j = 0; j < all_Images.length; j++)
        if (!all_Image[j].complete) return false;
    for (var j = 0; j < all_Audio.length; j++)
        if (!all_Audio[j].readystate !=4) return false;
    return true;
}
function startLoading(){
    eventCatcherDiv = document.getElementById("EventCatcher");
    // eventCatcherDiv events go here
    eventCatcherDiv.addEventListener("mousemove", canvasMove);
    //window.addEventListener("keydown", canvasKeyDown);
    eventCatcherDiv.addEventListener("click", canvasClick);
    gameCanvas = document.getElementById("GraphicsBox");
    preLoader();
    gameInterval = setInterval(hasLoaded, 250);
}

function hasLoaded(){
    if (didEverythingLoad) // Check to see if all info is loaded
    {
        clearInterval(gameInterval);
        startGame();
    }
}

function startGame(){
    gameInterval = setInterval(runGame, 25);
    timer = 0;
}
function runGame(){
    if(!paused){
        gameCanvas.getContext("2d").clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        var listcount = 0;
        for (var i=0, len=pokemon_list.length; i<len;i++){
            colcount = listcount%8
            rowcount = (listcount-colcount)/8
            gameCanvas.getContext("2d").drawImage(pokemon_dict[pokemon_list[i]][1],56*colcount,56*rowcount);
            listcount += 1;        
        }
        for (var i=0,len=player_list.length; i<len;i++){
            gameCanvas.getContext("2d").drawImage(player_list[i].image,450,i*160);
            if(player_list[i].team.length>0){
                for(var j=0;j<player_list[i].team.length;j++){
                    colcount = j%5
                    rowcount = (j-colcount)/5
                    gameCanvas.getContext("2d").drawImage(pokemon_dict[player_list[i].team[j]][2],610+40*colcount,i*160+40*rowcount);
                }
            }
        }
        gameCanvas.getContext("2d").beginPath();
        gameCanvas.getContext("2d").lineWidth="10";
        gameCanvas.getContext("2d").strokeStyle="red";
        gameCanvas.getContext("2d").rect(455,5+160*next_player,150,150)
        gameCanvas.getContext("2d").stroke();
        gameCanvas.getContext("2d").closePath();
        gameCanvas.getContext("2d").beginPath();
        gameCanvas.getContext("2d").lineWidth="5";
        gameCanvas.getContext("2d").strokeStyle="yellow";
        gameCanvas.getContext("2d").rect(452,2+160*active_player,156,156)
        gameCanvas.getContext("2d").stroke();
        gameCanvas.getContext("2d").closePath();
        gameCanvas.getContext("2d").beginPath();
        gameCanvas.getContext("2d").strokeStyle="red";
        gameCanvas.getContext("2d").rect(0,567,60,20)
        gameCanvas.getContext("2d").stroke();
        gameCanvas.getContext("2d").closePath();
        gameCanvas.getContext("2d").beginPath();
        gameCanvas.getContext("2d").rect(65,567,60,20)
        gameCanvas.getContext("2d").stroke();
        gameCanvas.getContext("2d").closePath();
        gameCanvas.getContext("2d").beginPath();
        gameCanvas.getContext("2d").rect(130,567,60,20)
        gameCanvas.getContext("2d").stroke();
        gameCanvas.getContext("2d").closePath();
        gameCanvas.getContext("2d").beginPath();
        gameCanvas.getContext("2d").rect(196,567,60,20)
        gameCanvas.getContext("2d").stroke();
        gameCanvas.getContext("2d").closePath();
        gameCanvas.getContext("2d").beginPath();
        gameCanvas.getContext("2d").rect(262,567,60,20)
        gameCanvas.getContext("2d").stroke();
        gameCanvas.getContext("2d").closePath();
        var offset = 0;
        if(mode=="Snake")
            offset = 65;
        gameCanvas.getContext("2d").beginPath();
        gameCanvas.getContext("2d").strokeStyle="green";
        gameCanvas.getContext("2d").rect(0+offset,567,60,20)
        gameCanvas.getContext("2d").stroke();
        gameCanvas.getContext("2d").closePath();
        gameCanvas.getContext("2d").fillText("Standard",10,580);
        gameCanvas.getContext("2d").fillText("Snake",80,580);
        gameCanvas.getContext("2d").fillText("Random",140,580);
        gameCanvas.getContext("2d").fillText("Download",204,580);
        gameCanvas.getContext("2d").fillText("Reset",278,580);
    }
}
function gameObject(type,X,Y,width=32,height=32){
    this.type = type;
    this.X = X;
    this.Y = Y;
    this.image = "blank"
    this.width = width;
    this.height = height;
    this.toDelete = false;
}
function player(name){
    this.name = name;
    this.image = "blank"
    this.team = [];
}
function canvasMove(E){
    E = E || window.event;
    cursorobj.X = E.pageX;
    cursorobj.Y = E.pageY;
}
function canvasClick(E){
    if (cursorobj.X <450){
        E = E || window.event;
        col = cursorobj.X;
        col = (col-col%56)/56;
        row = cursorobj.Y;
        row = (row-row%56)/56;
        pokemon_num = row*8+col;
        if (pokemon_num<pokemon_list.length){
            player_list[active_player].team.push(pokemon_list[pokemon_num]);
            pokemon_dict[pokemon_list[pokemon_num]][3].play();
            pokemon_list.splice(pokemon_num,1);
            active_player = next_player;
            next_player = pass_pick();
        }
    }
    if (cursorobj.Y>567&&cursorobj.Y<587){
        if (cursorobj.X>0&&cursorobj.X<60)
            mode = "Standard";
        if (cursorobj.X>65&&cursorobj.X<125)
            mode = "Snake";
        if (cursorobj.X>130&&cursorobj.X<190){
            player_list = shuffle(player_list);
        }
        if (cursorobj.X>196&&cursorobj.X<256){
            for(i=0;i<player_list.length;i++){
                var output = player_list[i].name + ":";
                for(j=0;j<player_list[i].team.length;j++){
                    output+= " " + pokemon_dict[player_list[i].team[j]][0];
                }
                output += ".";
                console.log(output);
            }
        }
        if (cursorobj.X>262&&cursorobj.X<322){
            for(i=0;i<player_list.length;i++){
                player_list[i].team = [];
            }
            pokemon_list = [];
            for(i in pokemon_dict){
                pokemon_list.push(i);
            }
            active_player = 0;
            next_player = pass_pick();
        }
        next_player = pass_pick();
    }
}
function pass_pick(){
    if(mode=="Standard"){
        return (active_player+1)%4;
    }
    if(mode=="Snake"){
        next_player = active_player+snakedir;
        if(next_player==4){
            next_player = 3;
            snakedir = -1;
        }
        if (next_player==-1){
            next_player = 0;
            snakedir = 1;
        }
        return next_player;
    }
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}