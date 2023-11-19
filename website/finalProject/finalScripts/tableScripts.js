$(
    () => {   

 
$('#trimMore').on('click', function(){
  $('#trimmer').css('display', 'block');
});   

});

$('#trimLess').click(function(){
    $('#trimmer').hide();
  });

function mOver(obj) {
    obj.style.backgroundColor = "red"
}

function mOut(obj) {
  obj.style.backgroundColor = "yellow"
}



function over(obj) {
  obj.style.backgroundColor = "limegreen"
}

function out(obj) {
obj.style.backgroundColor = "orange"
}



function rover(obj) {
  obj.style.backgroundColor = "pink"
}

function rout(obj) {
obj.style.backgroundColor = "violet"
}



function grover(obj) {
  obj.style.backgroundColor = "chartreuse"
}

function grout(obj) {
obj.style.backgroundColor = "rebeccapurple"
}

  