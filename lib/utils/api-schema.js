/**
 * Tells if a JSON+API response is link only or not.
 *
 * @param   {Object}    reference         An api-schema section (a reference to it, to be precise).
 * @returns {Boolean}
 */
exports.isReferenceLinkOnly = function (reference) {
  /*
   * Is a link-only response if has only one GET method and
   * the GET method doesn't have a related `response`.
   */
  return (Object.keys(reference.methods).length == 1
  && reference.methods.hasOwnProperty('GET')
  && !reference.methods.GET.hasOwnProperty('response'));
};