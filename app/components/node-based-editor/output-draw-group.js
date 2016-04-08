export default function OutputDrawGroup (opts) {
  this.id = opts.id
  this.nodeType = opts.nodeType
  this.group = opts.draw.group()
  this.cables = []

  this.footprint = this.buildFoorprint()
  this.componentObject = this.appendComponent({component : opts.component})
  this.inputTerminals = this.findInputTerminals({ inputs : opts.entityData.inputs})
  this.outputTerminals = this.findOutputTerminals({ outputs : opts.entityData.outputs})
}