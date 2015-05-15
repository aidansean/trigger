function random_color(lower){
  var r = Math.floor(lower + random()*(255-lower)) ;
  var g = Math.floor(lower + random()*(255-lower)) ;
  var b = Math.floor(lower + random()*(255-lower)) ;
  var color = 'rgb('+r+','+g+','+b+')' ;
  return color ;
}

//function increment_td(id){ Get(id).innerHTML = parseInt(Get(id).innerHTML) + 1 ; }

function  sqrt(x){ return Math.sqrt(x) ; }
function  acos(x){ return Math.acos(x) ; }
function   cos(x){ return Math. cos(x) ; }
function   sin(x){ return Math. sin(x) ; }
function   log(x){ return Math. log(x) ; }
function floor(x){ return Math.floor(x) ; }
function atan2(y,x){ return Math.atan2(y,x) ; }
function pow(x,n){ return Math.pow(x,n) ; }
function random(){ return Math.random() ; }

function Get(id){ return document.getElementById(id) ; }
function Create(type){ return document.createElement(type) ; }

function GetXmlHttpObject(){
  if(window.XMLHttpRequest){
    // code for IE7+, Firefox, Chrome, Opera, Safari
    return new XMLHttpRequest() ;
  }
  if(window.ActiveXObject){
    // code for IE6, IE5
    return new ActiveXObject("Microsoft.XMLHTTP") ;
  }
  return null ;
}

function random_gaussian(sigma){ return sqrt(-2*sigma*log(random())) ; }
