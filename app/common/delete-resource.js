export default function deleteResource (url) {
  return Ember.$.ajax({
    url: url,
    type: 'DELETE',
    contentType: "application/json; charset=utf-8",
  });
}