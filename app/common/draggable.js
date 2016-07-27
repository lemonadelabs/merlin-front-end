/**
* this module enables a dom element to be draggable.
* it can integrate with persist-position module to persist informtation to an api on mouse up
*
* @module draggable
* @param {Object} opts
*   opts.element element to become draggable
*   opts.context context of element
* @return {Array} array of ids
*/

export default function initDraggable (opts) {
  var persistPosition = opts.persistPosition
  var self = opts.context
  var element = opts.element || self.element.getElementsByTagName('header')[0]

  element.addEventListener('mousedown', onMouseDown)
  element.addEventListener('mouseup', onMouseUp)

  function onMouseUp(e) {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    if ( persistPosition ) { persistPosition(e) }
  }

  function onMouseDown (e) {
    var initialPosition = self.get('initialPosition') || positionFromRect( self.element.getBoundingClientRect() )
    self.set('initialPosition', initialPosition)

    self.set('dragOffset', dragOffset({e : e}))
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function onMouseMove (e) {
    var x = ( e.clientX  -  self.dragOffset.x )
    var y = ( e.clientY - self.dragOffset.y )
    if (self.get('node-type')) { // for nodes
      x -= self.groupOffsetX
      y -= self.groupOffsetY
      self.updateCables({
        type : self.get('node-type'),
        id : self.get('id'),
        groupOffsetX : self.groupOffsetX,
        groupOffsetY : self.groupOffsetY
      })
    } else { // for the background
      var cssOffset = 2000
      x += cssOffset
      y += cssOffset
    }
    self.set('transformX', x)
    self.set('transformY', y)
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
