export function convertTimesInObject (object) {
  _.forEach(object, function (value, key) {
    if (key.indexOf('date') > -1) {
      var isEndDate = (key.indexOf('end') > -1) ? true : false;
      object[key] = switchTimeFormat({
        time : value,
        isEndDate : isEndDate
      })
    }
  })
}

function switchTimeFormat (opts) {
  if (typeof time === 'object') {
    return quarterToBackend(opts)
  } else {
    return toQuater(opts.time)
  }
}

export function toQuater (time) {
  var month = Number( time.substring(5,7) )
  var quarter
  if (month <= 3) {
    quarter = 3
  } else if (month <= 6) {
    quarter = 4
  } else if (month <= 9) {
    quarter = 1
  } else {
    quarter = 2
  }
  var year = Number( time.substring(0,4) )
  year += (quarter < 3) ? 1 : 0 ;

  return {
    year : year,
    value : quarter,
  }
}

export function quarterToBackend(opts) {
  var time = opts.time
  if (typeof time === 'string') { return time }
  var isEndDate = opts.isEndDate

  var quarter = time.value
  var year = String ( (quarter < 3) ?  time.year - 1 : time.year )

  var month
  if (quarter === 1) {
    month = 7
  } else if (quarter === 2) {
    month = 10
  } else if (quarter === 3) {
    month = 1
  } else if (quarter === 4) {
    month = 4
  }
  month += (isEndDate) ? 2 : 0

  var day = (isEndDate) ? daysInMonth(month, year) : 1
  var formatted = formatTimeForBackend(day, month, year)
  return formatted
}

function formatTimeForBackend(day, month, year) {
  return `${ year }-${ formatDayOrMonth(month) }-${ formatDayOrMonth(day) }`
}

function formatDayOrMonth(t) {
  return String(t).length === 1 ? `0${t}` : String(t)
}

function daysInMonth(month,year) {
   return new Date(year, month, 0).getDate();
}

function additiveInverse(number) {
  return number * -1
}

function isBEarlier(opts) {
  var a = opts.a
  var b = opts.b
  if (a.year > b.year) { return true }
  if (b.year > a.year) { return false }
  if (a.year === b.year) {
    return (b.value < a.value) ? true : false
  }
}

function ensureQuartersInObject(opts) {
  _.forEach(opts, function (value, key) {
    opts[key] = ensureQuarterFormat(value)
  })
}

function ensureQuarterFormat(time) {
  return ( typeof time === 'string' ) ? toQuater(time) : time
}

export function incrementTimeBy1 (opts) {
  var maxValue = opts.maxValue || 4
  var time = ensureQuarterFormat( _.cloneDeep(opts.time) )
  if (time.value === maxValue) {
    time.year +=1
    time.value = 1
  } else {
    time.value += 1
  }
  return time
}



export function incrementTimeBy3(opts) {
  var time = opts.time

  var one = incrementTimeBy1({ time : time })
  var two = incrementTimeBy1({ time : one })
  var three = incrementTimeBy1({ time : two })
  return three
}


export function clicksBetween(opts) {

  ensureQuartersInObject(opts)
  var inverse = isBEarlier(opts)
  if ( inverse ) {
    var start = opts.b
    var end = opts.a
  } else {
    var start = opts.a
    var end = opts.b
  }


  start = ensureQuarterFormat(start)
  end = ensureQuarterFormat(end)

  var quarters = 0
  var maxValue = opts.maxValue || 4

  if (start.year === end.year) { // for periods withtin 1 year
    for (var j = start.value; j < end.value; j++) {
      quarters += 1
    }
  } else {
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
  }
  var clicks = quatersToClicks( quarters )
  return inverse ? additiveInverse( clicks ) : clicks

}

function quatersToClicks(quaters) {
  return quaters * 3
}