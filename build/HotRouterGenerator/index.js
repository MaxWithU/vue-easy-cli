const path = require('path')
var fs = require('fs')
function resolve (str) {
  return path.join(__dirname, '../../src/page', str)
}

function componentFormat (str) {
  let comp = str.toLowerCase().replace(/\//g, '-')
  return `<${comp}></${comp}>`
}

function componentImport (str) {
  return `
  import ${str.split('/').reduce((result, item) => {
    return result + item[0].toUpperCase() + item.substring(1).toLowerCase()
  })} from 'components/${str.toLowerCase().replace(/\//g, '-')}'
  `
}

function componentInclude (str) {
  return str.split('/').reduce((result, item) => {
    return result + item[0].toUpperCase() + item.substring(1).toLowerCase()
  })
}

function setTemplate (bool, str) {
  if (bool) {
    return `
<template>
  <router-view></router-view>
</template>
<script>
  export default {
    components: {
    },
    data () {
      return {}
    }
  }
</script>

    `
  } else {
    fs.mkdir(path.join(__dirname, '../../src/components', `mt${str.toLowerCase().replace(/\//g, '-')}`), function (err) {
      if (err) {
        fs.open(path.join(__dirname, '../../src/components', `mt${str.toLowerCase().replace(/\//g, '-')}`, 'index.vue'), 'r', '777', function (err) {
          if (err) {
            writeComponent(str)
          } else {
          }
        })
      } else {
        writeComponent(str)
      }
    })
    return `
<template>
  ${componentFormat('mt' + str)}
</template>
<script>
  ${componentImport('mt' + str)}
  export default {
    components: {
      ${componentInclude('mt' + str)}
    },
    data () {
      return {}
    }
  }
</script>

    `
  }
}
function setComponent () {
  return `
    <template>
    </template>
    <script>
      export default {
        components: {},
        data () {
          return {}
        },
        methods: {}
      }
    </script>
  `
}
function writeComponent (str) {
  fs.writeFile(
    path.join(__dirname, '../../src/components', `mt${str.toLowerCase().replace(/\//g, '-')}`, 'index.vue'),
    setComponent(), function (err, res) {
      if (err) {
      } else {
        console.log('WRITEIN：component >>> ' + str)
      }
    }
  )
}

function writeFile (item) {
  fs.writeFile(
    resolve(item.path + '/index.vue'),
    setTemplate(item.children, item.path), function (err, res) {
      if (err) {
      } else {
        console.log('WRITEIN：' + resolve(item.path + '/index'))
      }
    }
  )
}

function _generator (Arr) {
  if (Arr) {
    Arr.forEach((item) => {
      fs.mkdir(resolve(item.path), function (err) {
        if (err) {
          fs.open(resolve(item.path + '/index.vue'), 'r', '777', function (err) {
            if (err) {
              writeFile(item)
            } else {
            }
            if (item.children) {
              _generator(item.children)
            }
          })
        } else {
          writeFile(item)
        }
      })
    })
  }
}
function HotRouterGenerator () {
}
HotRouterGenerator.prototype.apply = function (compiler) {

  compiler.plugin('run', function (compiler, callback) {
    callback()
  })
  compiler.plugin('compilation', () => {
    fs.readFile(path.join(__dirname, '../../src/router/router.json'), {encoding: 'utf8', flag: 'r'}, (err, data) => {
      if (err) {
      }
      if (data) {
        _generator(JSON.parse(data))
      }
    })
  })
}
module.exports = HotRouterGenerator
