const FluentURLSearchParams = require('./FluentURLSearchParams.js');

class FluentURL {
	constructor(url = undefined, base = undefined, searchParams = undefined) {
		if (typeof base === 'object' && arguments.length === 2) {
			searchParams = base;
			base = undefined;
		}
		if (url) {
			this.href(url, base);
			this.fluentParams = new FluentURLSearchParams(this.URL.searchParams);
		} else {
			// created with no arguments or all empty arguments
			this.href('/');
			this.fluentParams = new FluentURLSearchParams({});
		}
		if (searchParams) {
			this.qsExtend(searchParams);
		}
	}
	isRelative() {
		return !!this._ignoreBase;
	}
	makeRelative() {
		this.port('').username('').password('');
		this._ignoreBase = this.protocol() + '//' + this.hostname();
		return this;
	}
	hash(newHash) {
		if (arguments.length === 0) {
			return this.URL.hash;
		}
		this.URL.hash = newHash;
		return this;
	}
	hashPath(newPath) {
		if (arguments.length === 0) {
			return this.URL.hash.split('?')[0].slice(1);
		}
		const [, query] = this.URL.hash.split('?');
		const qs = query && query.length ? `?${query}` : '';
		this.URL.hash = `${newPath}${qs}`;
		return this;
	}
	hashSearch(newSearch) {
		if (arguments.length === 0) {
			const [, curr] = this.URL.hash.split('?');
			if (!curr) {
				return {};
			}
			const entries = new URLSearchParams(curr).entries();
			return Object.fromEntries(entries);
		}
		const [pathStr] = this.URL.hash.split('?');
		const query = new URLSearchParams(newSearch).toString();
		const qs = query.length ? `?${query}` : '';
		this.URL.hash = `${pathStr}${qs}`;
		return this;
	}
	host(newHost) {
		if (arguments.length === 0) {
			if (this._ignoreBase) {
				return undefined;
			}
			return this.URL.host;
		}
		this.URL.host = newHost;
		return this;
	}
	hostname(newHostname) {
		if (arguments.length === 0) {
			if (this._ignoreBase) {
				return undefined;
			}
			return this.URL.hostname;
		}
		this.URL.hostname = newHostname;
		return this;
	}
	href(url, base = undefined) {
		if (arguments.length === 0) {
			this.URL.search = this.fluentParams.toString();
			const href = this.URL.href;
			if (this.isRelative()) {
				return href.replace(this._ignoreBase, '');
			}
			return href;
		}
		if (url instanceof URL) {
			this.URL = url;
		} else {
			const match = String(url).match(/^\.{0,2}\//);
			if (match && !base) {
				this._ignoreBase = 'http://fluent-url-base';
				if (match[0].startsWith('.')) {
					this._ignoreBase += '/relative';
				}
				url = this._ignoreBase + url;
			} else {
				this._ignoreBase = undefined;
			}
			this.URL = new URL(url, base);
		}
		this.fluentParams = new FluentURLSearchParams(this.URL.searchParams);
		return this;
	}
	origin() {
		if (this._ignoreBase) {
			return undefined;
		}
		return this.URL.origin;
	}
	password(newPassword) {
		if (arguments.length === 0) {
			if (this._ignoreBase) {
				return undefined;
			}
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
			if (this._ignoreBase) {
				return undefined;
			}
			return this.URL.port;
		}
		this.URL.port = newPort;
		return this;
	}
	protocol(newProtocol) {
		if (arguments.length === 0) {
			if (this._ignoreBase) {
				return undefined;
			}
			return this.URL.protocol;
		}
		this.URL.protocol = newProtocol;
		return this;
	}
	search(newSearch) {
		if (arguments.length === 0) {
			const search = this.fluentParams.toString();
			return search ? '?' + search : '';
		}
		if (typeof newSearch === 'string') {
			this.URL.search = newSearch;
		} else {
			this.qsSetAll(newSearch);
		}
		return this;
	}
	searchObject(object) {
		if (arguments.length === 0) {
			return this.qsToObject();
		}
		this.qsSetAll(object);
		return this;
	}
	toString() {
		return this.href();
	}
	export(
		withProps = [
			'hash',
			'host',
			'hostname',
			'href',
			'isRelative',
			'origin',
			'password',
			'pathname',
			'port',
			'protocol',
			'search',
			'searchObject',
			'username',
		]
	) {
		const obj = {};
		for (const prop of withProps) {
			if (typeof this[prop] === 'function') {
				obj[prop] = this[prop]();
			}
		}
		return obj;
	}
	import(values) {
		for (const [prop, value] of Object.entries(values)) {
			if (typeof this[prop] === 'function') {
				this[prop](value);
			}
		}
		return this;
	}
	clone() {
		this.URL.search = this.fluentParams.toString();
		return new FluentURL(this.URL);
	}
	username(newUsername) {
		if (arguments.length === 0) {
			if (this._ignoreBase) {
				return undefined;
			}
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
	qsDeleteAll() {
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
	qsToString() {
		return this.fluentParams.toString();
	}
	qsToObject() {
		return this.fluentParams.toObject();
	}
}

FluentURL.FluentUrlSearchParams = FluentURLSearchParams;

module.exports = FluentURL;
