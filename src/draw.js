function clear_canvas(context){
  context.fillStyle = 'rgb(255,255,255)' ;
  context.fillStyle = 'rgb(0,0,0)' ;
  context.fillRect(0,0,cw,ch) ;
}

function draw_eventDisplay(collision, context){
  clear_canvas(context) ;
  if(underlay_cells) draw_cells(context) ;
  for(var i=0 ; i<subdetectors.length ; i++){
    subdetectors[i].draw(context) ;
  }
  
  for(var i=0 ; i<collision.tracks.length ; i++){
    collision.tracks[i].draw(context) ;
  }
  for(var i=0 ; i<collision.jets.length ; i++){
    collision.jets[i].draw(context) ;
  }
  for(var i=0 ; i<collision.leptons.length ; i++){
    //collision.leptons[i].draw(context) ;
  }
  if(overlay_cells) draw_cells(context) ;

  context.strokeStyle = '#880000' ;
}

function draw_success(){
  context.save() ;
  var w = canvas.width  ;
  var h = canvas.height ;
  var r = 0.4*w ;
  context.lineWidth = 0.05*w ;
  if(current_trigger.match_collision){
    context.beginPath() ;
    context.strokeStyle = 'rgba(0,255,0,0.8)' ;
    context.arc(0.5*w, 0.5*h, r, 0, 2*pi, true) ;
    context.moveTo(0.3*w,0.6*h) ;
    context.lineTo(0.5*w,0.7*h) ;
    context.lineTo(0.7*w,0.3*h) ;
    context.stroke() ;
  }
  else{
    context.beginPath() ;
    context.strokeStyle = 'rgba(255,0,0,0.8)' ;
    context.arc(0.5*w, 0.5*h, r, 0, 2*pi, true) ;
    context.moveTo(0.3*w,0.7*h) ;
    context.lineTo(0.7*w,0.3*h) ;
    context.moveTo(0.3*w,0.3*h) ;
    context.lineTo(0.7*w,0.7*h) ;
    context.stroke() ;
  }
  context.restore() ;
}

function draw_spokes(){
  var w = canvas.width  ;
  var h = canvas.height ;
  
  var nSpokes = 12 ;
  var spoke_rate = 0.002*2*pi ;
  var spoke_lightColor = '#335533' ;
  var spoke_lightColor = '#335533' ;
  context.fillStyle = '#003300' ;
  context.fillRect(0,0,w,h) ;
  context.fillStyle = '#335533' ;
  var phi0 = spoke_rate*heartbeat_counter
  for(var i=0 ; i<nSpokes ; i+=2){
    var phi1 = phi0 + 2*pi*(i+0)/nSpokes ;
    var phi2 = phi0 + 2*pi*(i+1)/nSpokes ;
    context.beginPath() ;
    context.moveTo(0.5*w, 0.5*h) ;
    context.lineTo(0.5*w+2*w*cos(phi1), 0.5*h+2*w*sin(phi1)) ;
    context.lineTo(0.5*w+2*w*cos(phi2), 0.5*h+2*w*sin(phi2)) ;
    context.lineTo(0.5*w, 0.5*h) ;
    context.closePath() ;
    context.fill() ;
  }
}

function apply_experiment_style(color){
  canvas.style.borderTop    = '9px solid ' + color ;
  canvas.style.borderBottom = '9px solid ' + color ;
  Get('div_gameWrapper').style.border = '9px solid ' + color ;
  Get('div_teamname'   ).style.backgroundColor = color ;
  Get('div_header'     ).style.border = '1px solid ' + color ;
  Get('div_footer'     ).color = color ;
}

function draw_game_start_screen(){
  context.save() ;
  clear_canvas(context) ;
  var w = canvas.width  ;
  var h = canvas.height ;
  
  draw_spokes() ;
  
  context.strokeStyle = '#ffffff' ;
  context.lineWidth = 5 ;
  
  context.fillStyle = '#ffffff' ;
  context.textAlign = 'center' ;
  context.font = '70px arial' ;
  context.fillText('Welcome to the'   , 0.5*w, 0.15*h) ;
  context.fillText('Higgs Trigger Game!', 0.5*w, 0.27*h) ;
  
  context.font = '40px arial' ;
  context.fillText('Choose your team:', 0.5*w,  0.40*h) ;
  
  context.font = '60px arial' ;
  context.fillText('vs', 0.5*w,  0.7*h) ;
  
  draw_experiment_box(context, ATLAS_box, 'ATLAS', ATLAS_color, 'img_ATLAS') ;
  draw_experiment_box(context,   CMS_box, 'CMS'  , CMS_color  , 'img_CMS'  ) ;
  
  context.restore() ;
}

function draw_experiment_box(context, box, name, color, image_name){
  var x = box[0] ;
  var y = box[1] ;
  var w = box[2] ;
  var h = box[3] ;
  context.font = '40px arial' ;
  context.fillStyle = color ;
  context.fillRect(x, y, w, h) ;
  context.strokeRect(x, y, w, h) ;
  context.fillStyle = '#ffffff' ;
  context.fillText('Team', x+0.5*w, y+50) ;
  context.fillText(name  , x+0.5*w, y+100) ;
  context.drawImage(Get(image_name),  x+6, y+h-173) ;
}

function draw_shift_start_screen(){
  context.save() ;
  clear_canvas(context) ;
  var w = canvas.width  ;
  var h = canvas.height ;
  
  draw_spokes() ;
  
  context.fillStyle = '#ffffff' ;
  context.textAlign = 'center' ;
  context.font = '80px arial' ;
  context.fillText('NEW SHIFT!', 0.5*w, 0.15*h) ;
  
  context.font = '40px arial' ;
  context.fillText('Fire the trigger (click) for', 0.5*w,  0.38*h) ;
  context.fillText('events that contain:', 0.5*w, 0.45*h) ;
  current_trigger.draw_topology_on_shift_start_screen(w, h) ;
  context.fillText(current_trigger.description, 0.5*w, 0.70*h) ;
  
  context.fillText('Click to begin.', 0.5*w, 0.9*h) ;
  
  context.restore() ;
}

function draw_shift_end_screen(){
  context.save() ;
  clear_canvas(context) ;
  var w = canvas.width  ;
  var h = canvas.height ;
  
  draw_spokes() ;
  
  context.fillStyle = '#ffffff' ;
  context.textAlign = 'center' ;
  context.font = '80px arial' ;
  context.fillText('Shift summary:', 0.5*w, 0.15*h) ;
  
  context.font = '40px arial' ;
  context.fillText('Events saved: '     + total_savedEvents                , 0.5*w, 0.25*h) ;
  context.fillText('Correct clicks: '   + true_positives                   , 0.5*w, 0.32*h) ;
  context.fillText('Incorrect clicks: ' + (false_positives+false_negatives), 0.5*w, 0.39*h) ;
  context.font = '75px arial' ;
  context.fillText('Score: '            + score                            , 0.5*w, 0.58*h) ;
  
  context.font = '30px arial' ;
  context.fillText('Thank you for contributing to science!'          , 0.5*w, 0.72*h) ;
  context.fillText('With your help we will discover the Higgs boson!', 0.5*w, 0.77*h) ;
  
  context.font = '40px arial' ;
  context.fillText('Click to start the next shift.', 0.5*w, 0.9*h) ;
  context.font = '20px arial' ;
  context.fillText('(Feel free to pass to the next player when you are ready)', 0.5*w, 0.95*h) ;
  
  context.restore() ;
}



