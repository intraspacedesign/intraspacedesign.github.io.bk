/**
 *
 */
namespace Gulpfile.Tasks {

  const { dest, parallel, series, src, watch } = require('gulp')

  const del = require('del')
  const plug = require('gulp-load-plugins')({ lazy: true })

  const { handleError } = require('../errorHandler')

  /**
   *
   */
  function scriptsSrc() {
    return ['src/**/*.ts']
  }

  /**
   *
   */
  function scriptsDest() {
    return 'dist'
  }

  /**
   *
   */
  function cleanScripts() {
    return del(scriptsDest())
  }


  /**
   *
   */
  function checkScripts() {
    return src(scriptsSrc())
      .pipe(plug.tslint())
      .on('error', handleError)
  }

  /**
   *
   */
  const tsProject = plug.typescript.createProject('tsconfig.json')
  function buildTypeScript() {
    return src(scriptsSrc())
      .pipe(plug.sourcemaps.init())
      .pipe(plug.typescript(tsProject))
      .pipe(plug.sourcemaps.write('.'))
      .pipe(dest(scriptsDest()))
      .on('error', handleError)
  }

  /**
   *
   */
  function bundleIndex() {
    const Builder = require('jspm').Builder
    const builder = new Builder

    return builder.buildStatic('dist/index.js', 'dist/scripts.js')
  }

  function bundleVendor() {
    const Builder = require('jspm').Builder
    const builder = new Builder

    return builder.buildStatic('dist/vendor/vendor.js', 'dist/vendor.js')
  }

  /**
   *
   */
  function watchScripts() {
    return watch(scriptsSrc(), series(parallel(checkScripts, buildTypeScript), bundleIndex))
  }

  exports.clean = cleanScripts
  exports.check = checkScripts
  exports.build = series(buildTypeScript, bundleIndex, bundleVendor)
  exports.watch = watchScripts

}