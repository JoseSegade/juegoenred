//Load items from server
function loadItems(callback) {
    $.ajax({
    	method: 'GET',
        url: window.location.origin +'/Scores'
    }).done(function (items) {
        console.log('Items loaded: ' + JSON.stringify(items));
        callback(items);
    })
}

//Show item in page
function showItem(item, i) {	
		$('#table').append(
		        '<tr class = tr>'
		        +'<td id= td' + i + '>'+item.id +'</td>'
		        + '<td id = pos'+ i + 'class = td >'+item.name +'</td>' 
		        + '<td id = punt'+ i +'class = td >' + item.score  +'</td>' 
		        +'</tr>')
 
}

$(document).ready(function () {

    loadItems(function (items) {
    	//var convertedItems = JSON.parse(items);
    	for (var i = 0; i < items.length; i++) {
            showItem(items[i], i);
        }
       
    });
    
});