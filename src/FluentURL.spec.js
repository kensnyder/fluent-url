const FluentURL = require('./FluentURL.js');
const FluentURLSearchParams = require('./FluentURLSearchParams.js');

describe('FluentURL', () => {
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
		expect(url.href('http://httpbin.org/foo/?bar#baz')).toBe(url);
		expect(url.href()).toBe('http://httpbin.org/foo/?bar#baz');
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
});
