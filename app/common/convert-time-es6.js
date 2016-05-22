export function toQuater (time) {
  var year = Number( time.substring(0,4) )
  var month = Number( time.substring(5,7) )

  var quarter
  if (month <= 3) {
    quarter = 1
  } else if (month <= 6) {
    quarter = 2
  } else if (month <= 9) {
    quarter = 3
  } else {
    quarter = 4
  }

  return {
    year : year,
    value : quarter,
  }
}

export function quarterToBackend(time) {
  var year = String(time.year)
  var quarter = time.value
  var day = '01'
  var month
  if (quarter === 1) {
    month = '01'
  } else if (quarter === 2) {
    month = '04'
  } else if (quarter === 3) {
    month = '07'
  } else if (quarter === 4) {
    month = '10'
  }
  var formatted = `${year}-${month}-${day}`
  return formatted
}

export function clicksBetween(opts) {
  var start = opts.a
  var end = opts.b

  if (typeof start === 'string') {
    start = toQuater(start)
  }
  if (typeof end === 'string') {
    end = toQuater(end)
  }

  var quarters = 0
  var maxValue = opts.maxValue || 4

  if (start.year === end.year) { // for periods withtin 1 year
    for (var j = start.value; j < end.value; j++) {
      quarters += 1
    }
    return quatersToClicks( quarters )
  }

  for (var i = start.year; i <= end.year; i++) {
    if (i === start.year) { // for the first year, it continues to the end
      for (var j = start.value; j <= maxValue; j++) {
        quarters += 1
      }
    } else if (i === end.year) { // for the last year
      for (var j = 1; j < end.value; j++) {
        quarters += 1
      }
    } else { // for every other year
      for (var j = 1; j <= maxValue; j++) {
        quarters += 1
      }
    }
  }
  return quatersToClicks( quarters )
}

function quatersToClicks(quaters) {
  return quaters * 3
}