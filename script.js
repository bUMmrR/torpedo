const cim = document.getElementById("cim")
const emberJatekter = document.getElementById("jatekter-ember")
const botJatekter = document.getElementById("jatekter-bot")
var board = new Array();
var boardEmber = new Array();
var botTalaltLovesei = new Array();
var szunet= false;
var nehezseg;
var forgatva = 1;
var botLovesei = [];
var Bot_kapott_talalatok = 0;
var Jatekos_kapott_talalatok = 0; // ha eléri a 17-t vége

const hajok = [
  {id:1,hossz:2},
  {id:2,hossz:3},
  {id:3,hossz:3},
  {id:4,hossz:4},
  {id:5,hossz:5},
]

var vektor = [
  [0,-1],
  [-1,0],
  [0,1],
  [1,0]
];

var irany;
var elsoTalalat;
var elozoTalalat;
var talalatokszama = 0;

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
      var row = jelenlegHajo.rows[0];
      var cell = row.cells[0];
      var hajo = cell.dataset.hajo;
      var x = Number(td.dataset.sor);
      var y = Number(td.dataset.oszlop);
      if (hajo != undefined && hajo != "undefined") {
        var rakhato = true;
        var irany = forgatva % 2;
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
              cell1.dataset.hajo=hajo;
              cell1.setAttribute("onclick","")
        }
        shipPlaced = true;

        var tabla = document.getElementsByClassName("maradekTabla")[1]
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
        cell.dataset.hajo = undefined;
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

  setTimeout(function() {
    td.style.backgroundColor = "var(--semmi)";
    szunet = false;
  }, delay * 2 * szinek.length);
}
/* ------------- Ha elsülyedt a hajó akkor villanjon fel a tábla ------------ */
function HajoMegtalalva(table) {
  szunet = true;
  var szinek = ["red", "var(--semmi)"];
  var delay = 500;

  for (var i = 0; i < 2 * szinek.length; i++) {
    var jelenlegSzin = szinek[i % szinek.length];
    setTimeout(function(szin) {
      return function() {
        let tabla = table.getElementsByTagName("td")
        for (let i = 0; i < tabla.length; i++) {
          if (tabla[i].innerText == "" && i != 0)  {
            tabla[i].style.border = "1px solid red"
            
          }
          
        }
      };
    }(jelenlegSzin), delay * i);
  }

  setTimeout(function() {
    let tabla = table.getElementsByTagName("td")
    for (let i = 0; i < tabla.length; i++) {
      if (tabla[i].innerText == "" && i != 0)  {
        tabla[i].style.border = "1px solid white"
        
      }
      
    }
    szunet = false;
  }, delay * 2 * szinek.length);
}
/* ------------------------------------ Az ember lő a botnak a táblájára ----------------------------------- */
function Katt(td){
  if(!szunet){
    if (board[td.dataset.sor-1][td.dataset.oszlop-1] != 0) {
      let hajo = board[td.dataset.sor-1][td.dataset.oszlop-1].id;
      hajok[hajo-1].hossz--;
      for (let i = 0; i < hajok.length; i++) {
        if (hajok[i].hossz == 0) {
          for (let j = 0; j < board.length; j++) {
            for (let k = 0; k < board[0].length; k++) {
              if (board[j][k].id == hajo) {
                let tabla = document.getElementsByClassName("hajoTabla")[1];
                hajok[hajo-1].hossz = 99;
                HajoMegtalalva(tabla);
              }
            }
          }
        }
      }
      let kep = document.createElement("img")
      kep.src = "talalat.png";
      td.appendChild(kep);
      td.style.backgroundColor = "var(--talalat)";
      Bot_kapott_talalatok++;
      if (Bot_kapott_talalatok == 17) {
        setTimeout(function() {
          alert("Te nyertél");
          location.reload();
        },200)
      }
    }
    else{
      szunet = true;
      let kep = document.createElement("img")
      kep.src = "explo.png";
      td.appendChild(kep);
      td.style.backgroundColor = "var(--marlott)";
      cim.innerHTML = "A boton a sor";
      setTimeout(function() {
        botLoves(nehezseg);
      }, 100);
    }
    td.setAttribute("onclick","")
  }
}
/* ------------------------ Random add egy kordinátát ----------------------- */
function randomKordinataGen() {
  const row = Math.floor(Math.random() * 10);
  const col = Math.floor(Math.random() * 10);
  return { row, col };
}
/* -------------------- Megnézi hogy a bot már lőtt-e ide ------------------- */
function lettMarIdeLove(kord) {
  for (const shot of botLovesei) {
    if (shot.row === kord.row && shot.col === kord.col) {
      return false;
    }
  }
  return true;
}
/* --------------------- Megnézi hogy a hajó elsülyedt-e -------------------- */
function elSullyedtE(id, talalatszam){
  if(id == 5 && talalatszam == 5){ //el süllyedt az 5s hajó
    return true;
  }
  else if(id == 4 && talalatszam == 4){//el süllyedt a 4s hajó
    return true;
  }
  else if(id == 3 && talalatszam == 3){//el süllyedt a 3s hajó
    return true;  
  }
  else if(id == 2 && talalatszam == 3){//el süllyedt a 3s hajó
   return true; 
  }
  else if(id == 1 && talalatszam == 2){//el süllyedt a 2s hajó
    return true;
  }
  else{ // nem süllyedt el semmi
    return false;
  }
}
/* ----------------------- A bot lővesének a függvénye ---------------------- */
function botLoves(nehezseg){
  /* ------------------- nehezseg lehet : konyu,kozep,nehez ------------------- */
  if (nehezseg == "konyu") {
    let loves;
    do {
      loves = randomKordinataGen();
    } while (!lettMarIdeLove(loves));
    botLovesei.push(loves);

    let tabla = document.getElementsByClassName("hajoTabla")[0];
    let row = tabla.rows[loves.row+1];
    let cell = row.cells[loves.col+1];
    if (cell.dataset.hajo == undefined) { //van e hajó (talált e?)
      let kep = document.createElement("img");
      kep.src = "explo.png";
      cell.appendChild(kep);
      cell.style.backgroundColor = "var(--marlott)";
      cim.innerHTML = "Rajtad a sor";
      szunet = false;

    }
    else{
      
      Jatekos_kapott_talalatok++;
      if (Jatekos_kapott_talalatok == 17) {
        setTimeout(function() {
          alert("A bot nyert");
          location.reload();
        },200)
      }
      let kep = document.createElement("img");
      kep.src = "talalat.png";
      cell.appendChild(kep);
      cell.style.backgroundColor = "var(--talalat)";
      setTimeout(function() {
        botLoves(nehezseg);
      }, 100); //random időn belül újra megvan hívva
    }

  }
  else if (nehezseg == "kozep"){
  /* ------------------------------ A rendes bot ------------------------------ */


  // problemák:
  /*
  */
 // talán fixelt problémák:
 /*
    ?fix: A bot ne lőjőn már meglőtt hajó mellé
    ?fix: Ha már elkezdtünk 1 irányba lőni és volt találat, de a eloző nem volt találát akkor az irány 2-vel nőjön, vagyis forduljon meg
    ?fix:   A bot tud a betükre illetve a számokra löni
    ?fix:   Nem tud a bot le/fel lőni,
    ?fix:   Ha a bot a hajo végére ér, és nem sülyedt el, de van lőve a hajo végére ahova most lőne, akkor a következő körben nem csinál semmit 
  */

  let loves;
  if ((elozoTalalat == undefined && elsoTalalat!= undefined) && talalatokszama!= 1 ) {
    irany++;
  }

  if (elsoTalalat == undefined) {
    do {
      loves = randomKordinataGen();
    } while (!lettMarIdeLove(loves));
    if (hajoMelletLo(loves.row,loves.col)) {
      botLovesei.push(loves);
      botLoves(nehezseg);
      return;
    }
  }
  else{

    //kezdő irány beállítása ami 
    if(irany == undefined){
      irany = 1;
    }


    if (elozoTalalat == undefined) {
      loves = { row: parseInt(elsoTalalat.row) + vektor[irany % 4][0], col: parseInt(elsoTalalat.col) + vektor[irany % 4][1]};
    }
    else{
      loves = { row: parseInt(elozoTalalat.row) + vektor[irany % 4][0], col: parseInt(elozoTalalat.col) + vektor[irany % 4][1]};
    }
    if (hajoVaneUtbaEmber(loves.row,loves.sor)) {
      botLovesei.push(loves);
      botLoves(nehezseg)
      return;
    }
    if (loves.row == -1  || loves.row == 10 || loves.col == -1 || loves.col == 10) {
      irany++;
      botLoves(nehezseg)
      return;
    }




    //ide lő következőleg embertabla[elsotalat(x),elsotalalat(y+1)]

  }
  if (!lettMarIdeLove(loves)) {
    irany++;
    elozoTalalat = undefined;
    botLoves(nehezseg);
    return;
  }

  botLovesei.push(loves);



  let tabla = document.getElementsByClassName("hajoTabla")[0];
  let row = tabla.rows[loves.row+1];
  let cell = row.cells[loves.col+1];
  if (cell.dataset.hajo == undefined) { //van e hajó (talált e?)
    let kep = document.createElement("img");
    kep.src = "explo.png";
    cell.appendChild(kep);
    cell.style.backgroundColor = "var(--marlott)";
    cim.innerHTML = "Rajtad a sor";
    szunet = false;
    if (elsoTalalat != undefined) {
      irany++;
      elozoTalalat = undefined;
    }
  }
  else{
    botTalaltLovesei[loves.row][loves.col] = 1
    talalatokszama++;
    if (elsoTalalat == undefined) {
      elsoTalalat = loves;
      elozoTalalat = loves;
    }
    if (elSullyedtE(cell.dataset.hajo,talalatokszama)){
      elsoTalalat = undefined;
      elozoTalalat = undefined;
      irany = undefined;
      talalatokszama = 0;
    }
    if (elsoTalalat!= undefined) {
      elozoTalalat = loves;
    }
    Jatekos_kapott_talalatok++;
    if (Jatekos_kapott_talalatok == 17) {
      setTimeout(function() {
        alert("A bot nyert");
        location.reload();
      },200)
    }
    let kep = document.createElement("img");
    kep.src = "talalat.png";
    cell.appendChild(kep);
    cell.style.backgroundColor = "var(--talalat)";
    setTimeout(function() {
      botLoves(nehezseg);
    }, 1000); //random időn belül újra megvan hívva
  }
  }

  else{
  /* -------------------------------- eman mode ------------------------------- */
  let loves = nehezBotLoves();


  if (loves == undefined) {
    alert("A bot nyert,");
    location.reload();
  }
  
  let tabla = document.getElementsByClassName("hajoTabla")[0];
  let row = tabla.rows[loves.index];
  let cell = row.cells[loves.jindex];
  for (let i = 0; i < boardEmber.length; i++) {
      for (let j = 0; j < boardEmber[0].length; j++) {
          if(boardEmber[i][j] == 0){
            Jatekos_kapott_talalatok++;
            
          if (Jatekos_kapott_talalatok == 99) {
            setTimeout(function() {
              alert("A bot nyert,");
              location.reload();
            },200)
          }
        else{
          Jatekos_kapott_talalatok= 0;
        }
      }
    }
  }
      let kep = document.createElement("img");
      kep.src = "talalat.png";
      cell.appendChild(kep);
      cell.style.backgroundColor = "var(--talalat)";
      setTimeout(function(){
        botLoves(nehezseg);
      },100)

  }

}
/* -------- Megnézi hogy a bot egy már megtalált hajó mellé akar lőni ------- */
function hajoMelletLo(sor,oszlop){
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if ((sor + i >= 0 && sor + i < 10 && oszlop + j >= 0 && oszlop + j < 10) && (!(i == 0 && j == 0) && botTalaltLovesei[sor + i][oszlop + j] !== 0)) {
          return true;
      }
    }
  }
  return false;
}
/* ---------- Az emán mód bot-nak ez adja visza hol van a kövi hajó --------- */
function nehezBotLoves(){
  for(let i = 0; i<board.length;i++){
    for (let j = 0; j < board[0].length; j++) {

      if(boardEmber[i][j] != 0){
        var index = i+1;
        var jindex = j+1;
        loves = {index,jindex};
        boardEmber[i][j] = 0;
        return loves;
      } 
    }
  }
}
/* ------------------------------------ A függvény ami lerakja a botnak a hajóit ha jó ----------------------------------- */
function BotHajolerak(hajo) {
  var shipLength = hajo.hossz
  let shipPlaced = false;
  while (!shipPlaced) {

    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);
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
/* ------------------------------------ Feltölti a botnak a talalatai tabláját 0-val  ----------------------------------- */
function botTalatTablaGen(){
  for (let i = 0; i < 10; i++) {
    botTalaltLovesei[i] = new Array(10).fill(0);
  }
}
/* ------------------------------------ Feltölti az embernek a tabláját 0-val  ----------------------------------- */
function EmberTablaGen(){
  boardEmber = [];
  for (let i = 0; i < 10; i++) {
    boardEmber[i] = new Array(10).fill(0);
  }
}
/* ---------------------------------- Meghivja a függvényt ami a hajokat lerakja a botnak ---------------------------------- */
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
  if (cell.dataset.hajo == td.dataset.hajoTemp) {
    forgatva++;
    hajoPozJelenit(td)
  }
}
/* ---------------------------- Nulláza a hajopoz --------------------------- */
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
  GombokLerakasa();
  document.getElementsByClassName("hajoTabla")[1].style.display = "inline-block"
  document.getElementsByClassName("maradekTabla")[0].style.display = "none"
  document.getElementsByClassName("maradekTabla")[1].style.display = "none"
  document.getElementsByClassName("col-12")[0].classList= "col-6"
  document.getElementsByClassName("col-0")[0].classList= "col-6"
}
/* ----- Kirakja az oldalra a 4 gombot amivel ellehet inditani a jatekot ---- */
function GombokLerakasa(){
  var div = document.getElementById("jatekter-ember");
  //reset gomb
  let btn_reset = document.createElement("button");
  btn_reset.innerHTML = "Reset";
  btn_reset.title = "Előrő kezdheti a hajó rendezést";  
  btn_reset.type = "submit";
  btn_reset.name = "formBtn";
  btn_reset.setAttribute("id","btn");
  btn_reset.onclick = function (){
    location.reload();
  }
  div.appendChild(btn_reset);
  //indítás könnyű módban
  let btn_es = document.createElement("button");
  btn_es.innerHTML = "Indítás könnyű módban";
  btn_es.title = "Elindítja a játékot könnyű módban";
  btn_es.type = "submit";
  btn_es.name = "formBtn";
  btn_es.setAttribute("id","btn");
  btn_es.onclick = function (){
    KönnyuBotInditas();
  }
  div.appendChild(btn_es);
  //indítás közepes módban
  let btn_mid = document.createElement("button");
  btn_mid.innerHTML = "Indítás közepes módban";
  btn_mid.title = "Elindítja a játékot közepes módban";
  btn_mid.type = "submit";
  btn_mid.name = "formBtn";
  btn_mid.setAttribute("id","btn");
  btn_mid.onclick = function (){
    KözepesBotInditas();
  }
  div.appendChild(btn_mid);
  //indítás emán speciálban
  let btn_hrd = document.createElement("button");
  btn_hrd.innerHTML = "Indítás Emán módban";
  btn_hrd.title = "Elindítja a játékot nehéz módban";
  btn_hrd.type = "submit";
  btn_hrd.name = "formBtn";
  btn_hrd.setAttribute("id","btn");
  btn_hrd.onclick = function (){
    NehezBotInditas();
  }
  div.appendChild(btn_hrd);
  szunet = true;
}
/* --------------------- belállitja a nehézséget könyüre -------------------- */
function KönnyuBotInditas(){
  nehezseg = "konyu";
  let temp = document.getElementsByTagName("button");
  for (let i = temp.length - 1; i >= 0; i--) {
    temp[i].remove();
  }
  szunet = false;
  cim.innerHTML = "Rajtad a sor"
}
/* --------------------- belállitja a nehézséget középre -------------------- */
function KözepesBotInditas(){
  nehezseg = "kozep";
  let temp = document.getElementsByTagName("button");
  for (let i = temp.length - 1; i >= 0; i--) {
    temp[i].remove();
  }
  szunet = false;
  cim.innerHTML = "Rajtad a sor"

}
/* --------------------- belállitja a nehézséget nehézre -------------------- */
function NehezBotInditas(){
  nehezseg = "nehez";
  let temp = document.getElementsByTagName("button");
  for (let i = temp.length - 1; i >= 0; i--) {
    temp[i].remove();
  }
  szunet = false;
  cim.innerHTML = "Rajtad a sor"
}
/* ---------------------------------- main ---------------------------------- */
function main(){
  BotTablaGen();
  EmberTablaGen();
  botTalatTablaGen();
  BotHajoGen();
  generalas("ember");
  generalas("bot");
  generalasJelenlegHajo();
  generelasHajo();
}

main();
