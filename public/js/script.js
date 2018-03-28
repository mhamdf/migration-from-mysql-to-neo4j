//------------------------------------------
//OK pour la base de donnée choisi
/*
 * les taches :
 *  Afficher les tables existent
 *  Migrer la base
 */

function migrer() {
    console.log("Migration");
    var liste = document.getElementById('liste');
    var choix = liste.options[liste.selectedIndex].text;
    var data = {};
    data.db = choix;
    $.ajax({
                url: 'http://localhost:3000/migrerN',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (json, statut) {
                $("#continue").click(function () {
                var alert = document.getElementById("alert");
                if (!(relation.value !== "" && isNaN(relation.value))) {
                relation.style.boxShadow = "0px 0px 0.5px 0.5px red";
                var br = document.createElement('br');
                var newmsg = document.createTextNode("* la relation est invalide essayer autre fois");
                alert.appendChild(br);
                alert.appendChild(newmsg);
                } 
                
                else{
                var rel = $('#relation').val();
                data.relation = rel;
                $.ajax({
                url: 'http://localhost:3000/migrerR',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (json, statut) {
                $.ajax({
                url: 'http://localhost:3000/resultat',
                type: 'GET',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (json, statut) {
                (window.location.replace('resultat'));
        
                
                }
                
        });
        
                
                }
                
        });
            }
                });
            }

        });
        
}


function Okbase() {
    console.log("Affichage des tables");
    var liste = document.getElementById('liste');
    var choix = liste.options[liste.selectedIndex].text;
    if(choix == "choix de base"){
        tabbase = document.getElementById("tabletab");
                    if (tabbase.hasChildNodes()) {
                        while (tabbase.hasChildNodes()) {
                            first = tabbase.firstChild;
                            tabbase.removeChild(first);
                        }
                    }
        var btn = document.getElementById("btn");
                    if(btn.hasChildNodes()) {
                    while(btn.hasChildNodes()){
                        first = btn.firstChild;
                        btn.removeChild(first);
                    }
                    }
         var div = document.createElement("div");
         div.setAttribute("class","alert alert-warning alert-dismissible fade in");           
         div.setAttribute("role","alert");
         var btn = document.createElement("button");     
         btn.setAttribute("role","alert");
         btn.setAttribute("class","close");
         btn.setAttribute("data-dismiss","alert");
         btn.setAttribute("aria-label","Close");
         var span = document.createElement("span");
         span.setAttribute("aria-hidden","true");
         var x = document.createTextNode("x");
         span.appendChild(x);
         btn.appendChild(span);
         var msg = document.createElement("strong");
         msg.innerHTML='Choisisez une base svp !';
         div.appendChild(btn);
         div.appendChild(msg);
         var msg2 = document.createTextNode(' Remplisez la table et ressayez.');
         div.appendChild(msg2);
         tabbase.appendChild(div); 
    }
    else{
        var data = {};
        data.db = choix;
        $.ajax({
                url: 'http://localhost:3000/base',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (json, statut) {
                    var tab = json;
                    tabbase = document.getElementById("tabletab");
                    if (tabbase.hasChildNodes()) {
                        while (tabbase.hasChildNodes()) {
                            first = tabbase.firstChild;
                            tabbase.removeChild(first);
                        }
                    }
                    var btn = document.getElementById("btn");
                    if(btn.hasChildNodes()) {
                    while(btn.hasChildNodes()){
                        first = btn.firstChild;
                        btn.removeChild(first);
                    }
                    }
                    for (i = 0; i < json.length; i++) {
                        var tr = document.createElement("tr");
                        var tr1 = document.createElement("tr");
                        tr1.setAttribute("id", "tr" + (i + 1));
                        //tr.setAttribute("class","col-md-12");
                
                        var td1 = document.createElement("td");
                        td1.setAttribute("class","col-md-6");
                        var newmsg1 = document.createElement("label");
                        newmsg1.setAttribute("class","control-label");
                        var span = document.createElement("h4");
                        span.innerHTML='La table '+( i + 1 ) + " : " + json[i];
                        newmsg1.appendChild(span); 

                        var td2 = document.createElement("td");
                        td2.setAttribute("class","col-md-2");
                        var buttonOK = document.createElement("input");
                        buttonOK.setAttribute("type", "button");
                        buttonOK.setAttribute("id", "" + (i + 1));
                        buttonOK.setAttribute("value", "AFFICHER");
                        buttonOK.setAttribute("onClick", "listeprop(" +(i+1)+","+ JSON.stringify(json[i])+  ");");
                        buttonOK.setAttribute("class", "btn btn-warning");
                        
                        console.log("onClick", "listeprop(" +(i+1)+","+ json[i]+  ");");
                        td1.appendChild(span);
                        td2.appendChild(buttonOK);
                        
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                
                        tabbase.appendChild(tr);
                        tabbase.appendChild(tr1);




                    }
                     var btn = document.getElementById("btn");
                        var inp = document.createElement("input");
                        inp.setAttribute("type","boutton");
                        inp.setAttribute("class","btn btn-primary");
                        inp.setAttribute("value","Migrer");
                        inp.setAttribute("data-toggle","modal");
                        inp.setAttribute("data-target",".bs-example-modal-sm");
                        inp.setAttribute("onClick", "migrer();");
                        btn.appendChild(inp);
                        var inp1 = document.createElement("input");
                        inp1.setAttribute("id","anuller");
                        inp1.setAttribute("type","boutton");
                        inp1.setAttribute("class","btn btn-success");
                        inp1.setAttribute("value","Annuler");
                        btn.appendChild(inp1);
                }});        
        

    }

}



