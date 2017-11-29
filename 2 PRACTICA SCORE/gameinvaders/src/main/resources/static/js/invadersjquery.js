//Create item in server
function createItem(item, callback) {
    $.ajax({
        method: "POST",
        //url: 'http://localhost:8080/Scores',
        url: window.location.origin +'/Scores',
        data: JSON.stringify(item),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (item) {
        console.log("Item created: " + JSON.stringify(item));
        callback(item);
    })
}



$(document).ready(function(){
    
})


$.create= function(item){
	createItem(item, function (itemWithId) {
    });
};


