function four_lepton_mass_histogram(){
  this.nBins = histogram_nBins ;
  this.bins = [] ;
  this.binsInOrder_array = [] ;
  this.nHiggs = 0 ;
  for(var i=0 ; i<this.nBins ; i++){
    this.bins.push(0) ;
    this.binsInOrder_array.push(0) ;
  }
  this.drawStyle = histogram_drawStyle ;
  this.mass_min = mass_min ;
  this.mass_max = mass_max ;
  
  // Used for the animation
  this.binsInOrder = [] ;
  this.binsInOrder_index = 0 ;
  
  this.color = '#000000' ;
  
  this.add_mass = function(mass){
    if(mass<this.mass_min) return ;
    if(mass>this.mass_max) return ;
    var index = Math.floor((this.nBins+0)*(mass-this.mass_min)/(this.mass_max-this.mass_min)) ;
    this.bins[index]++ ;
    this.binsInOrder.push(index) ;
  }
  this.add_Higgs = function(){
    this.nHiggs++ ;
  }
  this.max_height = function(){
    var result = 0 ;
    for(var i=0 ; i<this.bins.length ; i++){
      if(this.bins[i]>result) result = 1*this.bins[i] ;
    }
    return result ;
  }
  this.nEvents = function(){
    var total = 0 ;
    for(var i=0 ; i<this.bins.length ; i++){
      total += this.bins[i] ;
    }
    return total ;
  }
  this.draw = function(context, theBins){
    var m = 0.15 ; // margin
    var w = canvas.width  ;
    var h = canvas.height ;
    var pw = w*(1-2*m) ;
    var ph = h*(1-2*m) ;
    var mh = this.max_height()+2*sqrt(this.max_height()) ;
    context.fillStyle = 'rgb(255,255,255)' ;
    context.fillRect(0,0,w,h) ;
    context.fillStyle = this.color ;
    context.strokeStyle = this.color ;
    context.textAlign = 'center' ;
    context.font = '20px arial' ;
    context.strokeRect(w*m,h*m,pw,ph) ;
    
    var x_xAxisTitle = w*0.6 ;
    var y_xAxisTitle = h - 0.25*m*h ;
    context.fillText('mass (four leptons) [GeV]', x_xAxisTitle, y_xAxisTitle) ;
    
    var x_yAxisTitle = w*m*0.5 ;
    var y_yAxisTitle = h*0.1 ;
    context.fillText('events', x_yAxisTitle, y_yAxisTitle) ;
    
    var bin_width = pw/(theBins.length) ;
    for(var i=0 ; i<=theBins.length ; i++){
      var mass = Math.floor(this.mass_min + i*(this.mass_max-this.mass_min)/(theBins.length)) ;
      var x = w*m + (i+0.0)*bin_width ;
      var y = h - 0.5*m*h ;
      var tickLength = 0.1*m*h ;
      if(i%histogram_xAxisLAbelFrequency==0){
        context.fillText(mass, x, y) ;
        tickLength *=2 ;
      }
      
      context.beginPath() ;
      context.moveTo(x, h-1*m*h-tickLength) ;
      context.lineTo(x, h-1*m*h+tickLength) ;
      context.stroke() ;
      context.closePath() ;
      
      if(theBins[i]==0) continue ;
      
      if(this.drawStyle=='rect'){
        var x1 = w*m + i*bin_width ;
        var y1 = h - h*m ;
        context.fillRect(x1, y1, bin_width, -ph*theBins[i]/(1+mh)) ;
      }
      else{
        var x2 = w*m + (i+0.5)*bin_width ;
        var y2 = h -h*m - ph*theBins[i]/(1+mh) ;
        context.beginPath() ;
        context.arc(x2,y2,5,0,2*pi,true) ;
        context.closePath() ;
        context.fill() ;
        var err = 0.5*ph*sqrt(theBins[i])/(1+mh) ;
        context.beginPath();
        context.moveTo(x2,y2-err) ;
        context.lineTo(x2,y2+err) ;
        context.stroke() ;
        context.closePath() ;
      }
    }
    context.beginPath() ;
    var di = 1 ;
    if(mh>=10  ) di =   2 ;
    if(mh>=20  ) di =   5 ;
    if(mh>=100 ) di =  20 ;
    if(mh>=200 ) di =  50 ;
    if(mh>=1000) di = 200 ;
    if(mh>=2000) di = 500 ;
    for(var i=0 ; i<=mh ; i+=di){
      var x = m*w ;
      var y = h-h*m-ph*i/(1+mh) ;
      context.moveTo(x-5,y) ;
      context.lineTo(x+5,y) ;
      context.fillText(i,0.5*m*w,y) ;
    }
    context.stroke() ;
  }
  this.animate = function(){
    if(this.binsInOrder_index>=this.binsInOrder.length){
      var w = canvas.width  ;
      var h = canvas.height ;
      context.font = 0.1*w + 'px arial' ;
      var nSigma = 3.6 + random()*0.6 ;
      context.fillText(nSigma.toPrecision(2)+' \u03C3!!', 0.7*w, 0.25*h) ;
      
      if(ATLAS_sigma<1) ATLAS_sigma = nSigma ;
      else if(  CMS_sigma<1) CMS_sigma   = nSigma ;
      
      return ;
    }
    this.binsInOrder_array[this.binsInOrder[this.binsInOrder_index]]++ ;
    this.draw(context, this.binsInOrder_array) ;
    this.binsInOrder_index++ ;
    window.setTimeout(animate_histogram, delay_animate_histogram) ;
  }
}
function animate_histogram(){
  histogram.animate() ;
}

