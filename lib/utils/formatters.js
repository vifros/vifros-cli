/**
 * Format time in milliseconds UTC to a human readable string.
 *
 * @param time
 * @returns {string}
 */
exports.timespanInUTCtoHuman = function (time) {
  var days = Math.floor(time / 86400);
  var hours = Math.floor((time % 86400) / 3600);
  var minutes = Math.floor(((time % 86400) % 3600) / 60);
  var seconds = Math.floor(((time % 86400) % 3600) % 60);

  return ((days) ? days + ' days, ' : '') + ((hours) ? hours + ' hours, ' : '') + ((minutes) ? minutes + ' minutes, ' : '') + seconds + ' seconds';
};

/**
 * Function to convert bytes count to a human readable string.
 * https://wiki.ubuntu.com/UnitsPolicy
 *
 * @param bytes         The bytes to convert to a human readable string.
 * @param si            Flag indicating if the scale to be used will be of SI or IEC.
 *
 * @returns {string}    The human readable string.
 */
exports.toHumanFileSize = function (bytes, si) {
  var thresh = si
    ? 1000
    : 1024;

  if (bytes < thresh) {
    return bytes + ' B';
  }

  var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (bytes >= thresh);

  return bytes.toFixed(1) + ' ' + units[u];
};