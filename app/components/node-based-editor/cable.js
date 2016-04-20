export default function Cable (opts) {
  this.guides = []
  this.draw = opts.cableParent

  this.outputTerminal = opts.outputTerminal
  this.inputTerminal = opts.inputTerminal
  this.svg = this.init(opts)
}


Cable.prototype.init = function(opts) {
  var cableParent = opts.cableParent
  var outputTerminal = opts.outputTerminal
  var inputTerminal = opts.inputTerminal


  var cable = cableParent.path( ).fill('none').stroke({ width: 3, color : opts.color })
  cable.outputTerminal = outputTerminal

  if (inputTerminal && outputTerminal) {

    cable.inputTerminal = inputTerminal

    var startPositionCSS = terminalCSSPosition(outputTerminal.$domElement)

    var endPositionCSS = terminalCSSPosition(inputTerminal.$domElement)

    var curveString = this.buildPathString({
      start : startPositionCSS,
      end : endPositionCSS
    })
    cable.plot( curveString )
  } else {
    console.log('cable is flying!')
  }

  return cable

};

Cable.prototype.flyTo = function(opts) {
  var coords = {}
  if (this.outputTerminal) {
    coords.start = terminalCSSPosition(this.outputTerminal.$domElement)
    coords.end = opts.mouse
  } else if (this.inputTerminal) {
    coords.start = opts.mouse
    coords.end = terminalCSSPosition(this.inputTerminal.$domElement)
  }
  var curveString = this.buildPathString(coords)
  this.svg.plot( curveString )
};

Cable.prototype.updatePosition = function(opts) {
  var startPositionCSS = terminalCSSPosition(this.outputTerminal.$domElement)
  var endPositionCSS = terminalCSSPosition(this.inputTerminal.$domElement)

  if (opts.groupOffsetX) {
    startPositionCSS.top -= opts.groupOffsetY
    startPositionCSS.left -= opts.groupOffsetX
    endPositionCSS.top -= opts.groupOffsetY
    endPositionCSS.left -= opts.groupOffsetX
  }

  var curveString = this.buildPathString({
    start : startPositionCSS,
    end : endPositionCSS
  })
  this.svg.plot( curveString )
};


function terminalCSSPosition (terminal) {
  var position = {}
  var boundingBox = terminal[ 0 ].getBoundingClientRect()
  position.left = boundingBox.left + boundingBox.width / 2
  position.top = boundingBox.top + boundingBox.height / 2

  return position

}


Cable.prototype.buildPathString = function (opts) {
  if (opts.start.top) {
    opts.start.x = opts.start.left
    opts.start.y = opts.start.top
  }
  if (opts.end.top) {
    opts.end.x = opts.end.left
    opts.end.y = opts.end.top
  }

  if (opts.start.x > opts.end.x) {
    return this.buildReversePathString(opts)
  } else {
    return this.buildStandardPathString(opts)
  }
};

Cable.prototype.buildReversePathString = function(opts) {

  // _.forEach(this.guides, function ( guide) {
  //   guide.remove()
  // })

  var start = opts.start
  var end = opts.end

  var midPt = {}
  var controlPt1 = {}
  var controlPt2 = {}
  var controlPt3 = {}
  var controlPt4 = {}

  midPt.x = end.x - (end.x - start.x)/2
  midPt.y = start.y + (end.y - start.y) / 2
  // this.guides.push( this.draw.rect(5, 5).fill('#ffffff').radius(5).translate(midPt.x, midPt.y) )

  controlPt1.x = start.x + ((start.x - end.x) / 10)
  controlPt1.y = start.y
  // this.guides.push( this.draw.rect(5, 5).radius(5).translate(controlPt1.x, controlPt1.y) )

  controlPt2.x = controlPt1.x
  controlPt3.x = end.x + ((end.x - start.x) / 10)

  var ratio =  ( midPt.x - end.x ) / ( Math.abs(end.y - midPt.y) )
  if (ratio < 1) {
    controlPt2.y = midPt.y + (ratio - 1) * ( midPt.y - start.y ) / 2
    // refactored from:  controlPt2.y = midPt.y - (midPt.y - start.y) / 2 + ( (midPt.y - start.y) / 2 ) * ratio
    controlPt3.y = end.y - (ratio + 1) * ( end.y - midPt.y ) / 2
    // refactored from:  controlPt3.y = end.y - (end.y - midPt.y) / 2 - ( (end.y - midPt.y) / 2 ) * ratio
  } else {
    controlPt2.y =  midPt.y
    controlPt3.y =  controlPt2.y
  }
  // this.guides.push( this.draw.rect(5, 5).radius(5).translate(controlPt2.x, controlPt2.y) )
  // this.guides.push( this.draw.rect(5, 5).radius(5).translate(controlPt3.x, controlPt3.y) )

  controlPt4.x = controlPt3.x
  controlPt4.y = end.y
  // this.guides.push( this.draw.rect(5, 5).radius(5).translate(controlPt4.x, controlPt4.y) )

  return `M ${start.x} ${start.y}
          C ${controlPt1.x} ${controlPt1.y} ${controlPt2.x} ${controlPt2.y} ${midPt.x} ${midPt.y}
          C ${controlPt3.x} ${controlPt3.y} ${controlPt4.x} ${controlPt4.y}  ${end.x} ${end.y}`
};

Cable.prototype.buildStandardPathString = function(opts) {
  var start = opts.start
  var end = opts.end
  var controlPt1 = {}
  controlPt1.x = (end.x - start.x) / 2  + start.x
  controlPt1.y = start.y

  var controlPt2 = {}
  controlPt2.x = (end.x - start.x) / 2 + start.x
  controlPt2.y = end.y

  return `M ${start.x} ${start.y} C ${controlPt1.x} ${controlPt1.y} ${controlPt2.x} ${controlPt2.y} ${end.x} ${end.y}`


};