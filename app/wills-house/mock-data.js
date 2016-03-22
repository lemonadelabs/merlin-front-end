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
      inputs: {},
      outputs: {
        money: {
          id: 100,
          endpoints: [
            {
              id: 200,
              bias: 0.2
            },
            {
              id: 201,
              bias: 0.8
            }
          ]
        }
      }
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
      outputs: {
        personel: {
          id: 101,
          endpoints: [
            {
              id: 202,
              bias: 1
            }
          ]
        }
      },
      inputs: {
        money: {
          id: 200,
          source: 100
        }
      },
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
      inputs: {
        staff: {
          id: 202,
          source: 101
        },
        money: {
          id: 201,
          source: 1
        }
      },
      outputs: {
        storage: {
          id: 102,
          endpoints: [
            {
              id: 3,
              bias: 1
            }
          ]
        }
      },
    }
  ]

  // data.outputs = [
  //   {
  //     id: 4,
  //     name: 'application serve',
  //     results: [
  //       {
  //         name: 'applications served',
  //         amount: 4000000
  //       }
  //     ],
  //     inputs: [
  //       { id: 3 }
  //     ]
  //   },
  // ]

  return data
}