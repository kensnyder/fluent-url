class FluentURLSearchParams {
	constructor(searchParams) {
		if (!(searchParams instanceof URLSearchParams)) {
			searchParams = new URLSearchParams(searchParams);
		}
		this.searchParams = searchParams;
	}
	append(name, value) {
		this.searchParams.append(name, value);
		return this;
	}
	clear() {
		this.reset();
		return this;
	}
	delete(name) {
		this.searchParams.delete(name);
		return this;
	}
	entries() {
		return this.searchParams.entries();
	}
	[Symbol.iterator]() {
		return this.searchParams.entries();
	}
	extend(withParams) {
		let entries;
		if (typeof withParams === 'string') {
			withParams = new URLSearchParams(withParams);
		}
		if (withParams instanceof URLSearchParams) {
			entries = withParams.entries();
		} else {
			entries = Object.entries(withParams);
		}
		for (const [name, value] of entries) {
			this.searchParams.set(name, String(value));
		}
		return this;
	}
	forEach(callback, thisArg) {
		this.searchParams.forEach(callback, thisArg);
		return this;
	}
	get(name) {
		return this.searchParams.get(name);
	}
	getAll(name) {
		return this.searchParams.getAll(name);
	}
	has(name) {
		return this.searchParams.has(name);
	}
	keys() {
		return this.searchParams.keys();
	}
	reset() {
		// Array.from is required here because once you delete an entry,
		// the URLSearchParams object has fewer entries and some items get skipped
		for (const key of Array.from(this.searchParams.keys())) {
			this.searchParams.delete(key);
		}
		return this;
	}
	set(name, value) {
		this.searchParams.set(name, value);
		return this;
	}
	setAll(params) {
		this.reset().extend(params);
		return this;
	}
	sort() {
		this.searchParams.sort();
		return this;
	}
	toString() {
		return this.searchParams.toString();
	}
	values() {
		return this.searchParams.values();
	}
}

module.exports = FluentURLSearchParams;
