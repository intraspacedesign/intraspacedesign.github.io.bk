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
    switch (process.env.$$_CONFIGURATION) {
      case process.env.$$_VARS_DEBUG   :
      case process.env.$$_VARS_RELEASE : return ['src/**/*.ts']
    }
    return null
  }

  /**
   *
   */
  function scriptsDest() {
    switch (process.env.$$_CONFIGURATION) {
      case process.env.$$_VARS_DEBUG   : return process.env.$$_SETTINGS_DEBUG_OUTDIR
      case process.env.$$_VARS_RELEASE : return process.env.$$_SETTINGS_RELEASE_OUTDIR
    }
    return null
  }

  /**
   *
   */
  function cleanScripts() {
    return del(`${scriptsDest()}/**/*.{js,min.js}`)
  }


  /**
   *
   */
  function checkScripts(nextTask) {
    return src(scriptsSrc())
      .pipe(plug.tslint())
      .pipe(plug.tslint.report('verbose'), {
        emitError: false,
        summarizeFailureOutput: true
      }).on('error', () => nextTask())
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
  function builder(src, dest) {
    return function buildStatic() {
      const Builder = require('jspm').Builder
      const builder = new Builder

      return builder.buildStatic(src, dest)
    }
  }

  /**
   *
   */
  function ifConfigurationIsDebug():boolean {
    return (process.env.$$_VARS_DEBUG === process.env.$$_CONFIGURATION)
  }

  function bundleScripts() {
    return src([
        `${scriptsDest()}/scripts.js`,
        `${scriptsDest()}/vendor.js`
      ])
      .pipe(ifConfigurationIsDebug() ? plug.util.noop() : plug.uglify())
      .pipe(ifConfigurationIsDebug() ? plug.util.noop() : plug.rename({ extname: '.min.js' }))
      .pipe(dest(scriptsDest()))
  }

  const buildScripts = series(
    buildTypeScript,
    parallel(
      builder(`${scriptsDest()}/index.js`,  `${scriptsDest()}/scripts.js`),
      builder(`${scriptsDest()}/vendor.js`, `${scriptsDest()}/vendor.js`)
    ),
    bundleScripts
  )

  /**
   *
   */
  function watchScripts() {
    return watch(scriptsSrc(), series(
      parallel(
        checkScripts,
        buildTypeScript
      ),
      builder('dist/index.js', 'dist/scripts.js')
    ))
  }

  exports.clean = cleanScripts
  exports.check = checkScripts
  exports.build = buildScripts
  exports.watch = watchScripts

}