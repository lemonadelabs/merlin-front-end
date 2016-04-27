export default function putJSON(opts) {
  return Ember.$.ajax({
    url: opts.url,
    type: 'PUT',
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(opts.data)
  });
}