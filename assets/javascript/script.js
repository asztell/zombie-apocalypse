var grid = 5;

function createUnit(x,y){
  var newDiv = document.createElement('div');
  newDiv.className = 'mapUnit';
  newDiv.setAttribute('data-x', x);
  newDiv.setAttribute('data-y', y);
  document.body.appendChild(newDiv);
}

for (var i = 0; i < grid; i++) {
  // document.body.appendChild(document.createElement('br'));
  
  for (var j = 0; j < grid; j++) {
    createUnit(j, i);
  }

}


$('.mapUnit').on('click', function(){
  var coor =   console.log("x:" + $(this).attr('data-x'));
  var coor =   console.log("y:" + $(this).attr('data-y'));
});