/**
 *
 */

namespace Gulpfile {

  const notifier = require('node-notifier')

  function handleError() {
    console.log(arguments)
  }

  exports.handleError = handleError

}