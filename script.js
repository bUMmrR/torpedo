function generalas() { 
    const betuk = ["A","B","C","D","E","F","G","H","I","J"];
    jatekter = document.getElementById("jatekter");
    oszlop = 11;
    sor = 11;
    let table = document.createElement("table");
    for (let i = 0; i < sor; i++) { 
        var tr = document.createElement("tr");
        for (let j = 0; j < oszlop; j++) { 
            let td = document.createElement("td");

            td.setAttribute("onclick", "Katt(this)")
            td.dataset.sor = i;
            td.dataset.oszlop = j;
            if(j == 0){
                if(i != 0){

                    td.innerHTML = i;
                }
            }
            
            if(i == 0){
                if(betuk[j-1] != undefined){

                    td.innerHTML = betuk[j-1];
                }
            }
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
    console.log()
    jatekter.appendChild(table);
}
generalas();