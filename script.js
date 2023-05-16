const cim = document.getElementById("cim")
const emberJatekter = document.getElementById("jatekter-ember")
const botJatekter = document.getElementById("jatekter-bot")
var board = new Array();
var boardEmber = new Array();
var szunet= false;

var forgatva = 1;

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


/* -------------- Ez generálja a 2 tablat amibe a játok folyik -------------- */
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

/* --------------- Ez az ember saját táblájának az onClick-je --------------- */
function KattEmber(td){
  if(document.getElementById("cim").innerHTML == "Hajók lerakása" && !szunet){
      let jelenlegHajo = document.getElementById("jelenlegHajo");
      console.log(jelenlegHajo);
      var row = jelenlegHajo.rows[0];
      var cell = row.cells[0];
      var hajo = cell.dataset.hajo;
      var x = Number(td.dataset.sor);
      var y = Number(td.dataset.oszlop);
      if (hajo != undefined) {
        var rakhato = true;
        irany = forgatva % 2;
        for (let i = 0; i < hajok[hajo-1].hossz; i++) {
          let newRow = undefined;
          if (irany == 1) {
              newRow = x-1;
          }
          else { 
              newRow = x-1 + i;
          }
          let newCol = undefined;
          if (irany == 0) {
              newCol = y-1;
          }
          else { 
              newCol = y-1 + i;
          }

          if (newRow >= 10 || newCol >= 10 || hajoVaneUtbaEmber(newRow,newCol)) {
          rakhato = false;
          nemJoHely(td);
          break;
        }
      }
      if (rakhato) {
          for (let i = 0; i < hajok[hajo-1].hossz; i++) {
              let newRow = undefined;
              if (irany == 1) {
                  newRow = x-1;
              }
              else { 
                  newRow = x-1 + i;
              }
              let newCol = undefined;
              if (irany == 0) {
                  newCol = y-1;
              }
              else { 
                  newCol = y-1 + i;
              }          
              boardEmber[newRow][newCol] = hajo;
              var hajoTabla = document.getElementsByTagName("table")[0]
              var row = hajoTabla.rows[newRow+1]
              var cell1 = row.cells[newCol+1]
              cell1.style.backgroundColor = "var(--hajoide)"
              cell1.setAttribute("onclick","")
        }
        shipPlaced = true;
        console.log(boardEmber);

        var tabla = document.getElementsByClassName("maradekTabla")[1]
        console.log(tabla)
        for (let i = 0; i < tabla.rows.length; i++) {
          for (let j = 0; j < tabla.rows[0].cells.length; j++) {
            var row = tabla.rows[i]
            var cell2 = row.cells[j]
            if (Number(cell2.dataset.hajo) == Number(hajo) || Number(cell2.dataset.hajoTemp) == Number(hajo)){
              cell2.setAttribute("onclick","")
              cell2.style.backgroundColor = "grey";

            }
          }
        }
        if (osszeshajoLerak(tabla)) {
          document.getElementById("cim").innerHTML = "Ősszes hajó lerakva"
          jatekIndul();
        }
        hajoPozNull();
        cell.dataset.hajo = 0;
      }
    }
    else{
      nemJoHely(td);
    }
  }
}

/* ---------- Megnézni hogy a felhaszáló lerakta-e az ősszes hajót ---------- */
function osszeshajoLerak(tabla){
  var levan = true;
  for (let i = 0; i < tabla.rows.length; i++) {
    for (let j = 0; j < tabla.rows[0].cells.length; j++) {
      var row = tabla.rows[i];
      var cell = row.cells[j];
      if (cell.style.backgroundColor != "grey" && cell.style.backgroundColor != ""){
        console.log(cell.style.backgroundColor);
        levan = false;
      }
    }
  }
  return levan;
}

/* ------------------- Elkezd villogni ha nem jó a lerakás ------------------ */
function nemJoHely(td) {
  szunet = true;
  var szinek = ["red", "var(--semmi)"];
  var delay = 500; // ms

  for (var i = 0; i < 2 * szinek.length; i++) {
    var jelenlegSzin = szinek[i % szinek.length];
    setTimeout(function(szin) {
      return function() {
        td.style.backgroundColor = szin;
      };
    }(jelenlegSzin), delay * i);
  }

  // eredeti szin
  setTimeout(function() {
    td.style.backgroundColor = "var(--semmi)";
    szunet = false;
  }, delay * 2 * szinek.length);
}

/* ------------------------------------ Az ember lő a botnak a táblájára ----------------------------------- */
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


/* ------------------------------------ A függvény ami lerakja a botnak a hajóit ha jó ----------------------------------- */
function BotHajolerak(hajo) {
  var shipLength = hajo.hossz
  let shipPlaced = false;
  var temp = 0;
  while (!shipPlaced) {

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
}

/* --------- Megnézi hogy letudná-e rakni a jelenlegi helyre a hajót a botnak -------- */
function hajoVaneUtba(sor, oszlop) {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if ((sor + i >= 0 && sor + i < 10 && oszlop + j >= 0 && oszlop + j < 10) && (!(i == 0 && j == 0) && board[sor + i][oszlop + j] !== 0)) {
          return true;
      }
    }
  }
  return false;
}
/* --------- Megnézi hogy letudná-e rakni a jelenlegi helyre a hajót az embernek -------- */

