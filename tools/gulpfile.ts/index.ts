namespace Gulpfile {

  enum CONFIGURATION { DEBUG, RELEASE }

  process.env.$$_CONFIGURATION = CONFIGURATION.RELEASE

  process.env.$$_VARS_DEBUG = CONFIGURATION.DEBUG
  process.env.$$_VARS_RELEASE = CONFIGURATION.RELEASE
  process.env.$$_SETTINGS_DEBUG_OUTDIR = 'tmp/serve',
  process.env.$$_SETTINGS_RELEASE_OUTDIR = 'dist'

  const { task } = require('gulp')

  const { build, start } = require('./tasks')

  task('build', build)
  task('start', start)

}