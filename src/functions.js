// Objects for the canvases we draw onto
var canvas  = null ;
var context = null ;

// Cells used for matching tracks to detector segments
var cells = [] ;
var cells_linear = [] ;

// Store the current collision and trigger here
var current_collision = null ;
var current_trigger   = null ;

// Store all collisions here (may be removed to save memory)
var collision_list = [] ;

// Detector parts
var subdetectors = [] ;
var segments     = [] ;

var histogram = null ;

// Variables to control the game
var paused = true ;
var shift_counter     = 0 ;
var collision_counter = 0 ;
var heartbeat_counter = 0 ;

var game_state = 'game_start' ;
var team_name  = 'CERN'  ;

// Statistics
var true_positives  = 0 ;
var false_positives = 0 ;
var false_negatives = 0 ;
var total_events    = 0 ;

var higgsy_events         = 0 ;
var total_savedEvents     = 0 ;
var total_deliveredEvents = 0 ;

var score = 0 ;

// Phone home!
var xmlhttp = GetXmlHttpObject() ;

function toggle_pause(){ paused = !paused ; }

function keyDown(evt){
  var keyDownID = window.event ? event.keyCode : (evt.keyCode != 0 ? evt.keyCode : evt.which) ;
  if(keyDownID==8) evt.preventDefault ;
  switch(keyDownID){
    case 32: // Space
      evt.preventDefault() ;
      toggle_pause() ;
      break ;
  }
}

function heartbeat(){
  heartbeat_counter++ ;
  window.setTimeout(heartbeat, delay) ;
  if(game_state=='shift_end'  ) draw_shift_end_screen()   ;
  if(game_state=='shift_start') draw_shift_start_screen() ;
  if(game_state=='game_start' ) draw_game_start_screen()  ;
}

function end_shift(){
  set_header_and_footer_images() ;
  draw_shift_end_screen() ;
  game_state = 'shift_end' ;
  paused = true ;
  current_trigger = random_trigger() ;
  current_trigger.update_text() ;
}

function start_shift(){
  shift_counter++ ;
  if(shift_counter>shifts_per_game && shifts_per_game>0){
    var score = update_score() ;
    animate_histogram() ;
    return ;
  }
  current_trigger = random_trigger() ;
  current_trigger.update_text() ;
  game_state = 'shift_start' ;
  paused = true ;
}

function start(){
  canvas = document.getElementById('canvas_eventDisplay') ;
  context = canvas.getContext('2d') ;
  context.translate(0.5,0.5) ;
  context.lineCap = 'round' ;
  
  document.addEventListener('keydown', keyDown          ) ;
  //canvas  .addEventListener('mousedown', eventDisplayClick) ;
  document.addEventListener('mousedown', eventDisplayClick) ;
  
  Get('span_eventsPerShift').innerHTML = collisions_per_shift ;
  Get('span_shiftsPerGame' ).innerHTML = shifts_per_game ;
  
  apply_experiment_style(neutral_color) ;
  set_header_and_footer_images() ;
  
  histogram = new four_lepton_mass_histogram() ;
  current_trigger = random_trigger() ;
  current_trigger.update_text() ;
  
  make_detector() ;
  heartbeat() ;
  
  // This is CPU intensive, so do it last
  make_cells() ;
  for(var i=0 ; i<segments.length ; i++){
    segments[i].activate_cells() ;
  }
}

function pick_team(evt){
  var x = evt.pageX - Get('canvas_eventDisplay').offsetLeft ;
  var y = evt.pageY - Get('canvas_eventDisplay').offsetTop  ;
  var ATLAS_click = (x>ATLAS_box[0] && x<ATLAS_box[0]+ATLAS_box[2] && y>ATLAS_box[1] && y<ATLAS_box[1]+ATLAS_box[3]) ;
  var CMS_click   = (x>  CMS_box[0] && x<  CMS_box[0]+  CMS_box[2] && y>  CMS_box[1] && y<  CMS_box[1]+  CMS_box[3]) ;
  if(ATLAS_click){
    team_name = 'ATLAS' ;
    apply_experiment_style(ATLAS_color) ;
    Get('div_teamname').innerHTML = 'Team ATLAS' ;
    game_state = 'shift_start' ;
    document.body.style.background = ATLAS_color ;
  }
  if(CMS_click){
    team_name = 'CMS' ;
    apply_experiment_style(CMS_color) ;
    Get('div_teamname').innerHTML = 'Team CMS' ;
    game_state = 'shift_start' ;
    document.body.style.background = CMS_color ;
  }
}

function eventDisplayClick(evt){
  if(game_state=='game_start'){
    pick_team(evt) ;
  }
  else if(game_state=='shift_end'){
    game_state = 'shift_start' ;
  }
  else if(game_state=='shift_start'){
    Get('span_shiftNumber').innerHTML = shift_counter ;
    //set_header_events_summary_table() ;
    set_footer_toplogy() ;
    collision_thread() ;
    game_state = 'playing' ;
    if(paused) toggle_pause() ;
    
    true_positives        = 0 ;
    false_positives       = 0 ;
    false_negatives       = 0 ;
    total_events          = 0 ;
    higgsy_events         = 0 ;
    total_savedEvents     = 0 ;
    total_deliveredEvents = 0 ;
    
    return ;
  }
  if(paused){
    toggle_pause() ;
    return ;
  }
  else if(game_state=='playing'){
    fire_trigger() ;
  }
}

function update_score(){
  score = true_positives - 0.5*(false_positives+false_negatives) ;
  if(score<0) score = 0 ;
  Get('td_score').innerHTML = score ;
  return score ;
}