function hajoVaneUtbaEmber(sor, oszlop) {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if ((sor + i >= 0 && sor + i < 10 && oszlop + j >= 0 && oszlop + j < 10) && (!(i == 0 && j == 0) && boardEmber[sor + i][oszlop + j] !== 0)) {
          return true;
      }
    }
  }
  return false;
}

  
/* ------------------------------------ Feltölti a botnak a tabláját 0-val  ----------------------------------- */
function BotTablaGen(){


  board = [];
  for (let i = 0; i < 10; i++) {
    board[i] = new Array(10).fill(0);
  }
}


/* ------------------------------------ Feltölti az embernek a tabláját 0-val  ----------------------------------- */

function EmberTablaGen(){
  /* ------------------------------------  ----------------------------------- */


  boardEmber = [];
  for (let i = 0; i < 10; i++) {
    boardEmber[i] = new Array(10).fill(0);
  }
}


/* ---------------------------------- Meghivja a függvényt ami a hajogat lerakja a botnak ---------------------------------- */
function BotHajoGen(){
  

  for (let i = 4; i >= 0; i--) {
    BotHajolerak(hajok[i]);
  }
}


/* ----------------------------------- Legenerálja a kiválasztható hajókat ---------------------------------- */
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
          td.dataset.hajoTemp = hajo+1;
          td.dataset.forgat = true;
          td.setAttribute("onclick","forgat(this)");
          let kep = document.createElement("img");
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


/* ------------------------------------ A forgatás gomb OnClick-je ----------------------------------- */
function forgat(td){


  let jelenlegHajo = document.getElementById("jelenlegHajo")
  var row = jelenlegHajo.rows[0];
  var cell = row.cells[0];
  console.log(cell.dataset.hajo,td.dataset.hajoTemp)
  if (cell.dataset.hajo == td.dataset.hajoTemp) {
    forgatva++;
    hajoPozJelenit(td)
  }
}
function hajoPozNull(){
  let jelenlegHajo = document.getElementById("jelenlegHajo")
  for (let index = 0; index < 6; index++) {
    var row = jelenlegHajo.rows[index];
    for (let j = 0; j < 5; j++) {
      var cell = row.cells[j];
      cell.style.backgroundColor="var(--semmi)";
      cell.style.border = "solid white 0px"
    }
  }
}
/* ------------------------------------ Megjeleniti a jelenleg kiválasztott hajót a táblájába ----------------------------------- */
function hajoPozJelenit(td) {



  /* ------------------------------------ Az eddigi pirosozás nullázása ----------------------------------- */
  var elements = document.querySelectorAll('td[data-hajo]');
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.style.backgroundColor != "grey") {
      element.style.backgroundColor= "var(--hajoide)"
    }
  }


  let jelenlegHajo = document.getElementById("jelenlegHajo")
  let hajo;

  /* ------------------------------------ Most forgatásgomb vagy se? ----------------------------------- */
  if (td.dataset.forgat == "true") {
    console.log(td.dataset.hajoTemp)
    hajo = td.dataset.hajoTemp
  }
  else{
    hajo = td.dataset.hajo
  }

  elements = document.querySelectorAll('td[data-hajo="' + hajo + '"]');

  /* ------------------------------------ A kiválsztott hajó pirositása ----------------------------------- */
  for (let index = 0; index < elements.length; index++) {
    elements[index].style.backgroundColor="var(--talalat)"
  }

  var row = jelenlegHajo.rows[0];
  var cell = row.cells[0];
  cell.dataset.hajo = hajo // jelenlegi hajó id-nek a kimentése egy láthatatlan mezőbe :,)

  /* ------------------------------------ a hajó poz nullázása ----------------------------------- */

  console.log(jelenlegHajo)
  hajoPozNull(jelenlegHajo)


  /* ------------------------------------ a hajó poz mutatása ----------------------------------- */

  if (forgatva %2 == 0) {
    for (let index = 0; index < hajok[hajo-1].hossz; index++) {
      var row = jelenlegHajo.rows[index+1];
      var cell = row.cells[2];
      cell.style.backgroundColor = "var(--marlott)";
      cell.style.border = "solid white 1px"

    }
  }
  else{
    var row = jelenlegHajo.rows[3];
    for (let index = 0; index < hajok[hajo-1].hossz; index++) {
      var cell = row.cells[index];
      cell.style.backgroundColor = "var(--marlott)";
      cell.style.border = "solid white 1px";

    }
  }
}

/* ------------------------------------ Maga a jelenleg kiválasztott hajó táblájának a generálása ----------------------------------- */
function generalasJelenlegHajo(){


  let table = document.createElement("table")
  for (let i = 0; i < 6; i++) {
    let tr = document.createElement("tr")
    tr.style.border = "solid white 0px";
    for (let j = 0; j < 5; j++) {
      let td = document.createElement("td")
      td.dataset.sor = i;
      td.dataset.oszlop = j;
      td.style.border = "solid white 0px";
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  table.classList += "maradekTabla" 
  table.style.border = "solid white 0px";
  table.id = "jelenlegHajo"
  emberJatekter.appendChild(table)
}

/* ------- Kirakja a második táblázatot, hogy az ember tudjon rá lőni ------- */
function jatekIndul(){
  document.getElementsByClassName("hajoTabla")[1].style.display = "inline-block"
  document.getElementsByClassName("maradekTabla")[0].style.display = "none"
  document.getElementsByClassName("maradekTabla")[1].style.display = "none"
  document.getElementsByClassName("col-12")[0].classList= "col-6"
  document.getElementsByClassName("col-0")[0].classList= "col-6"
}

function main(){
  BotTablaGen();
  EmberTablaGen();
  BotHajoGen();
  generalas("ember");
  generalas("bot");
  generalasJelenlegHajo();
  generelasHajo();
}

main();