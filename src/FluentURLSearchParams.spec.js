const FluentURLSearchParams = require('./FluentURLSearchParams.js');

// Note: most of the methods are tested indirectly in ./FluentURL.spec.js
describe('FluentURLSearchParams', () => {
	const sample = 'a=one&b=two';
	it('should construct with URLSearchParams', () => {
		const params = new FluentURLSearchParams(sample);
		expect(params.searchParams).toBeInstanceOf(URLSearchParams);
	});
	it('should support clear', () => {
		const params = new FluentURLSearchParams(sample);
		expect(params.clear()).toBe(params);
		expect(params.toString()).toBe('');
	});
	it('should support setting with object', () => {
		const params = new FluentURLSearchParams(sample);
		expect(params.set({ b: '2', c: '3' })).toBe(params);
		expect(params.toString()).toBe('b=2&c=3');
	});
});
