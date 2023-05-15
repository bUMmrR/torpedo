const cim = document.getElementById("cim")
const emberJatekter = document.getElementById("jatekter-ember")
const botJatekter = document.getElementById("jatekter-bot")
var board = new Array();

const hajok = [
  {id:1,hossz:2},
  {id:2,hossz:3},
  {id:3,hossz:3},
  {id:4,hossz:4},
  {id:5,hossz:5},
]


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
    cim.innerHTML="Hajók lerakása"
    if (embere != "ember") {
      table.style.display="none";
    }
    table.classList+= "hajoTabla"
    jatekter.appendChild(table);
}

function KattEmber(td){
    if (true) {
      document.getElementsByClassName("hajoTabla")[1].style.display = "inline-block"
      document.getElementsByClassName("maradekTabla")[0].style.display = "none"
      document.getElementsByClassName("maradekTabla")[1].style.display = "none"
      document.getElementsByClassName("col-12")[0].classList= "col-6"
      document.getElementsByClassName("col-0")[0].classList= "col-6"
    }
    td.style.backgroundColor = "var(--marlott)";
    var kep = document.createElement("img")
    kep.src = "explo.png";
    td.appendChild(kep);
    td.setAttribute("onclick","")
}


function Katt(td){
    if (board[td.dataset.sor-1][td.dataset.oszlop-1] != 0) {
      let kep = document.createElement("img")
      kep.src = "talalat.png";
      td.appendChild(kep);
      td.style.backgroundColor = "var(--talalat)";
    }
    else{
      let kep = document.createElement("img")
      kep.src = "explo.png";
      td.appendChild(kep);
      td.style.backgroundColor = "var(--marlott)";
    }

    td.setAttribute("onclick","")

}

function generalHajo(){
    for (let i = 0; i < 10; i++) {
        var temp = document.createElement("p")
        temp.innerText = "igen"
        emberJatekter.appendChild(temp)
    }
}




function BotHajolerak(hajo) {
  var shipLength = hajo.hossz
  let shipPlaced = false;
  var temp = 0;
  while (!shipPlaced && temp < 1000 ) {

    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);

    //(0 = horizontal, 1 = vertical)
    const irany = Math.floor(Math.random() * 2);

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
      if (newRow >= 10 || newCol >= 10 || hajoVaneUtba(newRow,newCol)) {
        rakhato = false;
        temp++;
        break;
      }
    }
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
            board[newRow][newCol] = hajo;
      }
      shipPlaced = true;
    }
  }
  if (temp > 990) {
    BotTablaGen();
    BotHajoGen();
  }
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

// const hajok = [2, 3, 3, 4, 5];
  
function BotHajoGen(){
  for (let i = 4; i >= 0; i--) {
    BotHajolerak(hajok[i]);
  }
}
function BotTablaGen(){
  board = [];
  for (let i = 0; i < 10; i++) {
    board[i] = new Array(10).fill(0);
  }
}

function generelasHajo(){
  let table = document.createElement("table");
  let hajo = 5;
  let elsoAlkalom = true;
  for (let i = 0; i <= 10; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j <= 5; j++) {
      let td = document.createElement("td");
      if (i % 2 == 0) {
        
      }
      else{
        if (elsoAlkalom) {
          hajo--;
          elsoAlkalom = false;
        }
        console.log(hajo);
          if (j <= hajok[hajo].hossz-1){
            td.style.backgroundColor = "var(--hajoide)";   
            td.dataset.hajo = hajok[hajo].id;
            td.setAttribute("onclick","hajoPozJelenit(this)")      
          }
          if (j == 5) {
            td.style.backgroundColor = "var(--forgat)";         
            let kep = document.createElement("img")
            kep.src = "fordit_hajo.png";
            td.appendChild(kep);
        }
      } 
      
      tr.appendChild(td);
    }
    if (i % 2 == 0) {
        elsoAlkalom = true;
    }
    table.appendChild(tr);
  }
  table.classList += "maradekTabla" 
  emberJatekter.appendChild(table);
}

function hajoPozJelenit(td) {
  let jelenlegHajo = document.getElementById("jelenlegHajo")
  let hajo = td.dataset.hajo
}

function generalasJelenlegHajo(){
  let table = document.createElement("table")
  for (let i = 0; i < 6; i++) {
    let tr = document.createElement("tr")
    for (let j = 0; j < 5; j++) {
      let td = document.createElement("td")
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  table.classList += "maradekTabla" 
  table.id = "jelenlegHajo"
  emberJatekter.appendChild(table)
}


function main(){
  BotTablaGen();
  BotHajoGen();
  generalas("ember");
  generalas("bot");
  generalasJelenlegHajo();
  generelasHajo();
  // generalHajo();
}

main();
