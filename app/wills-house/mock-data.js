export default function mockData() {
  var data = {}
  data.entities = [
    {
      tags: ['budget'],
      id: 1,
      name: 'w031',
      params: [
        {
          name: 'budget amount',
          value: 1000000
        }
      ],
      inputs: [],
      outputs: [
        {
          type: 'money',
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
      ]
    },
    {
      tags: ['staff'],
      id: 2,
      name: 'Staffing',
      params: [
        {
          name: 'staff numbers',
          value: 5
        },
        {
          name: 'average staff pay',
          value: 50000
        }
      ],

      inputs: [
        {
          type: 'money',
          id: 200,
          source: 100
        }
      ],
      outputs: [
        {
          type: 'personel',
          id: 101,
          endpoints: [
            {
              id: 202,
              bias: 1
            }
          ]
        }
      ],
    },

    {
      tags: ['resource'],
      id: 3,
      name: 'server farm',
      params: [
        {
          name: 'staffing requirement',
          requiredPersonel: 12
        }
      ],
      inputs: [
        {
          type: 'staff',
          id: 202,
          source: 101
        },
        {
          type: 'money',
          id: 201,
          source: 1
        }
      ],
      outputs: [
        {
          type: 'cyber space',
          id: 102,
          endpoints: [
            {
              id: 3,
              bias: 1
            }
          ]
        }
      ]
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