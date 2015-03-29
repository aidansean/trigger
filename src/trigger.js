function trigger_object(nEl, nMu, description){
  this.nEl = nEl ;
  this.nMu = nMu ;
  this.fired = false ;
  this.match_collision = false ;
  this.touched = false ;
  this.description = description ;
  this.update_text = function(){
    Get('span_trigger_description').innerHTML = this.description ;
  }
  this.start_collision = function(){
    this.fired = false ;
    var ev = current_collision ;
    this.match_collision = (ev.nEl>=this.nEl && ev.nMu>=this.nMu) ;
    this.touched = true ;
  }
  this.fire = function(){
    if(this.fired) return ;
    this.fired = true ;
    draw_success() ;
    return (this.match_collision) ;
  }
  this.update_table = function(){
    if(this.touched==false) return ;
    if(this.fired){
      if(this.match_collision){
        true_positives++ ;
        Get('td_true_positives').innerHTML = true_positives ;
        
        // Send the event to the server
        var triggerName = '' ;
        for(var i=0 ; i<this.nEl ; i++){ triggerName += 'e' ; }
        for(var i=0 ; i<this.nMu ; i++){ triggerName += 'm' ; }
        var request = '?task=add_event&team='+team_name + '&events='+current_collision.nMu+','+current_collision.nEl+','+triggerName ;
        var uri = 'event_store.php'+request+'&sid=' + Math.random() ;
        xmlhttp.open('GET', uri, true) ;
        xmlhttp.send(null) ;
      }
      else{
        false_positives++ ;
        Get('td_false_positives').innerHTML = false_positives ;
      }
      total_savedEvents++ ;
      Get('span_total_events_saved').innerHTML = total_savedEvents ;
      
      var Higgsy = false ;
      if(current_collision.nMu==4 && current_collision.nEl==0) Higgsy = true ;
      if(current_collision.nMu==2 && current_collision.nEl==2) Higgsy = true ;
      if(current_collision.nMu==0 && current_collision.nEl==4) Higgsy = true ;
      if(Higgsy){
        higgsy_events++ ;
        Get('td_higgsy_events').innerHTML = higgsy_events ;
        histogram.add_mass(current_collision.hMass) ;
      }
    }
    else{
      if(this.match_collision){
        false_negatives++ ;
        Get('td_false_negatives').innerHTML = false_negatives ;
      }
    }
    total_deliveredEvents++ ;
    Get('span_total_events_delivered').innerHTML = total_deliveredEvents ;
  }
  this.draw_topology_on_shift_start_screen = function(w, h){
    if(nEl==2 && nMu==0){
      draw_particle_head(context, 0.4*w, 0.55*h, 10, electron_color, 'e') ;
      draw_particle_head(context, 0.6*w, 0.55*h, 10, electron_color, 'e') ;
    }
    else if(nEl==1 && nMu==0){
      draw_particle_head(context, 0.5*w, 0.55*h, 10, electron_color, 'e') ;
    }
    else if(nEl==0 && nMu==2){
      draw_particle_head(context, 0.4*w, 0.55*h, 10, muon_color, '\u03BC') ;
      draw_particle_head(context, 0.6*w, 0.55*h, 10, muon_color, '\u03BC') ;
    }
    else if(nEl==0 && nMu==1){
      draw_particle_head(context, 0.5*w, 0.55*h, 10, muon_color    , '\u03BC') ;
    }
    else if(nEl==1 && nMu==1){
      draw_particle_head(context, 0.4*w, 0.55*h, 10, electron_color, 'e') ;
      draw_particle_head(context, 0.6*w, 0.55*h, 10, muon_color    , '\u03BC') ;
    }
  }
}

var ee_trigger = new trigger_object(2, 0, 'at least two electrons.') ;
var e_trigger  = new trigger_object(1, 0, 'at least one electron.') ;
var mm_trigger = new trigger_object(0, 2, 'at least two muons.') ;
var m_trigger  = new trigger_object(0, 1, 'at least one muon.') ;
var em_trigger = new trigger_object(1, 1, 'at least one electron and one muon.') ;

var all_triggers = [] ;
all_triggers.push(ee_trigger) ;
all_triggers.push( e_trigger) ;
all_triggers.push(mm_trigger) ;
all_triggers.push( m_trigger) ;
all_triggers.push(em_trigger) ;

function random_trigger(){
  var index = Math.floor(random()*all_triggers.length) ;
  var trg = all_triggers[index] ;
  return trg ;
}

function fire_trigger(){
  var ev = current_collision ;
  var trg = current_trigger ;
  var result = trg.fire() ;
}
