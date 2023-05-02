const cim = document.getElementById("cim")
const emberJatekter = document.getElementById("jatekter-ember")
const botJatekter = document.getElementById("jatekter-bot")



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

main();