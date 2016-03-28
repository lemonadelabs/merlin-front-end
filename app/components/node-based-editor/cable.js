export default function Cable (opts) {
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

  var curveString = this.buildBezierCurveString({
    start : startPositionCSS,
    end : endPositionCSS
  })

  var cable = this.draw.path( curveString ).fill('none').stroke({ width: 1 })
  cable.outputTerminal = outputTerminal
  cable.inputTerminal = inputTerminal
  return cable

};

Cable.prototype.updatePosition = function() {
  var startPositionCSS = terminalCSSPosition(this.outputTerminal.domElement)

  var endPositionCSS = inputTerminalCSSPosition(this.inputTerminal.domElement)

  var curveString = this.buildBezierCurveString({
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

Cable.prototype.buildBezierCurveString = function(opts) {
  var start = opts.start
  var end = opts.end
  if (start.top) {
    start.x = start.left
    start.y = start.top
    end.x = end.left
    end.y = end.top
  }
  var controlPt1 = {}
  controlPt1.x = (end.x - start.x) / 2  + start.x
  controlPt1.y = start.y

  var controlPt2 = {}
  controlPt2.x = (end.x - start.x) / 2 + start.x
  controlPt2.y = end.y

  return `M ${start.x} ${start.y} C ${controlPt1.x} ${controlPt1.y} ${controlPt2.x} ${controlPt2.y} ${end.x} ${end.y}`
};