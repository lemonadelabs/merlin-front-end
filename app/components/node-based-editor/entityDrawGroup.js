export default function EntityDrawGroup (opts) {
  console.log('sdfasdfasdf')
  this.group = opts.draw.group()
  this.id = opts.id
  this.component = opts.component
  this.footprint = this.group.rect(160, 120).attr({ fill: '#ddd' })
  this.dragRect = this.group.rect(160, 20).attr({ fill: '#999' })
}