import Ember from 'ember';
import postJSON from '../../common/post-json'
import putJSON from '../../common/put-json'

export default Ember.Component.extend({

  valueIsLoaded: false,
  didInsertElement: function () {
  },

  setValue: function () {
    var value = this.processPropertyData[this.id].data.value[ this.month - 1 ]
    this.set('value', value)
    this.set('valueIsLoaded', true)

    // this.updatePropertyOnValue = this.updateProperty.observes('value')
  }.observes('processPropertyData'),

  updateProperty: function () {
    if (this.valueIsLoaded) {

      var value = this.get('value')
      var entityId = this.get('entityId')
      var id = this.get('id')
      var month = this.get('month')

      var action = {
        "op": ":=",
        "operand_1": {
          "type": "Entity",
          "params": [entityId],
          "props": null
        },
        "operand_2": {
          "type": "Property",
          "params": [id, value],
          "props": null
        }
      }

      var event = {
        "scenario": "http://192.168.99.100:8000/api/scenarios/5/",
        "time": month,
        "actions": [action]
      }

      var promise = Ember.$.getJSON('api/scenarios/5/')
      promise.then(function (scenario) {
        scenario.events.push(event)

        putJSON({
          data : scenario,
          url : "api/scenarios/5/"
        }).then(function (response) {
          console.log(response)
        })

      })


      console.log('change')

    }

  }.observes('value'),

});
