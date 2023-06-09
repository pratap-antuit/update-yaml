const core = require('@actions/core');
const yaml = require('js-yaml')
const fs = require('fs')


 function writeTo(content, filePath) {
  const yamlString = yaml.dump(content)
  fs.writeFileSync(filePath, yamlString, 'utf8')
  // fs.writeFile(filePath, content, err => {
  //   if (!err) return

  //   actions.warning(err.message)
  // })
}

function loopThroughObjRecurs(obj, parseObject) {
  for (const k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      loopThroughObjRecurs(obj[k], parseObject[k])
    // eslint-disable-next-line no-prototype-builtins
    } else if (obj.hasOwnProperty(k)) {
      parseObject[k] = obj[k]
    }
  }
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const inputs = core.getInput('data');
    core.info(`action input ${inputs} ...`);
    for (const k in inputs) {
      const yaml_data = yaml.load(fs.readFileSync(k, 'utf8'))
      const jsonObject = JSON.stringify(yaml_data, null, 4)
      const parseObject = JSON.parse(jsonObject)
  
      loopThroughObjRecurs(inputs[k], parseObject)
      writeTo(parseObject, k)
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
