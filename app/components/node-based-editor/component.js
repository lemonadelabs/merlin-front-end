import Ember from 'ember';
import EntityDrawGroup from './entityDrawGroup'

export default Ember.Component.extend({
  draw: undefined,
  entityComponents: [],
  entitySvgNodes: {},
  entityDrawGroups: {},
  outputTerminals: {},
  inputTerminals: {},
  didInsertElement() {
    this.initSVGDocument()
  },

  initSVGDocument: function () {
    var draw = SVG('svg-container').size(window.innerWidth, window.innerHeight)
    this.set('draw', draw)
  },

  buldSVGNodes: function () {
    var self = this
    var nodeGroups = {}

      if (self.entityComponents.length === self.model.entities.length) {


        _.forEach(self.entityComponents, function (component, i) {

          var id = component.get('id')

          self.entityDrawGroups[id]

          var entityDrawGroup = new EntityDrawGroup({
            id : id,
            draw : self.draw,
            component : component,
            entityData : _.find(self.get('model').entities, ['id', id] )
          })

          self.entityDrawGroups[id] = entityDrawGroup

          entityDrawGroup.group.translate( ((260 * i) + 30 ), ((160 * i) + 30 ))

          _.forEach(entityDrawGroup.outputTerminals, function (output, id) {
            self.outputTerminals[id] = output
          })

          _.forEach(entityDrawGroup.inputTerminals, function (input, id) {
            self.inputTerminals[id] = input
          })

        })
      }


      _.forEach(self.entityDrawGroups, function (entityDrawGroup) {
        _.forEach(entityDrawGroup.outputTerminals, function (outputTerminal, id) {
          var startPosition = Ember.$(outputTerminal.svg.node).position()
          var type = outputTerminal.type
          var endpoints = outputTerminal.endpoints
          _.forEach(endpoints, function (endpoint) {
            var inputTerminal = self.inputTerminals[endpoint.id]
            if (inputTerminal) {
              var endPosition = Ember.$(inputTerminal.svg.node).position()
              var cable = self.createBezierCurve({
                startPosition: startPosition,
                endPosition: endPosition
              })
              entityDrawGroup.cables.push(cable)
              var inputEntityGroup = self.entityDrawGroups[inputTerminal.entityId]
              inputEntityGroup.cables.push(cable)
            }
          })
        })
      })

        // function plotLine(opts) {
        //   var position = $(output.node).position()
        //   start.x = position.left
        //   start.y = position.top
        //   line.plot( self.buildBezierCurveString({ start : start, end : end }) )
        // }

        // var start = {
        //   x: 0,
        //   y: 0
        // }
        // var end = {
        //   x: 0,
        //   y: 0
        // }


        //   _.forEach(group.outputs, function (output) {

        //     Ember.$(output.node).on('mousedown', function (e) {
        //       onConnectorMouseDown({ output : output, e : e })
        //     })

        //     Ember.$(output.node).on('mouseup', function (e) {
        //       onConnectorMouseUp({ output : output, e : e })
        //     })

        //   })

        //   function onConnectorMouseDown(opts) {

        //     var line = self.createBezierCurve({
        //       start : start,
        //       end : end
        //     })

        //     var output = opts.output
        //     var e = opts.e
        //   //   give the start position to the connector clicked on
        //     var position = $(output.node).position()
        //     start.x = end.x = position.left
        //     start.y = end.y = position.top
        //     line.plot( self.buildBezierCurveString({ start : start, end : end }) )

        //     Ember.$(document).on('mousemove', followMouse )
        //     function followMouse(e) {
        //       end.x = e.clientX
        //       end.y = e.clientY
        //       line.plot( self.buildBezierCurveString({ start : start, end : end }) )
        //     }

        //     Ember.$(document).on('mouseup', unbind )
        //     function unbind() {
        //       Ember.$(document).unbind('mousemove', followMouse )
        //       Ember.$(document).unbind('mouseup', unbind )
        //     }

        //   }

        //   function onConnectorMouseUp(opts) {
        //     var position = $(output.node).position()
        //     end.x = position.left
        //     end.y = position.top
        //     line.plot( self.buildBezierCurveString({ start : start, end : end }) )
        //   }


  }.observes('draw'),

  createBezierCurve: function (opts) {
    var curveString = this.buildBezierCurveString({start : opts.startPosition, end : opts.endPosition})
    return this.draw.path( curveString ).fill('none').stroke({ width: 1 })
  },

  updateBezierCurve: function (opts) {

  },

  buildBezierCurveString: function (opts) {
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
  },

  // buildDrawgroup: function (opts) {
  //   return this.entitySvgNodes[opts.id] = this.draw.group()
  // },


});
