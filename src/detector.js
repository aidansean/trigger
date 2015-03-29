function subdetector_object(name, r1, r2, spacing_r, spacing_phi, nLayers, nWedges, nSegments, strokeColor, fillRgb0, fillRgb1, particle_responses){
  this.name = name ;
  this.r1 = r1 ;
  this.r2 = r2 ;
  this.fillRgb0 = fillRgb0 ;
  this.fillRgb1 = fillRgb1 ;
  this.strokeColor = strokeColor ;
  this.nLayers = nLayers ;
  this.layerDR = (this.r2-this.r1)/this.nLayers ;
  
  this.layers = [] ;
  for(var i=0 ; i<nLayers ; i++){
    var r1Tmp = this.r1 + (i+0)*this.layerDR ;
    var r2Tmp = this.r1 + (i+1)*this.layerDR - spacing_r ;
    this.layers.push(new subdetector_layer_object(r1Tmp, r2Tmp, spacing_phi, nWedges, nSegments, fillRgb0, fillRgb1, this.strokeColor, particle_responses)) ;
  }
  this.draw = function(context){
    for(var i=0 ; i<this.layers.length ; i++){
      this.layers[i].draw(context) ;
    }
  }
}
function subdetector_layer_object(r1, r2, spacing_phi, nWedges, nSegments, fillRgb0, fillRgb1, strokeColor, particle_responses){
  this.r1 = r1 ;
  this.r2 = r2 ;
  this.spacing = spacing_phi ;
  this.nWedges = nWedges ;
  this.fillRgb0 = fillRgb0 ;
  this.fillRgb1 = fillRgb1 ;
  this.strokeColor = strokeColor ;
  
  this.wedges = [] ;
  this.wedgeDPhi = 2*pi/this.nWedges ;
  for(var i=0 ; i<this.nWedges ; i++){
    var phi1Tmp = (i+0)*this.wedgeDPhi ;
    var phi2Tmp = (i+1)*this.wedgeDPhi - spacing_phi ;
    this.wedges.push(new subdetector_wedge_object(this.r1, this.r2, phi1Tmp, phi2Tmp, nSegments, fillRgb0, fillRgb1, this.strokeColor, particle_responses)) ;
  }
  this.draw = function(context){
    for(var i=0 ; i<this.wedges.length ; i++){
      this.wedges[i].draw(context) ;
    }
  }
}
function subdetector_wedge_object(r1, r2, phi1, phi2, nSegments, fillRgb0, fillRgb1, strokeColor, particle_responses){
  this.r1 = r1 ;
  this.r2 = r2 ;
  this.phi1 = phi1 ;
  this.phi2 = phi2 ;
  this.nSegments = nSegments ;
  this.fillRgb0 = fillRgb0 ;
  this.fillRgb1 = fillRgb1 ;
  this.strokeColor = strokeColor ;
  
  this.segments = [] ;
  this.segmentDPhi = (this.phi2-this.phi1)/nSegments ;
  var xA = this.r1*cos(this.phi1) ;
  var yA = this.r1*sin(this.phi1) ;
  var xB = this.r1*cos(this.phi2) ;
  var yB = this.r1*sin(this.phi2) ;
  var xC = this.r2*cos(this.phi1) ;
  var yC = this.r2*sin(this.phi1) ;
  var xD = this.r2*cos(this.phi2) ;
  var yD = this.r2*sin(this.phi2) ;
  
  for(var i=0 ; i<this.nSegments ; i++){
    var phi1Tmp = this.phi1 + (i-1)*this.segmentDPhi ;
    var phi2Tmp = this.phi1 + (i+0)*this.segmentDPhi ;
    var x1 = xA + (xB-xA)*(i+0)/this.nSegments ;
    var y1 = yA + (yB-yA)*(i+0)/this.nSegments ;
    var x2 = xA + (xB-xA)*(i+1)/this.nSegments ;
    var y2 = yA + (yB-yA)*(i+1)/this.nSegments ;
    var x3 = xC + (xD-xC)*(i+1)/this.nSegments ;
    var y3 = yC + (yD-yC)*(i+1)/this.nSegments ;
    var x4 = xC + (xD-xC)*(i+0)/this.nSegments ;
    var y4 = yC + (yD-yC)*(i+0)/this.nSegments ;
    this.segments.push(new subdetector_segment_object(this.r1, this.r2, phi1Tmp, phi2Tmp, x1, y1, x2, y2, x3, y3, x4, y4, fillRgb0, fillRgb1, this.strokeColor, particle_responses)) ;
  }
  this.draw = function(context){
    for(var i=0 ; i<this.segments.length ; i++){
      this.segments[i].draw(context) ;
    }
  }
}
function subdetector_segment_object(r1, r2, phi1, phi2, x1, y1, x2, y2, x3, y3, x4, y4, fillRgb0, fillRgb1, strokeColor, particle_responses){
  segments.push(this) ;
  this.r1 = r1 ;
  this.r2 = r2 ;
  this.phi1 = phi1 ;
  this.phi2 = phi2 ;
  this.fillRgb0 = fillRgb0 ;
  this.fillRgb1 = fillRgb1 ;
  this.strokeColor = strokeColor ;
  this.particle_responses = particle_responses ;
  
  this.x1 = x1 ;
  this.y1 = y1 ;
  this.x2 = x2 ;
  this.y2 = y2 ;
  this.x3 = x3 ;
  this.y3 = y3 ;
  this.x4 = x4 ;
  this.y4 = y4 ;
  
  this.X1 = X_from_x(this.x1) ;
  this.Y1 = Y_from_y(this.y1) ;
  this.X2 = X_from_x(this.x2) ;
  this.Y2 = Y_from_y(this.y2) ;
  this.X3 = X_from_x(this.x3) ;
  this.Y3 = Y_from_y(this.y3) ;
  this.X4 = X_from_x(this.x4) ;
  this.Y4 = Y_from_y(this.y4) ;
  
  this.is_touched = false ;
  
  this.response = 0 ;
  
  this.activate_cells = function(){
    for(var i=0 ; i<cells_linear.length ; i++){
      var cell = cells_linear[i] ;
      if(cell.  rMid<this.r1   ) continue ;
      if(cell.  rMid>this.r2   ) continue ;
      if(cell.phiMid<this.phi1 ) continue ;
      if(cell.phiMid>this.phi2 ) continue ;
      cell.add_segment(this) ;
    }
  }
  this.activate_cells() ;
  
  this.start_collision = function(){
    this.is_touched = false ;
    this.response = 0 ;
  }
  this.draw = function(context){
    context.save() ;
    context.beginPath() ;
    context.fillStyle   = this.fillColor ;
    context.strokeStyle = this.strokeColor ;
    context.moveTo(this.X1,this.Y1) ;
    context.lineTo(this.X2,this.Y2) ;
    context.lineTo(this.X3,this.Y3) ;
    context.lineTo(this.X4,this.Y4) ;
    context.lineTo(this.X1,this.Y1) ;
    context.closePath() ;
    context.stroke() ;
    
    if(this.response<0) this.response = 0 ;
    if(this.response>1) this.response = 1 ;
    var fr = Math.floor(this.fillRgb0[0]+this.response*(this.fillRgb1[0])) ;
    var fg = Math.floor(this.fillRgb0[1]+this.response*(this.fillRgb1[1])) ;
    var fb = Math.floor(this.fillRgb0[2]+this.response*(this.fillRgb1[2])) ;
    context.fillStyle = 'rgb(' + fr + ',' + fg + ',' + fb + ')' ;
    context.fill() ;
    context.restore() ;
  }
  
  this.touch = function(particle_types){
    this.is_touched = true ;
    if(particle_types['electron']) this.response += this.particle_responses['electron'] ;
    if(particle_types['muon'    ]) this.response += this.particle_responses['muon'    ] ;
    if(particle_types['pion'    ]) this.response += this.particle_responses['pion'    ] ;
    if(particle_types['photon'  ]) this.response += this.particle_responses['photon'  ] ;
  }
}

