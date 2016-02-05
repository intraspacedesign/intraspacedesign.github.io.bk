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
    switch (process.env.$$_CONFIGURATION) {
      case process.env.$$_VARS_DEBUG   :
      case process.env.$$_VARS_RELEASE : return ['src/**/*.scss']
    }
    return null
  }

  /**
   *
   */
  function stylesDest() {
    switch (process.env.$$_CONFIGURATION) {
      case process.env.$$_VARS_DEBUG   : return process.env.$$_SETTINGS_DEBUG_OUTDIR
      case process.env.$$_VARS_RELEASE : return process.env.$$_SETTINGS_RELEASE_OUTDIR
    }
    return null
  }

  /**
   *
   */
  function cleanStyles() {
    return del(`${stylesDest()}/**/*.{css,css.map}`)
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
  function ifConfigurationIsDebug():boolean {
    return (process.env.$$_VARS_DEBUG === process.env.$$_CONFIGURATION)
  }

  /**
   *
   */
  function buildStyles() {
    return src(stylesSrc())
      .pipe(ifConfigurationIsDebug() ? plug.sourcemaps.init() : plug.util.noop())
      .pipe(plug.sass()).on('error', plug.sass.logError)
      .pipe(ifConfigurationIsDebug ? plug.util.noop() : plug.csso())
      .pipe(ifConfigurationIsDebug() ? plug.util.noop() : plug.rename({ extname: '.min.css' }))
      .pipe(plug.flatten())
      .pipe(ifConfigurationIsDebug ? plug.sourcemaps.write('.') : plug.util.noop())
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