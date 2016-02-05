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
  function partialsSrc():string[] {
    switch (process.env.$$_CONFIGURATION) {
      case process.env.$$_VARS_DEBUG   :
      case process.env.$$_VARS_RELEASE : return ['src/**/*.html']
    }
    return null
  }

  /**
   *
   */
  function partialsDest():string {
    switch (process.env.$$_CONFIGURATION) {
      case process.env.$$_VARS_DEBUG   : return process.env.$$_SETTINGS_DEBUG_OUTDIR
      case process.env.$$_VARS_RELEASE : return process.env.$$_SETTINGS_RELEASE_OUTDIR
    }
    return null
  }

  /**
   *
   */
  function cleanPartials() {
    return del(`${partialsDest()}/**/*.html`)
  }

  /**
   *
   */
  function clonePartials(skipTask) {
    return skipTask()

    let targets = null;
    switch (process.env.$$_CONFIGURATION) {
      case process.env.$$_VARS_DEBUG: targets = null
        break
      case process.env.$$_VARS_DEBUG: targets = null
        break
    }

    return src(targets())
      .pipe(dest(partialsDest()))
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
  function buildPartials() {
    const minifyHtmlConfig = {
      empty: true, loose:  true, quotes: true, spare: true
    }

    return src(partialsSrc())
      .pipe(plug.data({ process }))
      .pipe(ifConfigurationIsDebug() ? plug.sourcemaps.init() : plug.util.noop())
      .pipe(plug.nunjucks.compile())
      .pipe(ifConfigurationIsDebug() ? plug.util.noop() : plug.minifyHtml(minifyHtmlConfig))
      .pipe(ifConfigurationIsDebug() ? plug.sourcemaps.write('.') : plug.util.noop())
      .pipe(dest(partialsDest()))
  }

  /**
   *
   */
  function watchPartials() {
    return watch(partialsSrc(), parallel(buildPartials))
  }

  exports.clean = cleanPartials
  exports.clone = clonePartials
  exports.build = buildPartials
  exports.watch = watchPartials

}