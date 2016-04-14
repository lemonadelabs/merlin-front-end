export default function initDraggable (context) {
  var self = context
  var dragBar = self.element.getElementsByTagName('header')[0]

  dragBar.addEventListener('mousedown', onMouseDown)
  dragBar.addEventListener('mouseup', onMouseUp)

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
    var x = ( e.clientX * self.zoom.inverseScale - (self.initialPosition.left * self.zoom.inverseScale + self.dragOffset.x * self.zoom.inverseScale) )
    var y = ( e.clientY * self.zoom.inverseScale - (self.initialPosition.top * self.zoom.inverseScale + self.dragOffset.y * self.zoom.inverseScale) )
    $(self.element).css({
      'transform' : `translate(${x}px,${y}px)`
    })

    self.updateCables({
      type : self.get('node-type'),
      id : self.get('id')
    })
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