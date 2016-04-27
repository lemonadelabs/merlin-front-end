import putJSON from './put-json'

export default function persistPosition (e) {
  var id = this.get('id')
  var nodeType = this.get('node-type')

  var nodetype
  if ((_.includes(nodeType, 'output'))) {
    nodetype = 'outputs'
  } else if ((_.includes(nodeType, 'entity'))) {
    nodetype = 'entities'
  }

  var url = `api/${nodetype}/${id}/`

  var unModified = Ember.$.getJSON(url)
  unModified.then(function (response) {

    response.display_pos_x = e.clientX - e.offsetX
    response.display_pos_y = e.clientY - e.offsetY

    putJSON({
      data : response,
      url : url
    })
  })
}
