export default function mockData() {
  var data = {}
  data.timelineObjects = [
    {
      name : "project1",
      start : {
        year : 2016,
        value : 1,  // m or q
      },
      end : {
        year : 2016,
        value : 3
      },
      capex: 1000000,
    },
    {
      name:"project2",
      start : {
        year : 2017,
        value : 1,
      },
      end : {
        year : 2017,
        value : 4
      },
      capex: 1000000,
    },
    {
      name:"project3",
      start : {
        year : 2018,
        value : 1,
      },
      end : {
        year : 2019,
        value : 3
      },
      capex: 1000000,
    }
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
    units : 'quarters'
  }

  return data

}
