/**
 * Imports
 */

const uuid = require('uuid')
const {mkdirs} = require('fs-extra')
const {join} = require('path')
const prosh = require('prosh')
const co = require('co')

const download = require('./download')
const bundle = require('./bundle')
const upload = require('./upload')

const dependencies = co.wrap(function * (dir, name, pkg) {
  //work in directory {current directory}/projects/{name}
  let projectDir = join(dir, name)
  yield mkdirs(projectDir)                                    //FIX: Is this necessary? If we're adding do we need to make a directory? Or is this a temporary directory?
  yield download(projectDir, name)

  const rawFile = new XMLHttpRequest();
  const filePath = "file://" + projectDir + "/package.json"
  rawFile.open("GET", , false);
  var jsonData = ""
  rawFile.onreadystatechange = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
              jsonData = rawFile.responseText;
          }
      }
  }
  rawFile.close();
  const me = JSON.parse(jsonData)

  //bundle the new contents of projectDir
  //code: 0 if browserify successful, != 0 if unsuccesful
  //output: output of browserify command
  //bundleName: {hash of file contents}.js
  var {code, output, bundleName} = yield bundle(projectDir)
  if (code !== 0) {
    return {error: true, output: message + output}
  }

  //saving build under {name}/builds/{buildName}; updating {name}/package.json and {name}/yarn.lock
  yield upload(projectDir, name, bundleName)

  return {error: false, output: message + output, bundleName}
})

module.exports = dependencies