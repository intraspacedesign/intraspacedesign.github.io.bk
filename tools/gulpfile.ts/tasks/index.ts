/**
 *
 */
namespace Gulpfile.Tasks {

  const { parallel, series } = require('gulp')

  const browserSync = require('browser-sync').create()
  const chalk = require('chalk')
  const log = require('gulplog')
  const prettyTime = require('pretty-time')

  const partials = require('./partials')
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
        baseDir: [ 'dist', 'tmp/serve', 'src' ]
      }
    })
  }

  class Timer {
    private timers = {};
    constructor() {
    }

    public time(label, callback) {
      if (this.timers[label]) {
        throw new Error(`Time "${label}" is already defined.`)
      }
      this.timers[label] = process.hrtime()
      callback()
    }

    public endTime(label, callback) {
      if (!this.timers[label]) {
        throw new Error(`Time "${label}" is not defined.`)
      }

      var time = prettyTime(process.hrtime(this.timers[label]))
      log.info(
        'Finished', '\'' + chalk.magenta(label) + '\'',
        'after', chalk.bold.red(time)
      );

      delete this.timers[label]
      callback()
    }
  }

  const timer = new Timer()

  /**
   *
   */
  function watch() {
    partials.watch()
    scripts.watch()
    styles.watch()
  }

  exports.build = series(
    (nextTask) => timer.time('task:build', nextTask),
    parallel(
      partials.clean,
      scripts.clean,
      styles.clean
    ),
    parallel(
      partials.clone, partials.build,
      scripts.check, scripts.build,
      styles.check, styles.build
    ),
    (done) => timer.time('task:build', done)
  )

  exports.start = series(
    (nextTask) => timer.time('task:start', nextTask),
    parallel(
      partials.clean,
      scripts.clean,
      styles.clean
    ),
    parallel(
      partials.clone, partials.build,
      scripts.check, scripts.build,
      styles.check, styles.build
    ),
    (nextTask) => timer.endTime('task:start', nextTask),
    parallel(watch, serve)
  )

}