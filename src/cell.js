function make_cells(){
  for(var u=0 ; u<NR ; u++){
    cells.push([]) ;
    var r = u*cellSizeR ;
    for(var v=0 ; v<NPhi ; v++){
      var phi = v*cellSizePhi ;
      var cell = new cell_object(r, phi) ;
      cells[u].push(cell) ;
      cells_linear.push(cell) ;
    }
  }
}
function draw_cells(context){
  for(var u=1 ; u<cells.length ; u++){
    for(var v=0 ; v<cells[u].length ; v++){
      cells[u][v].draw(context) ;
    }
  }
}
function cell_object(r, phi){
  this.rMid   = r   + 0.5*cellSizeR   ;
  this.phiMid = phi + 0.0*cellSizePhi ;
  this.r1   = r   - 0.0*cellSizeR   ;
  this.r2   = r   + 1.0*cellSizeR   ;
  this.phi1 = phi - 0.5*cellSizePhi ;
  this.phi2 = phi + 0.5*cellSizePhi ;
  
  this.is_touched = false ;
  this.is_in_acceptance = false ;
  this.segment = null ;
  this.particle_types = [] ;
  this.particle_types['electron'] = false ;
  this.particle_types['muon'    ] = false ;
  this.particle_types['pion'    ] = false ;
  this.particle_types['photon'  ] = false ;
  this.touch = function(particle_type){
    this.is_touched = true ;
    this.particle_types[particle_type] = true ;
  }
  this.start_collision = function(){
    this.is_touched = false ;
    this.particle_types = [] ;
  }
  this.add_segment = function(segment){
    this.is_in_acceptance = true ;
    this.segment = segment ;
  }
  this.draw = function(context){
    //if(this.is_in_acceptance==false) return ;
    
    context.save() ;
    
    var CX = X_from_x(0) ;
    var CY = Y_from_y(0) ;
    var R1 = X_from_x(this.r1) - X_from_x(0) ;
    var R2 = X_from_x(this.r2) - Y_from_y(0) ;
    
    var X1 = X_from_x(this.r1*cos(this.phi1)) ;
    var Y1 = Y_from_y(this.r1*sin(this.phi1)) ;
    var X2 = X_from_x(this.r2*cos(this.phi1)) ;
    var Y2 = Y_from_y(this.r2*sin(this.phi1)) ;
    var X3 = X_from_x(this.r1*cos(this.phi2)) ;
    var Y3 = Y_from_y(this.r1*sin(this.phi2)) ;
    var X4 = X_from_x(this.r2*cos(this.phi2)) ;
    var Y4 = Y_from_y(this.r2*sin(this.phi2)) ;
    
    context.lineWidth = 1 ;
    context.strokeStyle = '#00aaff' ;
    context.fillStyle   = '#ff00ff' ;
    var direction = (this.phi1>this.phi2) ;
    context.beginPath() ;
    context.moveTo(X1, Y1) ;
    context.arc(CX, CY, R1, this.phi1, this.phi2,  direction) ;
    context.lineTo(X4, Y4) ;
    context.arc(CX, CY, R2, this.phi2, this.phi1, !direction) ;
    context.lineTo(X1, Y1) ;
    if(this.is_touched) context.fill() ;
    context.stroke() ;
    
    context.restore() ;
  }
  this.update_segments = function(){
    if(this.is_touched && this.segment){
      this.segment.touch(this.particle_types) ;
    }
  }
}
