export default function convertTime (time) {
  return {
    toQuarterFormat() {
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
    },

    quarterToBackendFormat() {
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
  }
}