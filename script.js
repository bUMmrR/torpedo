const cim = document.getElementById("cim")
const emberJatekter = document.getElementById("jatekter-ember")
const botJatekter = document.getElementById("jatekter-bot")
//1x5
//1x4
//2x3
//1x2

function generalas(embere) { 
    const betuk = ["A","B","C","D","E","F","G","H","I","J"];
    jatekter = document.getElementById("jatekter-"+embere);
    oszlop = 11;
    sor = 11;
    let table = document.createElement("table");
    for (let i = 0; i < sor; i++) { 
        var tr = document.createElement("tr");
        for (let j = 0; j < oszlop; j++) { 
            
            let td = document.createElement("td");

            if (i !=0 && j != 0 && embere != "ember") {
                td.setAttribute("onclick", "Katt(this)")
                
            }
            else{
                td.setAttribute("onclick","KattEmber(this)")
            }
            td.dataset.sor = i;
            td.dataset.oszlop = j;
            td.dataset.tabla = embere;
            if(j == 0){
                if(i != 0){

                    td.innerHTML = i;
                    td.setAttribute("onclick","")
                }
            }
            
            if(i == 0){
                if(betuk[j-1] != undefined){
                    td.setAttribute("onclick","")

                    td.innerHTML = betuk[j-1];
                }
            }
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
    console.log()
    cim.innerHTML="Hajók lerakása"
    jatekter.appendChild(table);
}

function KattEmber(td){
    td.style.backgroundColor = "var(--marlott)";
    var kep = document.createElement("img")
    kep.src = "explo.png";
    td.appendChild(kep);
    td.setAttribute("onclick","")
}


function Katt(td){
    cim.innerHTML = "lövés";
    td.style.backgroundColor = "var(--talalat)";
    var kep = document.createElement("img")
    kep.src = "explo.png";
    td.appendChild(kep);
    td.setAttribute("onclick","")
}

function generalHajo(){
    for (let i = 0; i < 10; i++) {
        var temp = document.createElement("p")
        temp.innerText = "igen"
        emberJatekter.appendChild(temp)
    }
}

function main(){
    generalas("ember");
    generalas("bot");
    generalHajo();
}

// Define variables for the game board size and number of ships
const boardSize = 10;
const numShips = 5;

// Create an empty 2D array to represent the game board
const board = [];
for (let i = 0; i < boardSize; i++) {
  board[i] = new Array(boardSize).fill(0);
}

// Define a function to randomly place a ship of a given length on the board
function placeShip(shipLength) {
  let shipPlaced = false;
  while (!shipPlaced) {
    // Choose a random starting position for the ship
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);

    // Choose a random direction for the ship (0 = horizontal, 1 = vertical)
    const direction = Math.floor(Math.random() * 2);

    // Check if the ship can be placed in the chosen position and direction
    let validPlacement = true;
    for (let i = 0; i < shipLength; i++) {
      const newRow = direction === 0 ? row : row + i;
      const newCol = direction === 1 ? col : col + i;
      if (newRow >= boardSize || newCol >= boardSize || board[newRow][newCol] === 1) {
        validPlacement = false;
        break;
      }
    }

    // If the ship can be placed, update the board and mark the ship as placed
    if (validPlacement) {
      for (let i = 0; i < shipLength; i++) {
        const newRow = direction === 0 ? row : row + i;
        const newCol = direction === 1 ? col : col + i;
        board[newRow][newCol] = 1;
      }
      shipPlaced = true;
    }
  }
}

// Place the ships on the board
const hajok = [2, 3, 3, 4, 5];
for (let i = 0; i < numShips; i++) {
  placeShip(hajok[i]);
}

// Print the board for debugging purposes
console.log(board);

main();
