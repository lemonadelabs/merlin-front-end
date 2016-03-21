export default function Cable (opts) {
  this.draw = opts.draw
  this.outputTerminal = opts.outputTerminal
  this.inputTerminal = opts.inputTerminal
  this.svg = this.buildSvg()
}


Cable.prototype.buildSvg = function(opts) {

};

Cable.prototype.update = function(opts) {

};