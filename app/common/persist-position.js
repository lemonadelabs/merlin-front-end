import putJSON from './put-json'

export default function persistPosition (e) {
  var id = this.get('id')
  var url = `api/entities/${id}/`

  var unModified = Ember.$.getJSON(url)
  unModified.then(function (response) {

    response.display_pos_x = e.clientX - e.offsetX
    response.display_pos_y = e.clientY - e.offsetY
    response.description = null

    putJSON({
      data : response,
      url : url
    })
  })
}
