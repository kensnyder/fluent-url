const FluentURL = require('./src/FluentURL.js');
const FluentURLSearchParams = require('./src/FluentURLSearchParams.js');

function url(...args) {
	return new FluentURL(...args);
}

url.FluentURL = FluentURL;
url.FluentURLSearchParams = FluentURLSearchParams;

module.exports = url;
module.exports.default = url;
