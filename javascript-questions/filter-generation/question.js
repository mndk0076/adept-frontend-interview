/**
You will use data that we use in production. You will need to generate unique filters from a list of data.

Data list format:
[
  {
    "_id":"5a6771db8393c714a22cfd93",
    "text":"sleeveless jacket",
    "metadata":{
      "created_by":"5a217e6b166ffe2c4a99667b"
    },
    "revision":"new",
    "status":"PENDING",
    "annotations":[
      {
        "value":"SLEEVELESS",
        "type":"ATTRIBUTE",
        "name":"SLEEVE_TYPE"
      },
      {
        "type":"CATEGORY",
        "name":"JACKET"
      }
    ]
  },
  {
    "_id":"5a6771db8393c714a22cfd86",
    "text":"jacket",
    "metadata":{
      "created_by":"5a217e6b166ffe2c4aAAAAAA"
    },
    "revision":"new",
    "status":"APPROVED",
    "annotations":[
      {
        "value":"COTTON",
        "type":"ATTRIBUTE",
        "name":"MATERIAL"
      },
      {
        "type":"CATEGORY",
        "name":"JACKET"
      }
    ]
  }
]

Expected output:
{
  "attribute":[
    "MATERIAL:COTTON",
    "SLEEVE_TYPE:SLEEVELESS"
  ],
  "category":[
    "JACKET"
  ],
  "status":[
    "APPROVED",
    "PENDING"
  ],
  "creator":[
    {
      "value":"5a217e6b166ffe2c4a99667b"
    },
    {
      "value":"5a217e6b166ffe2c4aAAAAAA"
    }
  ]
}

Requirements
- The `attribute` and `category` values will need to be pulled out of the `annotations` field value and aggregated based on `type`
- All lists (`attribute`, `category`, `status` and `creator`) should be unique with no falsey values.
- `attribute`, `category` and `status` should be sorted alphabetically.
- Try to get it running as fast as possible while using ES6 features and syntax.
- Avoid using for, forEach, for...in or for...of (There are close to 12K entries).
- The example data above is a simplified schema, the one you will be using will have many other fields.
- Run the file using `node question.js` in your terminal and you will see the output.
- You can alternatively have the result saved to a JSON file named `result.json`.
- You can find the expected output in ./data/result-full.js
*/

/**
 * Answer
 */
const data = require('./data/queries.json');
const parseData = JSON.parse(JSON.stringify(data));
const result = {}
const attributeData = [];
const categoryData = [];
const statusData = [];
const creatorData = [];
// console.log(data[0].annotations[0].type);

// Loop through the json data and get the values needed
parseData.map(key => {
  // Status Data
  statusData.push(key.status)
  
  // Creator Data
  let creator = key.metadata.created_by;
  if(creator != null){
    creatorData.push({'value' : creator})
  }

  // Lopping through annotations to get type attribute and category
  key.annotations.map(key => {
    let value = key.value;
    let type = key.type;
    
    // Determing the aggregated value
    if(typeof value != 'undefined' && typeof value !==  ' '){
      value = ':'+ key.value;
    }else{
      value = '';
    }

    if(typeof type != 'undefined' && typeof type !=  ''){
      if(type === "ATTRIBUTE"){
        // Attribute Data
        attributeData.push(key.name + value);
      }else if(type === "CATEGORY"){
        // Category Data
        categoryData.push(key.name + value);
      }
    }
  })
});

// Sort and Filter
const SortandFilter = (data, result) => {
  // Sort list
  result = data.sort(function (a, b) {
    return a.localeCompare(b);
  });
  // Filter list - filtering the duplicates
  result = data.filter((e, i, a) => e !== a[i - 1])

  return result;
}

// Creator Filter
const CreatorFilter = (data, result) => {
  const uniq = new Set(data.map(e => JSON.stringify(e)));
  result = Array.from(uniq).map(e => JSON.parse(e));
  
  return result
}

result.attributes = SortandFilter(attributeData)
result.category = SortandFilter(categoryData)
result.status = SortandFilter(statusData)
result.creator = CreatorFilter(creatorData)

console.log('result: ', result);

// Writing result to result.json
const fs = require('fs');
const path = require('path');
fs.writeFileSync(path.resolve(__dirname, './data/result.json'), JSON.stringify(result));

