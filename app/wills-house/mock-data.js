export default function mockData() {
  var data = {}
  data.entities = [
    {
      tags: ['budget'],
      id: 1,
      name: 'w031',
      processes: [
        {
          name: 'budget amount',
          amount: 1000000
        }
      ],
      inputs: [],
      outputs: [
        {id: 2},
        {id: 3}
      ]
    },
    {
      tags: ['staff'],
      id: 2,
      processes: [
        {
          name: 'staff',
          staff: 10,
          senior: 4,
          junior: 6
        }
      ],
      inputs: [
        {id: 1}
      ],
      outputs: [
        {id: 3}
      ]
    },
    {
      tags: ['resource'],
      id: 3,
      name: 'server farm',
      processes: [
        {
          name: 'staffing requirement',
          requiredPersonel: 12
        }
      ],
      inputs: [
        {id: 1}
      ],
      outputs: [
        {id: 3},
      ]
    }
  ]

  data.outputs = [
    {
      id: 4,
      name: 'application serve',
      results: [
        {
          name: 'applications served',
          amount: 4000000
        }
      ],
      inputs: [
        { id: 3 }
      ]
    },
  ]

  return data
}