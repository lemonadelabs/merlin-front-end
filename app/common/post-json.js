export default function postJSON(opts) {
  return Ember.$.ajax({
    url: opts.url,
    type: 'POST',
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(opts.data)
  });
}