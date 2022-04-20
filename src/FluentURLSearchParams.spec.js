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
});
