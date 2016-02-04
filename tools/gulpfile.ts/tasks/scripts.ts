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
  function builder(src, dest) {
    return function buildStatic() {
      const Builder = require('jspm').Builder
      const builder = new Builder

      return builder.buildStatic(src, dest)
    }
  }

  const buildScripts = series(
    buildTypeScript,
    parallel(
      builder('dist/index.js',         'dist/scripts.js'),
      builder('dist/vendor/vendor.js', 'dist/vendor.js')
    )
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