var collision_object = function(){
  this.jets    = [] ;
  this.tracks  = [] ;
  this.leptons = [] ;
  this.nMu = 0 ;
  this.nEl = 0 ;
  this.nJet = nJet_min + Math.floor(random()*(nJet_max-nJet_min)) ;
  this.hMass = 0 ;
  this.isHiggs = false ;
  this.add_four_leptons  = function(){
    if(random()<0.5){
      this.nMu += 2 ;
      if(random()<0.5){
        this.nMu += 2;
      }
      else{
        this.nEl += 2 ;
      }
    }
    else{
      this.nEl += 2
      if(random()<0.5){
        this.nMu += 2 ;
      }
      else{
        this.nEl += 2 ;
      }
    }
  }
  this.add_three_leptons = function(){
    if(random()<0.5){
      this.nMu += 2 ;
      if(random()<0.5){
        this.nMu += 1;
      }
      else{
        this.nEl += 1 ;
      }
    }
    else{
      this.nEl += 2
      if(random()<0.5){
        this.nMu += 1 ;
      }
      else{
        this.nEl += 1 ;
      }
    }
  }
  this.add_two_leptons   = function(){
    if(random()<0.5){
      this.nMu += 2 ;
    }
    else{
      this.nEl += 2
    }
  }
  this.add_one_leptons   = function(){
    if(random()<0.5){
      this.nMu += 1 ;
    }
    else{
      this.nEl += 1 ;
    }
  }
  this.purge = function(){ // Minimise memory use
    this.jets    = [] ;
    this.tracks  = [] ;
    this.leptons = [] ;
  }
  this.make_particles = function(){
    for(var i=0 ; i<0 ; i++){
      var q = (random()<0.5) ? -1 : 1 ;
      var pt  = 10 + 90*random() ;
      var phi = 2*pi*random() ;
      var color = track_color ;
      var track = new trackObject(q, mPi, pt, phi, color, 'pion') ;
      this.tracks.push(track) ;
    }
    for(var i=0 ; i<this.nJet ; i++){
      var pt = 50 + 150*random() ;
      var phi = 2*pi*random() ;
      var color = random_color(100) ;
      var jet = new jet_object(pt, phi, color) ;
      this.jets.push(jet) ;
    }
    var charge = (random()<0.5) ? -1 : 1 ;
    var phi = 0 ;
    for(var i=0 ; i<this.nMu ; i++){
      phi = (i%2==1) ? (0.5+random())*pi+phi : 2*pi*random() ;
      this.leptons.push(new muon_object(charge, 30, phi)) ;
      charge *= -1 ;
    }
    for(var i=0 ; i<this.nEl ; i++){
      phi = (i%2==1) ? (0.5+random())*pi+phi : 2*pi*random() ;
      this.leptons.push(new electron_object(charge, 30, phi)) ;
      charge *= -1 ;
    }
  }
}

function make_collision(){
  var r = random() ;
  if(r<cumulative_probability['H']){
    return make_Higgs_collision(126) ;
  }
  else if(r<cumulative_probability['4L']){
    var ev = new collision_object() ;
    ev.add_four_leptons() ;
    ev.hMass = 100 + 50*random() ;
    return ev ;
  }
  else if(r<cumulative_probability['3L']){
    var ev = new collision_object() ;
    ev.add_three_leptons() ;
    return ev ;
  }
  else if(r<cumulative_probability['2L']){
    var ev = new collision_object() ;
    ev.add_two_leptons() ;
    return ev ;
  }
  else if(r<cumulative_probability['1L']){
    var ev = new collision_object() ;
    ev.add_one_leptons() ;
    return ev ;
  }
  else{
    var ev = new collision_object() ;
    return ev ;
  }
}
function make_Higgs_collision(mass){
  var ev = new collision_object() ;
  ev.isHiggs = true ;
  ev.add_four_leptons() ;
  ev.hMass = mass ;
  return ev ;
}

function collision_thread(){
  if(collision_counter>collisions_per_shift){
    window.setTimeout(end_shift, 50) ;
    collision_counter = 0 ;
    return ;
  }
  if(paused){
    collision_delay = collision_delay_max ;
  }
  else{
    current_trigger.update_table() ;
    
    current_collision = process_collision() ;
    draw_eventDisplay(current_collision, context) ;
    
    var dDelay = 0.5*(collision_delay - collision_delay_min) ;
    collision_delay = collision_delay - dDelay ;
    current_trigger.start_collision() ;
    collision_counter++ ;
    if(collision_counter<collisions_per_shift) Get('span_eventNumber').innerHTML = collision_counter ;
  }
  update_score() ;
  window.setTimeout(collision_thread, collision_delay) ;
}

function process_collision(){
  for(var i=0 ; i<cells_linear.length ; i++){
    cells_linear[i].start_collision() ;
  }
  for(var i=0 ; i<segments.length ; i++){
    segments[i].start_collision() ;
  }
  var ev = make_collision() ;
  ev.make_particles() ;
  for(var i=0 ; i<cells_linear.length ; i++){
    cells_linear[i].update_segments() ;
  }
  collision_list.push(ev) ;
  return ev ;
}
