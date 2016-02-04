/**
 *
 */
namespace Gulpfile.Tasks {

  const { dest, parallel, src, watch } = require('gulp')

  const del = require('del')
  const plug = require('gulp-load-plugins')({ lazy: true })

  const { handleError } = require('../errorHandler')

  /**
   *
   */
  function stylesSrc() {
    return ['src/**/*.scss']
  }

  /**
   *
   */
  function stylesDest() {
    return 'dist'
  }

  /**
   *
   */
  function cleanStyles() {
    return del(stylesDest())
  }


  /**
   *
   */
  function checkStyles() {
    const config = {
      bundleExec: true
    }

    return src(stylesSrc())
      .pipe(plug.scssLint(config))
      .on('error', handleError)
  }

  /**
   *
   */
  function buildStyles() {
    return src(stylesSrc())
      .pipe(plug.sourcemaps.init())
      .pipe(plug.sass()).on('error', plug.sass.logError)
      .pipe(plug.flatten())
      .pipe(plug.sourcemaps.write('.'))
      .pipe(dest(stylesDest()))
      .on('error', handleError)
  }

  /**
   *
   */
  function watchStyles() {
    return watch(stylesSrc(), parallel(checkStyles, buildStyles))
  }

  exports.clean = cleanStyles
  exports.check = checkStyles
  exports.build = buildStyles
  exports.watch = watchStyles

}