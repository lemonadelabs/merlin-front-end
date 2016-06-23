import { module, test } from 'qunit';
import * as projectsTraversal from 'merlin/common/projects-traversal';

module('Unit | Common | projects-traversal | getScenarioIds()');

test('getScenarioIds will take an array of projects, and return an array of scenario ids in chronological order.', function(assert) {
  let expected = [9,5,11,6,2,10,3,12,4,7,8]
  let result = projectsTraversal.getScenarioIds(projects)
  let message = `expected: ${expected}, result : ${result}`
  assert.deepEqual(result, expected, message);
});

// "scenario": 9, "start_date": "2016-07-01",
// "scenario": 5, "start_date": "2016-10-01",
// "scenario": 11, "start_date": "2017-01-01",
// "scenario": 6, "start_date": "2017-04-01",
// "scenario": 2, "start_date": "2017-07-01",
// "scenario": 10, "start_date": "2017-10-01",
// "scenario": 3, "start_date": "2018-01-01",
// "scenario": 12, "start_date": "2018-04-01",
// "scenario": 4, "start_date": "2018-07-01",
// "scenario": 7, "start_date": "2019-01-01",
// "scenario": 8, "start_date": "2019-10-01",

var projects = [
    {
        "id": 1,
        "name": "adsf",
        "description": "description",
        "phases": [
            {
                "id": 1,
                "name": "asdf",
                "description": "description",
                "project": 1,
                "scenario": 2,
                "investment_cost": 0,
                "service_cost": 0,
                "start_date": "2017-07-01",
                "end_date": "2018-06-30",
                "is_active": true
            }
        ],
        "priority": 1,
        "type": "run",
        "is_ringfenced": false,
        "achievability": 5,
        "attractiveness": 5,
        "dependencies": []
    },
    {
        "id": 2,
        "name": "asdf",
        "description": "description",
        "phases": [
            {
                "id": 2,
                "name": "asdf",
                "description": "description",
                "project": 2,
                "scenario": 3,
                "investment_cost": 0,
                "service_cost": 0,
                "start_date": "2018-01-01",
                "end_date": "2018-12-31",
                "is_active": true
            }
        ],
        "priority": 1,
        "type": "run",
        "is_ringfenced": false,
        "achievability": 5,
        "attractiveness": 5,
        "dependencies": []
    },
    {
        "id": 3,
        "name": "asdf",
        "description": "description",
        "phases": [
            {
                "id": 3,
                "name": "asdf",
                "description": "description",
                "project": 3,
                "scenario": 4,
                "investment_cost": 0,
                "service_cost": 0,
                "start_date": "2018-07-01",
                "end_date": "2019-06-30",
                "is_active": true
            }
        ],
        "priority": 1,
        "type": "run",
        "is_ringfenced": false,
        "achievability": 5,
        "attractiveness": 5,
        "dependencies": []
    },
    {
        "id": 4,
        "name": "asdf",
        "description": "description",
        "phases": [
            {
                "id": 7,
                "name": "asdf",
                "description": "description",
                "project": 4,
                "scenario": 8,
                "investment_cost": 3,
                "service_cost": 3,
                "start_date": "2019-10-01",
                "end_date": "2020-06-30",
                "is_active": true
            },
            {
                "id": 6,
                "name": "asdf",
                "description": "description",
                "project": 4,
                "scenario": 5,
                "investment_cost": 0,
                "service_cost": 0,
                "start_date": "2016-10-01",
                "end_date": "2017-03-31",
                "is_active": true
            },
            {
                "id": 5,
                "name": "asdf",
                "description": "description",
                "project": 4,
                "scenario": 7,
                "investment_cost": 0,
                "service_cost": 0,
                "start_date": "2019-01-01",
                "end_date": "2019-09-30",
                "is_active": true
            },
            {
                "id": 4,
                "name": "sdf",
                "description": "description",
                "project": 4,
                "scenario": 6,
                "investment_cost": 0,
                "service_cost": 0,
                "start_date": "2017-04-01",
                "end_date": "2018-03-31",
                "is_active": true
            }
        ],
        "priority": 1,
        "type": "run",
        "is_ringfenced": false,
        "achievability": 5,
        "attractiveness": 5,
        "dependencies": []
    },
    {
        "id": 5,
        "name": "asdf",
        "description": "description",
        "phases": [
            {
                "id": 11,
                "name": "sdf",
                "description": "description",
                "project": 5,
                "scenario": 12,
                "investment_cost": 0,
                "service_cost": 0,
                "start_date": "2018-04-01",
                "end_date": "2018-12-31",
                "is_active": true
            },
            {
                "id": 10,
                "name": "asdf",
                "description": "description",
                "project": 5,
                "scenario": 11,
                "investment_cost": 0,
                "service_cost": 0,
                "start_date": "2017-01-01",
                "end_date": "2017-09-30",
                "is_active": true
            },
            {
                "id": 9,
                "name": "sadf",
                "description": "description",
                "project": 5,
                "scenario": 10,
                "investment_cost": 0,
                "service_cost": 0,
                "start_date": "2017-10-01",
                "end_date": "2018-03-31",
                "is_active": true
            },
            {
                "id": 8,
                "name": "asfd",
                "description": "description",
                "project": 5,
                "scenario": 9,
                "investment_cost": 0,
                "service_cost": 0,
                "start_date": "2016-07-01",
                "end_date": "2016-12-31",
                "is_active": true
            }
        ],
        "priority": 1,
        "type": "run",
        "is_ringfenced": false,
        "achievability": 5,
        "attractiveness": 5,
        "dependencies": []
    }
]