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
const tablameret = 10;


// Create an empty 2D array to represent the game board
var board = [];
for (let i = 0; i < tablameret; i++) {
  board[i] = new Array(tablameret).fill(0);
}

// Define a function to randomly place a ship of a given length on the board
function BotHajolerak(shipLength) {
  let shipPlaced = false;
  while (!shipPlaced) {
    // Choose a random starting position for the ship
    const row = Math.floor(Math.random() * tablameret);
    const col = Math.floor(Math.random() * tablameret);

    // Choose a random direction for the ship (0 = horizontal, 1 = vertical)
    const irany = Math.floor(Math.random() * 2);

    // Check if the ship can be placed in the chosen position and direction
    let rakhato = true;
    for (let i = 0; i < shipLength; i++) {
        let newRow = undefined;
        if (irany == 0) {
            newRow = row;
        }
        else { 
            newRow = row + i;
        }
        let newCol = undefined;
        if (irany == 1) {
            newCol = col;
        }
        else { 
            newCol = col + i;
        }
        // console.log(hajoVaneUtba(newRow,newCol));
        if (hajoVaneUtba(newRow,newCol)) {
          console.error("Jaj nem jó")
        }
      if ((newRow >= tablameret || newCol >= tablameret || board[newRow][newCol] === 1)) {
        rakhato = false;
        console.log("nem volt jo")
        break;
      }
    }

    // If the ship can be placed, update the board and mark the ship as placed
    if (rakhato) {
        for (let i = 0; i < shipLength; i++) {
            let newRow = undefined;
            if (irany == 0) {
                newRow = row;
            }
            else { 
                newRow = row + i;
            }
            let newCol = undefined;
            if (irany == 1) {
                newCol = col;
            }
            else { 
                newCol = col + i;
            }          
            console.log(newRow,newCol)
            console.log(board[newRow][newCol])
            board[newRow][newCol] = "hajo";
      }
      shipPlaced = true;
    }
  }
}


function hajoVaneUtbaJelenlegi(sor, oszlop) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (sor + i >= 0 && sor + i < board.length && oszlop + j >= 0 && oszlop + j < board[0].length) {
          if (!(i == 0 && j == 0) && board[sor + i][oszlop + j] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
}

function hajoVaneUtba(sor, oszlop) {
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        if (sor + i >= 0 && sor + i < 10 && oszlop + j >= 0 && oszlop + j < 10) {
          if (!(i == 0 && j == 0) && board[sor + i][oszlop + j] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
}

  

const hajok = [2, 3, 3, 4, 5];
for (let i = 0; i < 5; i++) {
  BotHajolerak(hajok[i]);
}
console.log(board);

main();
