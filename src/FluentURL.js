const FluentURLSearchParams = require('./FluentURLSearchParams.js');

class FluentURL {
	constructor(url, base, searchParams) {
		if (typeof base === 'object' && arguments.length === 2) {
			searchParams = base;
			base = undefined;
		}
		if (url instanceof URL) {
			this.URL = url;
		} else {
			this.URL = new URL(url, base);
		}
		this.fluentParams = new FluentURLSearchParams(this.URL.searchParams);
		if (searchParams) {
			this.qsExtend(searchParams);
		}
	}
	hash(newHash) {
		if (arguments.length === 0) {
			return this.URL.hash;
		}
		this.URL.hash = newHash;
		return this;
	}
	host(newHost) {
		if (arguments.length === 0) {
			return this.URL.host;
		}
		this.URL.host = newHost;
		return this;
	}
	hostname(newHostname) {
		if (arguments.length === 0) {
			return this.URL.hostname;
		}
		this.URL.hostname = newHostname;
		return this;
	}
	href(newHref) {
		if (arguments.length === 0) {
			return this.URL.href;
		}
		this.URL.href = newHref;
		return this;
	}
	origin() {
		return this.URL.origin;
	}
	password(newPassword) {
		if (arguments.length === 0) {
			return this.URL.password;
		}
		this.URL.password = newPassword;
		return this;
	}
	pathname(newPathname) {
		if (arguments.length === 0) {
			return this.URL.pathname;
		}
		this.URL.pathname = newPathname;
		return this;
	}
	port(newPort) {
		if (arguments.length === 0) {
			return this.URL.port;
		}
		this.URL.port = newPort;
		return this;
	}
	protocol(newProtocol) {
		if (arguments.length === 0) {
			return this.URL.protocol;
		}
		this.URL.protocol = newProtocol;
		return this;
	}
	search(newSearch) {
		if (arguments.length === 0) {
			return this.URL.search;
		}
		if (typeof newSearch === 'string') {
			this.URL.search = newSearch;
		} else {
			this.qsSetAll(newSearch);
		}
		return this;
	}
	toString() {
		return this.URL.href;
	}
	username(newUsername) {
		if (arguments.length === 0) {
			return this.URL.username;
		}
		this.URL.username = newUsername;
		return this;
	}
	qsAppend(name, value) {
		this.fluentParams.append(name, value);
		return this;
	}
	qsClear() {
		this.fluentParams.reset();
		return this;
	}
	qsDelete(name) {
		this.fluentParams.delete(name);
		return this;
	}
	qsDeleteAll(name) {
		this.fluentParams.reset();
		return this;
	}
	qsEntries() {
		return this.fluentParams.entries();
	}
	qsExtend(withParams) {
		this.fluentParams.extend(withParams);
		return this;
	}
	qsForEach(callback, thisArg) {
		return this.fluentParams.forEach(callback, thisArg);
	}
	qsGet(name) {
		return this.fluentParams.get(name);
	}
	qsGetAll(name) {
		return this.fluentParams.getAll(name);
	}
	qsHas(name) {
		return this.fluentParams.has(name);
	}
	qsKeys() {
		return this.fluentParams.keys();
	}
	qsReset() {
		this.fluentParams.reset();
		return this;
	}
	qsSet(name, value) {
		this.fluentParams.set(name, value);
		return this;
	}
	qsSetAll(params) {
		this.fluentParams.setAll(params);
		return this;
	}
	qsSort() {
		this.fluentParams.sort();
		return this;
	}
	qsValues() {
		return this.fluentParams.values();
	}
}

FluentURL.FluentUrlSearchParams = FluentURLSearchParams;

module.exports = FluentURL;
