/**
 *
 */
namespace Gulpfile.Tasks {

  const { parallel, series } = require('gulp')

  const browserSync = require('browser-sync').create()

  const scripts = require('./scripts')
  const styles = require('./styles')

  /**
   *
   */
  function serve() {
    return browserSync.init({
      files: [
        '{dist,tmp,src}/**/*.{css,html,js}',
      ],
      server: {
        baseDir: [ 'dist', 'tmp', 'src' ]
      }
    })
  }

  /**
   *
   */
  function watch() {
    scripts.watch()
    styles.watch()
  }

  exports.build = series(
    parallel(
      scripts.clean,
      styles.clean
    ),
    parallel(
      scripts.check, scripts.build,
      styles.check, styles.build
    )
  )

  exports.start = series(
    parallel(
      scripts.clean,
      styles.clean
    ),
    parallel(
      scripts.check, scripts.build,
      styles.check, styles.build
    ),
    parallel(watch, serve)
  )

}