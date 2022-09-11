const FluentURL = require('./FluentURL.js');
const FluentURLSearchParams = require('./FluentURLSearchParams.js');

describe('FluentURL constructor', () => {
	const testUrl = 'https://user:pass@sub.example.com:8443/foo/?q=hello#hash';

	it('should construct with url string', () => {
		const url = new FluentURL(testUrl);
		expect(url.URL).toBeInstanceOf(URL);
		expect(url.fluentParams).toBeInstanceOf(FluentURLSearchParams);
	});
	it('should construct with URL object', () => {
		const url = new FluentURL(new URL(testUrl));
		expect(url.URL).toBeInstanceOf(URL);
	});
	it('should construct with base url', () => {
		const url = new FluentURL('/search', 'https://example.com/admin');
		expect(url.toString()).toBe('https://example.com/search');
	});
	it('should construct with searchParams', () => {
		const url = new FluentURL('https://example.com/admin', { a: 'one' });
		expect(url.toString()).toBe('https://example.com/admin?a=one');
	});
	it('should construct with base and searchParams', () => {
		const url = new FluentURL('/foo', 'https://example.com', {
			a: 'one',
		});
		expect(url.toString()).toBe('https://example.com/foo?a=one');
	});
	it('should construct with no arguments', () => {
		const url = new FluentURL();
		url
			.protocol('https')
			.hostname('example.com')
			.pathname('/foo')
			.searchObject({ a: 'one' });
		expect(url.toString()).toBe('https://example.com/foo?a=one');
	});
});
describe('FluentURL methods', () => {
	const testUrl = 'https://user:pass@sub.example.com:8443/foo/?q=hello#hash';
	it('should export all details', () => {
		const url = new FluentURL(testUrl);
		expect(url.export()).toEqual({
			hash: '#hash',
			host: 'sub.example.com:8443',
			hostname: 'sub.example.com',
			href: testUrl,
			isRelative: false,
			origin: 'https://sub.example.com:8443',
			password: 'pass',
			pathname: '/foo/',
			port: '8443',
			protocol: 'https:',
			search: '?q=hello',
			searchObject: { q: 'hello' },
			username: 'user',
		});
	});
	it('should export only valid requested details', () => {
		const url = new FluentURL(testUrl);
		expect(url.export(['host', 'protocol', 'notAThing'])).toEqual({
			host: 'sub.example.com:8443',
			protocol: 'https:',
		});
	});
	it('should import requested values', () => {
		const url = new FluentURL();
		url.import({
			hash: '#hash',
			hostname: 'sub.example.com',
			password: 'pass',
			pathname: '/foo/',
			port: '8443',
			protocol: 'https:',
			searchObject: { q: 'hello' },
			username: 'user',
			notAThing: 42,
		});
		expect(url.href()).toBe(testUrl);
	});
	it('should clone ok', () => {
		const url1 = new FluentURL(testUrl).searchObject({ a: 'one' });
		const url2 = url1.clone();
		expect(url1.href()).toBe(url2.href());
	});
	it('should get and set hash', () => {
		const url = new FluentURL(testUrl);
		expect(url.hash()).toBe('#hash');
		expect(url.hash('#a')).toBe(url);
		expect(url.hash()).toBe('#a');
	});
	it('should get and set host', () => {
		const url = new FluentURL(testUrl);
		expect(url.host()).toBe('sub.example.com:8443');
		expect(url.host('example.com')).toBe(url);
		expect(url.host()).toBe('example.com:8443');
	});
	it('should get and set hostname', () => {
		const url = new FluentURL(testUrl);
		expect(url.hostname()).toBe('sub.example.com');
		expect(url.hostname('example.com')).toBe(url);
		expect(url.hostname()).toBe('example.com');
	});
	it('should get and set href', () => {
		const url = new FluentURL(testUrl);
		expect(url.href()).toBe(testUrl);
		const newHref = 'http://httpbin.org/foo/?bar=1#baz';
		expect(url.href(newHref)).toBe(url);
		expect(url.href()).toBe(newHref);
	});
	it('should get origin', () => {
		const url = new FluentURL(testUrl);
		expect(url.origin()).toBe('https://sub.example.com:8443');
	});
	it('should get and set password', () => {
		const url = new FluentURL(testUrl);
		expect(url.password()).toBe('pass');
		expect(url.password('pass2')).toBe(url);
		expect(url.password()).toBe('pass2');
	});
	it('should get and set pathname', () => {
		const url = new FluentURL(testUrl);
		expect(url.pathname()).toBe('/foo/');
		expect(url.pathname('/bar')).toBe(url);
		expect(url.pathname()).toBe('/bar');
	});
	it('should get and set port', () => {
		const url = new FluentURL(testUrl);
		expect(url.port()).toBe('8443');
		expect(url.port('80')).toBe(url);
		expect(url.port()).toBe('80');
		url.port('');
		expect(url.hostname()).toBe('sub.example.com');
	});
	it('should get and set protocol', () => {
		const url = new FluentURL(testUrl);
		expect(url.protocol()).toBe('https:');
		expect(url.protocol('http:')).toBe(url);
		expect(url.protocol()).toBe('http:');
	});
	it('should get search', () => {
		const url = new FluentURL(testUrl);
		expect(url.search()).toBe('?q=hello');
	});
	it('should set search from string', () => {
		const url = new FluentURL(testUrl);
		expect(url.search('?a=world')).toBe(url);
		expect(url.search()).toBe('?a=world');
	});
	it('should set search from a URLSearchParams object', () => {
		const url = new FluentURL(testUrl);
		const newParams = new URLSearchParams({ a: 'world' });
		expect(url.search(newParams)).toBe(url);
		expect(url.search()).toBe('?a=world');
	});
	it('should set search from a plain object', () => {
		const url = new FluentURL(testUrl);
		const newParams = { a: 'world' };
		expect(url.search(newParams)).toBe(url);
		expect(url.search()).toBe('?a=world');
	});
	it('should clear search when given an empty plain object', () => {
		const url = new FluentURL(testUrl);
		const newParams = {};
		expect(url.search(newParams)).toBe(url);
		expect(url.search()).toBe('');
	});
	it('should get search as object', () => {
		const url = new FluentURL('http://example.com/search?q=hello');
		expect(url.searchObject()).toEqual({ q: 'hello' });
	});
	it('should set search from object', () => {
		const url = new FluentURL('http://example.com/search?q=hello');
		url.searchObject({ a: 'one', b: 'two' });
		expect(url.search()).toEqual('?a=one&b=two');
	});
	it('should serialize with toString', () => {
		const url = new FluentURL(testUrl);
		expect(url.toString()).toBe(testUrl);
	});
	it('should get and set username', () => {
		const url = new FluentURL(testUrl);
		expect(url.username()).toBe('user');
		expect(url.username('user2')).toBe(url);
		expect(url.username()).toBe('user2');
	});
	it('should handle data urls', () => {
		// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
		const url = new FluentURL('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==');
		expect(url.origin()).toBe('null');
		expect(url.protocol()).toBe('data:');
		expect(url.pathname()).toBe('text/plain;base64,SGVsbG8sIFdvcmxkIQ==');
	});
});
describe('FluentURL search params methods', () => {
	const testUrl = 'https://example.com/foo/?q=hello';

	it('should support qsAppend', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsAppend('a', 'one')).toBe(url);
		expect(url.href()).toBe(`${testUrl}&a=one`);
	});
	it('should support qsClear', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsClear()).toBe(url);
		expect(url.href()).toBe('https://example.com/foo/');
	});
	it('should support qsDelete', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsDelete('q')).toBe(url);
		expect(url.href()).toBe('https://example.com/foo/');
	});
	it('should support qsDeleteAll', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsDeleteAll()).toBe(url);
		expect(url.href()).toBe('https://example.com/foo/');
	});
	it('should support qsEntries', () => {
		const url = new FluentURL(`${testUrl}&a[]=1&a[]=2`);
		const entries = [];
		for (const [name, value] of url.qsEntries()) {
			entries.push([name, value]);
		}
		expect(entries).toEqual([
			['q', 'hello'],
			['a[]', '1'],
			['a[]', '2'],
		]);
	});
	it('should allow iterating fluentParams', () => {
		const url = new FluentURL(`${testUrl}&a[]=1&a[]=2`);
		const entries = [];
		for (const [name, value] of url.fluentParams) {
			entries.push([name, value]);
		}
		expect(entries).toEqual([
			['q', 'hello'],
			['a[]', '1'],
			['a[]', '2'],
		]);
	});
	it('should support qsExtend', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsExtend({ a: 'one' })).toEqual(url);
		expect(url.search()).toBe('?q=hello&a=one');
	});
	it('should support qsExtend with string', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsExtend('?a=one')).toEqual(url);
		expect(url.search()).toBe('?q=hello&a=one');
	});
	it('should support qsForEach', () => {
		const url = new FluentURL(`${testUrl}&a[]=1&a[]=2`);
		const entries = [];
		url.qsForEach((value, name) => {
			entries.push([name, value]);
		});
		expect(entries).toEqual([
			['q', 'hello'],
			['a[]', '1'],
			['a[]', '2'],
		]);
	});
	it('should support qsGet', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsGet('q')).toBe('hello');
	});
	it('should support qsGetAll', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsGetAll('q')).toEqual(['hello']);
	});
	it('should support qsHas', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsHas('q')).toBe(true);
		expect(url.qsHas('not-defined')).toBe(false);
	});
	it('should support qsKeys', () => {
		const url = new FluentURL(`${testUrl}&a[]=1&a[]=2`);
		expect(Array.from(url.qsKeys())).toEqual(['q', 'a[]', 'a[]']);
	});
	it('should support qsReset', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsReset()).toBe(url);
		expect(url.href()).toBe('https://example.com/foo/');
	});
	it('should support qsSet', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsSet('a', 'one')).toBe(url);
		expect(url.href()).toBe('https://example.com/foo/?q=hello&a=one');
	});
	it('should support qsSetAll', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsSetAll({ b: 'two' })).toBe(url);
		expect(url.href()).toBe('https://example.com/foo/?b=two');
	});
	it('should support qsSort', () => {
		const url = new FluentURL(testUrl);
		expect(url.qsSet('a', 'one').qsSort()).toBe(url);
		expect(url.href()).toBe('https://example.com/foo/?a=one&q=hello');
	});
	it('should support qsValues', () => {
		const url = new FluentURL(`${testUrl}&a[]=1&a[]=2`);
		expect(Array.from(url.qsValues())).toEqual(['hello', '1', '2']);
	});
	it('should support qsToString', () => {
		const url = new FluentURL('https://example.com/foo/?a=1&b=2');
		expect(url.qsToString()).toEqual('a=1&b=2');
	});
});
describe('FluentURL relative URLs', () => {
	const testUrl = '/foo/?q=hello#hash';

	it('should return relative path', () => {
		const url = new FluentURL(testUrl);
		expect(url.href()).toBe('/foo/?q=hello#hash');
		expect(url.isRelative()).toBe(true);
	});
	it('should return relative path with ../', () => {
		const url = new FluentURL('../foo/?q=hello#hash');
		expect(url.href()).toBe('../foo/?q=hello#hash');
		expect(url.isRelative()).toBe(true);
	});
	it('should return relative path with ./', () => {
		const url = new FluentURL('./foo/?q=hello#hash');
		expect(url.href()).toBe('./foo/?q=hello#hash');
		expect(url.isRelative()).toBe(true);
	});
	it('should return null for protocol', () => {
		const url = new FluentURL(testUrl);
		expect(url.protocol()).toBe(undefined);
	});
	it('should return null for port', () => {
		const url = new FluentURL(testUrl);
		expect(url.port()).toBe(undefined);
	});
	it('should return null for host', () => {
		const url = new FluentURL(testUrl);
		expect(url.host()).toBe(undefined);
	});
	it('should return null for hostname', () => {
		const url = new FluentURL(testUrl);
		expect(url.hostname()).toBe(undefined);
	});
	it('should return null for username', () => {
		const url = new FluentURL(testUrl);
		expect(url.username()).toBe(undefined);
	});
	it('should return null for password', () => {
		const url = new FluentURL(testUrl);
		expect(url.password()).toBe(undefined);
	});
	it('should return null for origin', () => {
		const url = new FluentURL(testUrl);
		expect(url.origin()).toBe(undefined);
	});
	it('should allowing making absolute URL relative', () => {
		const url = new FluentURL(
			'https://user:password@example.com:8443' + testUrl
		);
		url.makeRelative();
		expect(url.href()).toBe(testUrl);
	});
});
describe('FluentURL hash routing', () => {
	const testUrl = 'https://example.com/home#/dashboard?msg=Hello';

	it('should return hash path', () => {
		const url = new FluentURL(testUrl);
		expect(url.hashPath()).toBe('/dashboard');
	});
	it('should set hash path', () => {
		const url = new FluentURL(testUrl);
		expect(url.hashPath('/projects')).toBe(url);
		expect(url.href()).toBe('https://example.com/home#/projects?msg=Hello');
	});
	it('should set empty hash path', () => {
		const url = new FluentURL(testUrl);
		expect(url.hashPath('')).toBe(url);
		expect(url.href()).toBe('https://example.com/home#?msg=Hello');
	});
	it('should get hash path with empty query', () => {
		const emptyQueryUrl = 'https://example.com/home#/dashboard';
		const url = new FluentURL(emptyQueryUrl);
		expect(url.hashPath('')).toBe(url);
		expect(url.href()).toBe('https://example.com/home');
	});
	it('should return hash search', () => {
		const url = new FluentURL(testUrl);
		expect(url.hashSearch()).toEqual({ msg: 'Hello' });
	});
	it('should return empty hash search', () => {
		const emptyHashUrl = 'https://example.com/home#/dashboard';
		const url = new FluentURL(emptyHashUrl);
		expect(url.hashSearch()).toEqual({});
	});
	it('should set hash search', () => {
		const url = new FluentURL(testUrl);
		const search = { query: 'new construction', sort: '-created' };
		expect(url.hashSearch(search)).toBe(url);
		expect(url.href()).toBe(
			'https://example.com/home#/dashboard?query=new+construction&sort=-created'
		);
	});
	it('should set empty hash search', () => {
		const url = new FluentURL(testUrl);
		expect(url.hashSearch({})).toBe(url);
		expect(url.href()).toBe('https://example.com/home#/dashboard');
	});
});
