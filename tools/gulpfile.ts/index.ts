namespace Gulpfile {

  const { task } = require('gulp')

  const { build, start } = require('./tasks')

  task('build', build)
  task('start', start)

}