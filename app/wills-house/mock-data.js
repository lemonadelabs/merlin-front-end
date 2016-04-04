export default function mockData() {
  var data = {}

  data.entities = [
        {
            "description": "",
            "name": "Budget",
            "attributes": [
                "budget"
            ],
            "parent": null,
            "sim": "http://192.168.99.100:8000/simulations/1/",
            "is_source": true,
            "children": [],
            "outputs": [
                {
                    "description": "",
                    "name": "$_output",
                    "parent": "http://192.168.99.100:8000/entities/3/",
                    "unit_type": "$",
                    "copy_write": false,
                    "endpoints": [
                        {
                            "bias": 0.5,
                            "input": "http://192.168.99.100:8000/inputconnectors/1/",
                            "parent": "http://192.168.99.100:8000/outputconnectors/3/",
                            "sim_output": null
                        },
                        {
                            "bias": 0.5,
                            "input": "http://192.168.99.100:8000/inputconnectors/3/",
                            "parent": "http://192.168.99.100:8000/outputconnectors/3/",
                            "sim_output": null
                        }
                    ]
                }
            ],
            "inputs": [],
            "processes": [
                {
                    "description": "",
                    "name": "Budget",
                    "parent": "http://192.168.99.100:8000/entities/3/",
                    "priority": 0,
                    "process_class": "BudgetProcess",
                    "properties": [
                        {
                            "description": "",
                            "name": "amount",
                            "default_value": 10000.0,
                            "max_value": null,
                            "min_value": null,
                            "process": "http://192.168.99.100:8000/processes/3/",
                            "property_type": 2,
                            "property_value": 10000.0
                        }
                    ]
                }
            ]
        },
        {
            "description": "",
            "name": "call center",
            "attributes": [
                "capability"
            ],
            "parent": null,
            "sim": "http://192.168.99.100:8000/simulations/1/",
            "is_source": false,
            "children": [],
            "outputs": [
                {
                    "description": "",
                    "name": "requests_handled_output",
                    "parent": "http://192.168.99.100:8000/entities/2/",
                    "unit_type": "requests_handled",
                    "copy_write": false,
                    "endpoints": [
                        {
                            "bias": 1.0,
                            "input": null,
                            "parent": "http://192.168.99.100:8000/outputconnectors/2/",
                            "sim_output": "http://192.168.99.100:8000/simoutputconnectors/1/"
                        }
                    ]
                }
            ],
            "inputs": [
                {
                    "description": "",
                    "name": "$_input",
                    "parent": "http://192.168.99.100:8000/entities/2/",
                    "unit_type": "$",
                    "additive_write": false
                },
                {
                    "description": "",
                    "name": "desks_input",
                    "parent": "http://192.168.99.100:8000/entities/2/",
                    "unit_type": "desks",
                    "additive_write": false
                }
            ],
            "processes": [
                {
                    "description": "",
                    "name": "Call Center Staff",
                    "parent": "http://192.168.99.100:8000/entities/2/",
                    "priority": 0,
                    "process_class": "CallCenterStaffProcess",
                    "properties": [
                        {
                            "description": "",
                            "name": "months to train",
                            "default_value": 5.0,
                            "max_value": null,
                            "min_value": null,
                            "process": "http://192.168.99.100:8000/processes/2/",
                            "property_type": 2,
                            "property_value": 5.0
                        },
                        {
                            "description": "",
                            "name": "staff number",
                            "default_value": 100.0,
                            "max_value": null,
                            "min_value": null,
                            "process": "http://192.168.99.100:8000/processes/2/",
                            "property_type": 2,
                            "property_value": 100.0
                        },
                        {
                            "description": "",
                            "name": "staff salary",
                            "default_value": 5.0,
                            "max_value": null,
                            "min_value": null,
                            "process": "http://192.168.99.100:8000/processes/2/",
                            "property_type": 2,
                            "property_value": 5.0
                        },
                        {
                            "description": "",
                            "name": "staff per desk",
                            "default_value": 1.0,
                            "max_value": null,
                            "min_value": null,
                            "process": "http://192.168.99.100:8000/processes/2/",
                            "property_type": 2,
                            "property_value": 1.0
                        }
                    ]
                }
            ]
        },
        {
            "description": "",
            "name": "office building",
            "attributes": [
                "fixed_asset",
                "capability"
            ],
            "parent": null,
            "sim": "http://192.168.99.100:8000/simulations/1/",
            "is_source": false,
            "children": [],
            "outputs": [
                {
                    "description": "",
                    "name": "desks_output",
                    "parent": "http://192.168.99.100:8000/entities/1/",
                    "unit_type": "desks",
                    "copy_write": false,
                    "endpoints": [
                        {
                            "bias": 1.0,
                            "input": "http://192.168.99.100:8000/inputconnectors/2/",
                            "parent": "http://192.168.99.100:8000/outputconnectors/1/",
                            "sim_output": null
                        }
                    ]
                }
            ],
            "inputs": [
                {
                    "description": "",
                    "name": "$_input",
                    "parent": "http://192.168.99.100:8000/entities/1/",
                    "unit_type": "$",
                    "additive_write": false
                }
            ],
            "processes": [
                {
                    "description": "",
                    "name": "Building Maintenance",
                    "parent": "http://192.168.99.100:8000/entities/1/",
                    "priority": 0,
                    "process_class": "BuildingMaintainenceProcess",
                    "properties": [
                        {
                            "description": "",
                            "name": "monthly maintenance cost",
                            "default_value": 500.0,
                            "max_value": null,
                            "min_value": null,
                            "process": "http://192.168.99.100:8000/processes/1/",
                            "property_type": 2,
                            "property_value": 500.0
                        },
                        {
                            "description": "",
                            "name": "desks provided",
                            "default_value": 100.0,
                            "max_value": null,
                            "min_value": null,
                            "process": "http://192.168.99.100:8000/processes/1/",
                            "property_type": 2,
                            "property_value": 100.0
                        }
                    ]
                }
            ]
        }
    ]


  // data.entities = [
  //   {
  //     tags: ['budget'],
  //     id: 1,
  //     name: 'w031',
  //     params: [
  //       {
  //         name: 'budget amount',
  //         value: 1000000
  //       }
  //     ],
  //     inputs: [],
  //     outputs: [
  //       {
  //         name: 'budget',
  //         unit: '$',
  //         id: 100,
  //         amount: 400000,
  //         endpoints: [
  //           {
  //             id: 200,
  //             bias: 0.8
  //           },
  //           {
  //             id: 201,
  //             bias: 0.2
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     tags: ['staff'],
  //     id: 2,
  //     name: 'Staffing',
  //     params: [
  //       {
  //         name: 'staff numbers',
  //         value: 5
  //       },
  //       {
  //         name: 'average staff pay',
  //         value: 50000
  //       }
  //     ],

  //     inputs: [
  //       {
  //         type: 'money',
  //         id: 200,
  //         source: 100,
  //         amount: 320000
  //       }
  //     ],

  //     outputs: [
  //       {
  //         name: 'staff bandwith',
  //         id: 101,
  //         amount: 491,
  //         unit: 'FTE',
  //         endpoints: [
  //           {
  //             id: 202,
  //             bias: 1
  //           }
  //         ]
  //       }
  //     ],
  //   },

  //   {
  //     tags: ['resource'],
  //     id: 3,
  //     name: 'Passport Printer',
  //     params: [
  //       {
  //         name: 'staffing requirement',
  //         requiredPersonel: 12
  //       }
  //     ],
  //     inputs: [
  //       {
  //         type: 'staff',
  //         id: 202,
  //         source: 101,
  //         amount: 491
  //       },
  //       {
  //         type: 'money',
  //         id: 201,
  //         source: 101,
  //         amount: 80000
  //       }
  //     ],
  //     outputs: [
  //       {
  //         name: 'passports',
  //         id: 102,
  //         amount: 100012,
  //         unit: 'units',
  //         endpoints: [
  //           {
  //             id: 3,
  //             bias: 1
  //           }
  //         ]
  //       }
  //       // {
  //       //   type: 'passports',
  //       //   id: 102,
  //       //   amount: ???,
  //       //   endpoints: [
  //       //     {
  //       //       id: 3,
  //       //       bias: 1
  //       //     }
  //       //   ]
  //       // }
  //     ]
  //   }
  // ]

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