function make_detector(){
  var ptrkColor = 'rgb(255,255,255)' ;
  var strkColor = 'rgb(  0,150,150)' ;
  var ecalColor = 'rgb(200,  0,  0)' ;
  var hcalColor = 'rgb(150,150,255)' ;
  var mcalColor = 'rgb(  0,150,  0)' ;
  
  var ptrkRgb0 = [100,100,100] ; var ptrkRgb1 = [255,255,255] ;
  var strkRgb0 = [  0,150,150] ; var strkRgb1 = [  0,255,255] ;
  var ecalRgb0 = [100,  0,  0] ; var ecalRgb1 = [200,  0,  0] ;
  var hcalRgb0 = [ 50, 50,100] ; var hcalRgb1 = [150,150,255] ;
  var mcalRgb0 = [ 50,100, 50] ; var mcalRgb1 = [ 75,255, 75] ;
  
  var ptrkResponses = [] ;
  ptrkResponses['pion'    ] = 1.0 ;
  ptrkResponses['muon'    ] = 1.0 ;
  ptrkResponses['electron'] = 1.0 ;
  ptrkResponses['photon'  ] = 0.0 ;
  
  var strkResponses = [] ;
  strkResponses['pion'    ] = 1.0 ;
  strkResponses['muon'    ] = 1.0 ;
  strkResponses['electron'] = 1.0 ;
  strkResponses['photon'  ] = 0.0 ;
  
  var ecalResponses = [] ;
  ecalResponses['pion'    ] = 0.1 ;
  ecalResponses['muon'    ] = 0.1 ;
  ecalResponses['electron'] = 1.0 ;
  ecalResponses['photon'  ] = 1.0 ;
  
  var hcalResponses = [] ;
  hcalResponses['pion'    ] = 8.4 ;
  hcalResponses['muon'    ] = 0.1 ;
  hcalResponses['electron'] = 0.3 ;
  hcalResponses['photon'  ] = 0.3 ;
  
  var mcalResponses = [] ;
  mcalResponses['pion'    ] = 0.1 ;
  mcalResponses['muon'    ] = 1.0 ;
  mcalResponses['electron'] = 0.1 ;
  mcalResponses['photon'  ] = 0.1 ;
  
  // function subdetector_object(name, r1, r2, spacing_r, spacing_phi, nLayers, nWedges, nSegments, fillColor, strokeColor)
  var ptrk = new subdetector_object('ptrk', 0.03*Sr, 0.12*Sr, 0.01*Sr, 0.001*2*pi, 6, 12,  3, ptrkColor, ptrkRgb0, ptrkRgb1, ptrkResponses) ;
  var strk = new subdetector_object('strk', 0.13*Sr, 0.27*Sr, 0.01*Sr, 0.002*2*pi, 5, 60,  1, strkColor, strkRgb0, strkRgb1, strkResponses) ;
  var ecal = new subdetector_object('ecal', 0.30*Sr, 0.49*Sr, 0.01*Sr, 0.005*2*pi, 3, 12,  6, ecalColor, ecalRgb0, ecalRgb1, ecalResponses) ;
  var hcal = new subdetector_object('hcal', 0.52*Sr, 0.64*Sr, 0.01*Sr, 0.005*2*pi, 2, 16,  4, hcalColor, hcalRgb0, hcalRgb1, hcalResponses) ;
  var mcal = new subdetector_object('mcal', 0.70*Sr, 0.98*Sr, 0.03*Sr, 0.003*2*pi, 4, 18,  10, mcalColor, mcalRgb0, mcalRgb1, mcalResponses) ;
  
  subdetectors.push(ptrk) ;
  subdetectors.push(strk) ;
  subdetectors.push(ecal) ;
  subdetectors.push(hcal) ;
  subdetectors.push(mcal) ;
}