function listeprop(number,select) {
    console.log(select);
    var liste = document.getElementById('liste');
    var choix = liste.options[liste.selectedIndex].text;
    var data = {};
    data.db = choix;
    data.tab = select;
    $.ajax({
                url: 'http://localhost:3000/tables',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (json, statut) {

                var tr = document.getElementById("tr" + number);
                var table = document.createElement("table");
                table.setAttribute("class", "table table-striped responsive-utilities jambo_table col-md-8");
                table.setAttribute("id", "tabssCrit" + number);
                var tbody = document.createElement("tbody");
                var thead = document.createElement("thead");
                var trh = document.createElement("tr");
                trh.setAttribute("class","headings");
                if (tr.hasChildNodes()) {
                    while (tr.hasChildNodes()) {
                        first = tr.firstChild;
                        tr.removeChild(first);
                    }
                
                }
                
                else {
                    if(json.val.length == 0){
                        var tst = 0;
                        var div = document.createElement("div");
                        div.setAttribute("class","alert alert-danger alert-dismissible fade in");
                        div.setAttribute("role","alert");
                        var btn = document.createElement("button");
                        btn.setAttribute("role","alert");
                        btn.setAttribute("class","close");
                        btn.setAttribute("data-dismiss","alert");
                        btn.setAttribute("aria-label","Close");
                        var span = document.createElement("span");
                        span.setAttribute("aria-hidden","true");
                        var x = document.createTextNode("x");
                        span.appendChild(x);
                        btn.appendChild(span);
                        var msg = document.createElement("strong");
                        msg.innerHTML='La table '+ select +' est vide ! ';
                        div.appendChild(btn);
                        div.appendChild(msg);
                        var msg2 = document.createTextNode(' Remplisez la table et ressayez.');
                        div.appendChild(msg2);
                        tr.appendChild(div);       


                    }
                    else{
                for (i = 0; i < json.col.length; i++) { 

                var trss = document.createElement("td");
                var td = document.createElement("td");
                var th = document.createElement("th");
                th.setAttribute("class","column-title");
                var txt = document.createTextNode(json.col[i]);
                th.appendChild(txt);

                
                trh.appendChild(th);
                thead.appendChild(trh);

                for (j = 0; j < json.val.length; j++) {
                var td0 = document.createElement("tr");
                var newmsg1 = document.createElement("label");
                newmsg1.setAttribute("class","control-label");
                var x = json.col[i];
                newmsg1.innerHTML=json.val[j][x];                
                td0.appendChild(newmsg1);
                trss.appendChild(td0);
                
                }
                tbody.appendChild(trss);
                table.appendChild(thead);
                table.appendChild(tbody);
                }
                 td.appendChild(table);
                 tr.appendChild(td);
            }
           
            
        }
    }});
}

function verifiermigration(){

}


