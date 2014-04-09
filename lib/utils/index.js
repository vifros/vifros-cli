/**
 * Iterate recursively over an object.
 *
 * @param {Object}      object
 * @param {Array}       stack
 * @param {Function}    cb
 */
exports.iterate = function iterate(object, stack, cb) {
	for (var property in object) {
		if (object.hasOwnProperty(property)) {
			if (typeof object[property] == 'object') {
				/*
				 * An inner object was found. Iterate recursively over it.
				 */
				var new_stack = stack.concat(property);

				if (typeof cb == 'function') {
					cb(object[property], new_stack);
				}

				iterate(object[property], new_stack, cb);
			}
			else {
				// Not an inner object.
			}
		}
	}
};

/**
 * Find an inner property using a path within an object and return it.
 *
 * @param   {Object}    object
 * @param   {String}    path        A path to the object: 'a.path.to.the.object'
 * @returns {Object|null}
 */
exports.findProp = function findProp(object, path) {
	var args = path.split('.');
	var i;
	var l;

	for (i = 0, l = args.length; i < l; i++) {
		if (!object.hasOwnProperty(args[i]))
			return;
		object = object[args[i]];
	}

	return object;
};