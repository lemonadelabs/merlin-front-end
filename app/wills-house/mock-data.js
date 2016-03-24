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
          name: 'budget',
          unit: '$',
          id: 100,
          amount: 400000,
          endpoints: [
            {
              id: 200,
              bias: 0.8
            },
            {
              id: 201,
              bias: 0.2
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
          source: 100,
          amount: 320000
        }
      ],

      outputs: [
        {
          name: 'staff bandwith',
          id: 101,
          amount: 491,
          unit: 'FTE',
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
      name: 'Passport Printer',
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
          source: 101,
          amount: 491
        },
        {
          type: 'money',
          id: 201,
          source: 101,
          amount: 80000
        }
      ],
      outputs: [
        {
          name: 'passports',
          id: 102,
          amount: 100012,
          unit: 'units',
          endpoints: [
            {
              id: 3,
              bias: 1
            }
          ]
        }
        // {
        //   type: 'passports',
        //   id: 102,
        //   amount: ???,
        //   endpoints: [
        //     {
        //       id: 3,
        //       bias: 1
        //     }
        //   ]
        // }
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