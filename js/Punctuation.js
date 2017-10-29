

document.addEventListener("DOMContentLoaded", function(event) { 
    //sessionStorage.clear();
    var initialized = sessionStorage.getItem("inicializado");
    console.log(initialized);
    if(typeof(Storage) !== "undefined" && initialized=='false') {
        // Store default name when starts the game
        sessionStorage.setItem("n1", "Default");
        sessionStorage.setItem("n2", "Default");
        sessionStorage.setItem("n3", "Default");
        sessionStorage.setItem("n4", "Default");
        sessionStorage.setItem("n5", "Default");
    // Retrieve
    document.getElementById("pos1").innerHTML = sessionStorage.getItem("n1");
    document.getElementById("pos2").innerHTML = sessionStorage.getItem("n2");
    document.getElementById("pos3").innerHTML = sessionStorage.getItem("n3");
    document.getElementById("pos4").innerHTML = sessionStorage.getItem("n4");
    document.getElementById("pos5").innerHTML = sessionStorage.getItem("n5");
        //store default punctuation 
        sessionStorage.setItem("pu1", "0");
        sessionStorage.setItem("pu2", "0");
        sessionStorage.setItem("pu3", "0");
        sessionStorage.setItem("pu4", "0");
        sessionStorage.setItem("pu5", "0");
    // Retrieve
    document.getElementById("punt1").innerHTML = sessionStorage.getItem("pu1");
    document.getElementById("punt2").innerHTML = sessionStorage.getItem("pu2");
    document.getElementById("punt3").innerHTML = sessionStorage.getItem("pu3");
    document.getElementById("punt4").innerHTML = sessionStorage.getItem("pu4");
    document.getElementById("punt5").innerHTML = sessionStorage.getItem("pu5");
    
    } 
    else {
        if(localStorage.getItem("inicializado")==false)
            document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
        console.log('llego al else');
        checkPunctuation();
    }
    //Le decimos que ya hemos inicializado el tablero de puntuaciones
    //localStorage.setItem("inicializado", true);
    sessionStorage.setItem("inicializado", true);    
    console.log('este no sale: '+sessionStorage.getItem("inicializado"));
});


function setNewPunctuation(puntuacion, posicion) {

    var stringname = "n"+posicion;
    var name = puntuacion['nombre'];
    var stringpospu = "pu"+posicion;
    var stringpunt = ""+puntuacion['puntuacion'];
    //console.log(stringpunt + stringpos);
    localStorage.setItem(stringpospu, stringpunt);
    localStorage.setItem(stringname, name);
    document.getElementById("punt"+posicion).innerHTML = sessionStorage.getItem(stringpospu);
    document.getElementById("pos"+posicion).innerHTML = sessionStorage.getItem(stringname);
}
function checkPunctuation() {
    var temp = sessionStorage.getItem('temporal');
    console.log("puntuacion: "+temp);
    var valor = 0;
    for(var j = 0; j < temp.length ; j++){
    for(var i= 0; i < 5 ; i++){
        var nombre = temp[i];
        var mayor = false;
        var string = "pu"+(i+1);
        var dato = sessionStorage.getItem(string);
        console.log(temp[0][1]);
        if(temp[i]['puntuacion'] > dato && !mayor){
            mayor = true;
            setNewPunctuation(nombre, i+1);
        }
    }
}
        ordenar();
    
}

function ordenar(){
    for(var i= 0; i < 4 ; i++){
        var string = "pu"+(i+1);
        var string2 = "pu"+(i+2);
        var dato = sessionStorage.getItem(string);
        var dato2 = sessionStorage.getItem(string2);
        console.log('i: '+i + 'dato:' +dato);
        if(dato2 > dato){
            setNewPunctuation(dato2, i+1);
            setNewPunctuation(dato, i+2);
            i=0;
        }
    }
}

//clickCounter();