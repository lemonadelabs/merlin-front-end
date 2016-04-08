export default function mockData() {
  var data = {
        "id": 1,
        "description": "",
        "name": "test_sim",
        "num_steps": 10,
        "unittypes": [
            {
                "sim": "http://192.168.99.100:8000/simulations/1/",
                "value": "desks"
            },
            {
                "sim": "http://192.168.99.100:8000/simulations/1/",
                "value": "$"
            },
            {
                "sim": "http://192.168.99.100:8000/simulations/1/",
                "value": "requests_handled"
            }
        ],
        "attributes": [
            {
                "sim": "http://192.168.99.100:8000/simulations/1/",
                "value": "capability"
            },
            {
                "sim": "http://192.168.99.100:8000/simulations/1/",
                "value": "budget"
            },
            {
                "sim": "http://192.168.99.100:8000/simulations/1/",
                "value": "fixed_asset"
            }
        ],
        "entities": [
            {
                "id": 3,
                "description": "",
                "name": "office building",
                "attributes": [
                    "capability",
                    "fixed_asset"
                ],
                "parent": null,
                "sim": "http://192.168.99.100:8000/simulations/1/",
                "is_source": false,
                "children": [],
                "outputs": [
                    {
                        "id": 3,
                        "description": "",
                        "name": "desks_output",
                        "parent": "http://192.168.99.100:8000/entities/3/",
                        "unit_type": "desks",
                        "copy_write": false,
                        "endpoints": [
                            {
                                "bias": 1.0,
                                "input": 2,
                                "parent": 3,
                                "sim_output": null
                            }
                        ]
                    }
                ],
                "inputs": [
                    {
                        "id": 3,
                        "description": "",
                        "name": "$_input",
                        "parent": "http://192.168.99.100:8000/entities/3/",
                        "unit_type": "$",
                        "additive_write": false
                    }
                ],
                "processes": [
                    {
                        "id": 3,
                        "description": "",
                        "name": "Building Maintenance",
                        "parent": "http://192.168.99.100:8000/entities/3/",
                        "priority": 0,
                        "process_class": "BuildingMaintainenceProcess",
                        "properties": [
                            {
                                "id": 7,
                                "description": "",
                                "name": "monthly maintenance cost",
                                "default_value": 500.0,
                                "max_value": null,
                                "min_value": null,
                                "process": "http://192.168.99.100:8000/processes/3/",
                                "property_type": 2,
                                "property_value": 500.0
                            },
                            {
                                "id": 6,
                                "description": "",
                                "name": "desks provided",
                                "default_value": 100.0,
                                "max_value": null,
                                "min_value": null,
                                "process": "http://192.168.99.100:8000/processes/3/",
                                "property_type": 2,
                                "property_value": 100.0
                            }
                        ]
                    }
                ]
            },
            {
                "id": 2,
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
                        "id": 2,
                        "description": "",
                        "name": "requests_handled_output",
                        "parent": "http://192.168.99.100:8000/entities/2/",
                        "unit_type": "requests_handled",
                        "copy_write": false,
                        "endpoints": [
                            {
                                "bias": 1.0,
                                "input": null,
                                "parent": 2,
                                "sim_output": 1
                            }
                        ]
                    }
                ],
                "inputs": [
                    {
                        "id": 2,
                        "description": "",
                        "name": "desks_input",
                        "parent": "http://192.168.99.100:8000/entities/2/",
                        "unit_type": "desks",
                        "additive_write": false
                    },
                    {
                        "id": 1,
                        "description": "",
                        "name": "$_input",
                        "parent": "http://192.168.99.100:8000/entities/2/",
                        "unit_type": "$",
                        "additive_write": false
                    }
                ],
                "processes": [
                    {
                        "id": 2,
                        "description": "",
                        "name": "Call Center Staff",
                        "parent": "http://192.168.99.100:8000/entities/2/",
                        "priority": 0,
                        "process_class": "CallCenterStaffProcess",
                        "properties": [
                            {
                                "id": 5,
                                "description": "",
                                "name": "staff per desk",
                                "default_value": 1.0,
                                "max_value": null,
                                "min_value": null,
                                "process": "http://192.168.99.100:8000/processes/2/",
                                "property_type": 2,
                                "property_value": 1.0
                            },
                            {
                                "id": 4,
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
                                "id": 3,
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
                                "id": 2,
                                "description": "",
                                "name": "months to train",
                                "default_value": 5.0,
                                "max_value": null,
                                "min_value": null,
                                "process": "http://192.168.99.100:8000/processes/2/",
                                "property_type": 2,
                                "property_value": 5.0
                            }
                        ]
                    }
                ]
            },
            {
                "id": 1,
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
                        "id": 1,
                        "description": "",
                        "name": "$_output",
                        "parent": "http://192.168.99.100:8000/entities/1/",
                        "unit_type": "$",
                        "copy_write": false,
                        "endpoints": [
                            {
                                "bias": 0.5,
                                "input": 3,
                                "parent": 1,
                                "sim_output": null
                            },
                            {
                                "bias": 0.5,
                                "input": 1,
                                "parent": 1,
                                "sim_output": null
                            }
                        ]
                    }
                ],
                "inputs": [],
                "processes": [
                    {
                        "id": 1,
                        "description": "",
                        "name": "Budget",
                        "parent": "http://192.168.99.100:8000/entities/1/",
                        "priority": 0,
                        "process_class": "BudgetProcess",
                        "properties": [
                            {
                                "id": 1,
                                "description": "",
                                "name": "amount",
                                "default_value": 10000.0,
                                "max_value": null,
                                "min_value": null,
                                "process": "http://192.168.99.100:8000/processes/1/",
                                "property_type": 2,
                                "property_value": 10000.0
                            }
                        ]
                    }
                ]
            }
        ],
        "outputs": [
            {
                "id": 1,
                "description": "",
                "name": "requests handled",
                "sim": "http://192.168.99.100:8000/simulations/1/",
                "unit_type": "requests_handled"
            }
        ]
    }

  return data
}
