export default function persistPosition (e) {
  console.log(e)
  var id = this.get('id')
  var nodeType = this.get('node-type')
  console.log(nodeType)

  var nodetype
  if ((_.includes(nodeType, 'output'))) {
    nodetype = 'outputs'
  } else if ((_.includes(nodeType, 'entity'))) {
    nodetype = 'entities'
  }

  var url = `api/${nodetype}/${id}/`

  var unModified = Ember.$.getJSON(url)
  unModified.then(function (response) {

    response.display_pos_x = e.clientX
    response.display_pos_y = e.clientY

    Ember.$.ajax({
      url: url,
      type: 'PUT',
      data: response,
      success: function(result) {
        // console.log(result)
      }
    });
  })




}