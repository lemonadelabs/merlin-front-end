export default function Cable (opts) {
  this.guides = []
  this.draw = opts.draw
  this.outputTerminal = opts.outputTerminal
  this.inputTerminal = opts.inputTerminal
  this.svg = this.init(opts)
}


Cable.prototype.init = function(opts) {
  var outputTerminal = opts.outputTerminal
  var type = outputTerminal.type
  var startPositionCSS = terminalCSSPosition(outputTerminal.domElement)


  var inputTerminal = opts.inputTerminal
  var endPositionCSS = inputTerminalCSSPosition(inputTerminal.domElement)

  var curveString = this.buildPathString({
    start : startPositionCSS,
    end : endPositionCSS
  })

  var cable = opts.cable.plot( curveString ).fill('none').stroke({ width: 3, color : opts.color })
  // var cable = this.draw.path( curveString ).fill('none').stroke({ width: 3, color : opts.color }) //.stroke(opts.color)
  // $(cable.node).prependTo($('svg:first-of-type'))
  cable.outputTerminal = outputTerminal
  cable.inputTerminal = inputTerminal
  return cable

};

Cable.prototype.updatePosition = function() {
  var startPositionCSS = terminalCSSPosition(this.outputTerminal.domElement)

  var endPositionCSS = inputTerminalCSSPosition(this.inputTerminal.domElement)

  var curveString = this.buildPathString({
    start : startPositionCSS,
    end : endPositionCSS
  })
  this.svg.plot( curveString )
};


function terminalCSSPosition (terminal) {
  return terminal.position()
}

function inputTerminalCSSPosition (terminal) {
  var position = terminalCSSPosition(terminal)
  position.left -= 30
  return position
}

Cable.prototype.buildPathString = function (opts) {
  if (opts.start.top) {
    opts = formatPositionOpts(opts)
  }

  if (opts.start.x > opts.end.x) {
    return this.buildReversePathString(opts)
  } else {
    return this.buildStandardPathString(opts)
  }
};

function formatPositionOpts(opts) {
  opts.start.x = opts.start.left
  opts.start.y = opts.start.top
  opts.end.x = opts.end.left
  opts.end.y = opts.end.top
  return opts
}

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