

document.addEventListener("DOMContentLoaded", function(event) { 
    //sessionStorage.clear();
    /*
    var initialized = sessionStorage.getItem("inicializado");
    var definitivo = sessionStorage.getItem('definitivo');
    console.log(definitivo);
    if(typeof(Storage) !== "undefined" && initialized=='false' && definitivo == null) {
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
        sessionStorage.setItem("pu1", 0);
        sessionStorage.setItem("pu2", 0);
        sessionStorage.setItem("pu3", 0);
        sessionStorage.setItem("pu4", 0);
        sessionStorage.setItem("pu5", 0);
    // Retrieve
    document.getElementById("punt1").innerHTML = sessionStorage.getItem("pu1");
    document.getElementById("punt2").innerHTML = sessionStorage.getItem("pu2");
    document.getElementById("punt3").innerHTML = sessionStorage.getItem("pu3");
    document.getElementById("punt4").innerHTML = sessionStorage.getItem("pu4");
    document.getElementById("punt5").innerHTML = sessionStorage.getItem("pu5");
    
    } 
    else {
        //if(localStorage.getItem("inicializado")=='false')
            //document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
        console.log('llego al else');
        sessionStorage.setItem('definitivo', true);
        checkPunctuation();
    }
*/
    if(sessionStorage.getItem('cambiado') == 'false'){
        checkPunctuation();
    }
        
    //Le decimos que ya hemos inicializado el tablero de puntuaciones
    //localStorage.setItem("inicializado", true);
    //sessionStorage.setItem("inicializado", true);    
    //console.log('este no sale: '+sessionStorage.getItem("inicializado"));
    //sessionStorage.clear();
});


function checkPunctuation() {
    var length = sessionStorage.getItem('length');
    length = parseInt(length);
    if(sessionStorage.getItem('definitivo')=='true' && length>=0){
        //resettable();

        var leng = sessionStorage.getItem('posicion');
        leng = parseInt(leng);
        console.log('length aki: '+ leng);

        var posicion =0;
        if(leng!=0){
            posicion = leng -length;
        }

        for(var o = posicion; o <= leng; o++){

        sessionStorage.setItem('cambiado', 'false');
        var name = sessionStorage.getItem('n'+o);
        var puntos = sessionStorage.getItem('p'+o);

        //Debemos pasar los datos a Int para poder comparar
        var puntosInt;
        if(puntos == null){
            puntosInt = 0;
        }
        else{
            puntosInt = parseInt(puntos);
        }
            
        console.log(puntosInt + 'puntosInt');
        //for(var i=0; i<= leng ; i++){
            
            for(var j=0; j<5 ; j++){
                var cambiado = sessionStorage.getItem('cambiado');
                var punt = sessionStorage.getItem("pu"+j);
                if(punt == null){
                    punt = 0;
                }
                else {
                    punt = parseInt(punt);
                }

                if(puntosInt >= punt && cambiado=='false'){

                    var nombreAux2 = sessionStorage.getItem('na'+j);
                    var puntosAux2 = ''+punt;
                    if(nombreAux2 == null){
                        nombreAux2 = 'Default';
                    }
                    //var puntosAux2 = ''+punt;

                        //var IntNum = parseInt(punt);
                       //if(IntNum > 0){
                            for(var i = j+1 ; i <= j ; i++){
                                var nombreAux = sessionStorage.getItem('na'+(i));
                                var puntosAux = sessionStorage.getItem('pu'+(i));
                                                              
                                sessionStorage.setItem('na'+(i), nombreAux2);
                                sessionStorage.setItem('pu'+(i), puntosAux2);

                                nombreAux2 = nombreAux;
                                puntosAux2 = puntosAux;
                                
                            }
                        //}
                        
                    sessionStorage.setItem('na'+j, name);
                    sessionStorage.setItem('pu'+j, puntos);
                    //sessionStorage.removeItem(name);
                    //sessionStorage.removeItem(puntos);
                    sessionStorage.setItem('cambiado', 'true');
                    ordenar(j);
                }
               // ordenar(j-1);
            }
            //sessionStorage.removeItem(name);
            //sessionStorage.removeItem(puntos);
            
        }
            sessionStorage.setItem('cambiado', 'true');
        //}
            //ordenar();
            showall;
    }
    else{
        console.log(sessionStorage.getItem('definitivo'));
    }
    
    
}

function resettable() {
    
        // Store default name when starts the game
        sessionStorage.setItem("na0", "Default");
        sessionStorage.setItem("na1", "Default");
        sessionStorage.setItem("na2", "Default");
        sessionStorage.setItem("na3", "Default");
        sessionStorage.setItem("na4", "Default");
    
        //store default punctuation 
        sessionStorage.setItem("pu0", '0');
        sessionStorage.setItem("pu1", '0');
        sessionStorage.setItem("pu2", '0');
        sessionStorage.setItem("pu3", '0');
        sessionStorage.setItem("pu4", '0');
    }

function ordenar(pos){
    for(var i= pos; i < 5 ; i++){
        
        var dato = sessionStorage.getItem('pu'+i);
        var name = sessionStorage.getItem('na'+i);
        var puntosInt;
        if(dato == null){
            puntosInt = 0;
        }
        else{
            puntosInt = parseInt(dato);
        }
                 
        var dato2 = sessionStorage.getItem('pu'+(i+1));
        var name2 = sessionStorage.getItem('na'+(i+1));
        var puntosInt2;
        if(dato2 == null){
            puntosInt2 = 0;
        }
        else{
            puntosInt2 = parseInt(dato2);
        }
        console.log('i: '+i + 'dato:' +dato);
        if(puntosInt2 > puntosInt){
            sessionStorage.setItem('na'+i, name2);
            sessionStorage.setItem('pu'+i, dato2);

            if(dato == null){
            sessionStorage.setItem('na'+(i+1), 'Default');
            sessionStorage.setItem('pu'+(i+1), 0);
            }
            else{
                sessionStorage.setItem('na'+(i+1), name);
                sessionStorage.setItem('pu'+(i+1), dato);
            }
            i=0;
        }
         else if(dato2 == null){
            sessionStorage.setItem('na'+(i+1), 'Default');
            sessionStorage.setItem('pu'+(i+1), '0');
        }

    }
    showall();
}

function showall(){
     // Retrieve
     document.getElementById("pos0").innerHTML = sessionStorage.getItem("na0");
     document.getElementById("pos1").innerHTML = sessionStorage.getItem("na1");
     document.getElementById("pos2").innerHTML = sessionStorage.getItem("na2");
     document.getElementById("pos3").innerHTML = sessionStorage.getItem("na3");
     document.getElementById("pos4").innerHTML = sessionStorage.getItem("na4");

     // Retrieve
     document.getElementById("punt0").innerHTML = sessionStorage.getItem("pu0");
     document.getElementById("punt1").innerHTML = sessionStorage.getItem("pu1");
     document.getElementById("punt2").innerHTML = sessionStorage.getItem("pu2");
     document.getElementById("punt3").innerHTML = sessionStorage.getItem("pu3");
     document.getElementById("punt4").innerHTML = sessionStorage.getItem("pu4");
}

//clickCounter();