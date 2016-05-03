export default function mockData() {
  var data = {}
  data.projects = [
    {
      name : "project1",
      research : {
        cost : 10000000,
        start : {
          year : 2016,
          value : 1,
        },
        end : {
          year : 2016,
          value : 3
        },
      },
      development : {
        cost : 10000000,
        start : {
          year : 2016,
          value : 4,
        },
        end : {
          year : 2017,
          value : 3
        },
      }
    },
    {
      name : "project2",
      research : {
        cost : 5000000,
        start : {
          year : 2016,
          value : 3,
        },
        end : {
          year : 2017,
          value : 3
        },
      },
      development : {
        cost : 15000000,
        start : {
          year : 2017,
          value : 4,
        },
        end : {
          year : 2018,
          value : 4
        },
      }
    },
    {
      name : "project3",
      research : {
        cost : 2000000,
        start : {
          year : 2017,
          value : 1,
        },
        end : {
          year : 2017,
          value : 2
        },
      },
      development : {
        cost : 18000000,
        start : {
          year : 2018,
          value : 1,
        },
        end : {
          year : 2019,
          value : 1
        },
      }
    },
  ]
  data.metadata = {
    start : {
      year : 2016,
      value : 1
    },
    end : {
      year : 2019,
      value : 4
    },
    units : 'quarters',
    availableFunds: 60000000
  }

  return data

}


// export default function mockData() {
//   var data = {}
//   data.timelineObjects = [
//     {
//       name : "project1",
//       start : {
//         year : 2016,
//         value : 1,  // m or q
//       },
//       end : {
//         year : 2016,
//         value : 3
//       },
//       capex: 1000000,
//     },
//     {
//       name:"project2",
//       start : {
//         year : 2017,
//         value : 1,
//       },
//       end : {
//         year : 2017,
//         value : 4
//       },
//       capex: 1000000,
//     },
//     {
//       name:"project3",
//       start : {
//         year : 2018,
//         value : 1,
//       },
//       end : {
//         year : 2019,
//         value : 3
//       },
//       capex: 1000000,
//     }
//   ]
//   data.metadata = {
//     start : {
//       year : 2016,
//       value : 1
//     },
//     end : {
//       year : 2019,
//       value : 4
//     },
//     units : 'quarters'
//   }

//   return data

// }
