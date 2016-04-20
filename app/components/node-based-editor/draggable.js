export default function initDraggable (opts) {
  var self = opts.context
  var element = opts.element || self.element.getElementsByTagName('header')[0]

  element.addEventListener('mousedown', onMouseDown)
  element.addEventListener('mouseup', onMouseUp)

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove)
  }

  function onMouseDown (e) {
    var initialPosition = self.get('initialPosition') || positionFromRect( self.element.getBoundingClientRect() )
    self.set('initialPosition', initialPosition)

    self.set('dragOffset', dragOffset({e : e}))
    document.addEventListener('mousemove', onMouseMove)
  }

  function onMouseMove (e) {
    var x = ( e.clientX  -  self.dragOffset.x )
    var y = ( e.clientY - self.dragOffset.y )
    if (self.groupOffsetX) {
      x -= self.groupOffsetX
      y -= self.groupOffsetY
    }

    self.set('transformX', x)
    self.set('transformY', y)
    if (self.get('node-type')) {
      self.updateCables({
        type : self.get('node-type'),
        id : self.get('id'),
        groupOffsetX : self.groupOffsetX,
        groupOffsetY : self.groupOffsetY
      })
    }
  }
}

function dragOffset(opts) {
  var offset = {}
  offset.x = opts.e.offsetX
  offset.y = opts.e.offsetY
  return offset
}

function positionFromRect (rect) {
  var position = {}
  position.top = rect.top
  position.left = rect.left
  return position
}