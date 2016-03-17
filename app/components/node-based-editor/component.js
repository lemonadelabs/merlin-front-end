import Ember from 'ember';

export default Ember.Component.extend({
  draw: undefined,
  entityComponents: [],
  didInsertElement() {
    this.initSVGDocument()
  },

  initSVGDocument: function () {
    var draw = SVG('svg-container').size(window.innerWidth, window.innerHeight)
    this.set('draw', draw)
  },

  buldSVGNode: function () {
    var self = this
    var nodeGroups = {}

      if (self.entityComponents.length === self.model.entities.length) {
          // console.log('asdfasdfsadf')

          // var nodeGroups = self.draw.group()
          // // nodeGroups.translate(0, (130 * i))
          // // var rect = nodeGroups.rect(100, 100).attr({ fill: '#f06' })
          // var dragRect = nodeGroups.rect(100, 10).attr({ fill: '#ffffff' })

          // nodeGroups.draggable()

        _.forEach(self.entityComponents, function (component, i) {

          nodeGroups[i] = self.draw.group()
          nodeGroups[i].translate(0, (130 * i))
          var rect = nodeGroups[i].rect(100, 100).attr({ fill: '#ddd' })
          var dragRect = nodeGroups[i].rect(100, 20).attr({ fill: '#ffffff' })

          var start = {
            x: 500,
            y: 500
          }
          var destination = {
            x: 1100,
            y: 1100
          }

          var controlPt1 = {}
          controlPt1.x = (destination.x - start.x) / 2  + start.x
          controlPt1.y = start.y

          var controlPt2 = {}
          controlPt2.x = (destination.x - start.x) / 2 + start.x
          controlPt2.y = destination.y

          var line = self.draw.path(`M ${start.x} ${start.y} C ${controlPt1.x} ${controlPt1.y} ${controlPt2.x} ${controlPt2.y} ${destination.x} ${destination.y}`).fill('none').stroke({ width: 2 })
          // nodeGroups[i].draggable()

          Ember.$(document).on('mousemove', function (e) {
            destination.x = e.clientX
            destination.y = e.clientY

            controlPt1.x = (destination.x - start.x) / 2  + start.x
            controlPt1.y = start.y
            controlPt2.x = (destination.x - start.x) / 2 + start.x
            controlPt2.y = destination.y

            line.plot(`M ${start.x} ${start.y} C ${controlPt1.x} ${controlPt1.y} ${controlPt2.x} ${controlPt2.y} ${destination.x} ${destination.y}`)
          })


          Ember.$(dragRect.node).on('mouseenter', function () {
            nodeGroups[i].draggable()
          })

          Ember.$(dragRect.node).on('mouseleave', function () {
            nodeGroups[i].draggable(false)
          })

          var fobj = nodeGroups[i].foreignObject().attr({id: 'component'})
          fobj.translate(0,20)

          fobj.appendChild(component.element)

        })
      }
  }.observes('draw') //.observes('entityComponents.[]')

});
