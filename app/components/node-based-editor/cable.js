export default function Cable (opts) {
  this.draw = opts.draw
  this.outputTerminal = opts.outputTerminal
  this.inputTerminal = opts.inputTerminal
  this.svg = this.init(opts)
}


Cable.prototype.init = function(opts) {
  var outputTerminal = opts.outputTerminal
  var type = outputTerminal.type
  var startPositionCSS = Ember.$(outputTerminal.svg.node).position()

  var inputTerminal = opts.inputTerminal
  var endPositionCSS = Ember.$(inputTerminal.svg.node).position()

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
  var startPositionCSS = terminalCSSPosition(this.outputTerminal)
  var endPositionCSS = terminalCSSPosition(this.inputTerminal)

  var curveString = this.buildBezierCurveString({
    start : startPositionCSS,
    end : endPositionCSS
  })
  this.svg.plot( curveString )
};

function terminalCSSPosition (terminal) {
  return Ember.$(terminal.svg.node).position()
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