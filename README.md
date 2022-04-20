# fluent-url

[![Build Status](https://travis-ci.com/kensnyder/fluent-url.svg?branch=master&v=1.0.1)](https://travis-ci.com/kensnyder/fluent-url)
[![Code Coverage](https://codecov.io/gh/kensnyder/fluent-url/branch/master/graph/badge.svg?v=1.0.1)](https://codecov.io/gh/kensnyder/fluent-url)
[![ISC License](https://img.shields.io/npm/l/fluent-url.svg?v=1.0.1)](https://opensource.org/licenses/ISC)

A chainable version of the global URL class

## Installation

`npm install fluent-url`

## Goals

A simple class that uses URL and URLSearchParams built-ins in a fluent
(chainable) manner.

## Example Usage

```js
import url from 'fluent-url';

// simple construction with query string
const search = url('https://api.example.com/search', { term: 'Foo' });
search.href(); // https://api.example.com/search?term=Foo

// chainable example
const search = url('https://api.example.com/search?term=Foo');
search
	.port('8080')
	.search({
		b: 'two',
		a: 'one',
	})
	.sort()
	.path('/login')
	.hash('#username')
	.href(); // https://api.example.com:8080/login?a=one&b=two#username

// extend search query instead of overwriting it
const search = url('https://api.example.com/search?term=Foo');
search.qsExtend({
	limit: 10,
	sort: 'created_at',
});
search.href(); // https://api.example.com/search?term=Foo&limit=10&sort=created_at
```

## Instantiating

FluentURL can be instantiated using multiple signatures:

```js
url(myUrl); // myUrl may be string or instance of URL
url(myUrl, searchParams); // searchParams is a plain object or instance of URLSearchParams
url(relative, baseUrl); // relative is the path and baseUrl is the domain
url(relative, baseUrl, searchParams); // searchParams is a string, plain object or instance of URLSearchParams
```

## Main Methods

| URL built-in | FluentURL get | FluentURL set          | Description                                  | Example                        |
| ------------ | ------------- | ---------------------- | -------------------------------------------- | ------------------------------ |
| hash         | .hash()       | .hash(newHash)         | The hash string including "#"                | #foo                           |
| host         | .host()       | .host(newHost)         | The domain name including port if applicable | example.com                    |
| hostname     | .hostname()   | .hostname(newHost)     | The domain name excluding port               | example.com                    |
| href         | .href()       | .href(newHref)         | The entire URL - same as .toString()         | http://example.com/foo?bar#baz |
| origin       | .origin()     | N/A                    | The protocol, domain and port                | http://example.com:8443        |
| password     | .password()   | .password(newPassword) | The password                                 | ftp-password                   |
| pathname     | .pathname()   | .pathname(newPathname) | The path including leading slash             | /admin                         |
| port         | .port()       | .port(newPort)         | The port number as a string                  | 8080                           |
| protocol     | .protocol()   | .protocol(newProtocol) | The scheme                                   | https:                         |
| search       | .search()     | .search(newSearch†)    | The search string†, including "?"            | ?a=one&b=two                   |
| searchParams | .searchParams | .searchParams = params | The URLSearchParams object for this URL      | new URLSearchParams('a=1')     |
| username     | .username()   | .username(newUsername) | The username string                          | ftpuser                        |
| toString()   | .toString()   | N/A                    | The entire URL                               | http://example.com/foo?bar#baz |

† _newSearch can be a string, URLSearchParams object, or plain object._

## Query String Methods

| URLSearchParams built-in    | FluentURLSearchParams         | Description                                                              |
| --------------------------- | ----------------------------- | ------------------------------------------------------------------------ |
| append()                    | .qsAppend(name, value)        | Add a single param                                                       |
| N/A                         | .qsClear()                    | Delete all params - same as .qsDeleteAll() and .qsReset()                |
| .delete(name)               | .qsDelete(name)               | Delete one param                                                         |
| N/A                         | .qsDeleteAll()                | Delete all params - same as .qsClear() and .qsReset()                    |
| .entries()                  | .qsEntries()                  | Get an iterable param set                                                |
| N/A                         | .qsExtend(withParams)         | Set params by string, URLSearchParams object, or plain object            |
| .forEach(callback, thisArg) | .qsForEach(callback, thisArg) | Iterate through params                                                   |
| .get(name)                  | .qsGet(name)                  | Get the value of a single param by name                                  |
| .getAll(name)               | .qsGetAll(name)               | Get the value of a all params with name                                  |
| .has(name)                  | .qsHas(name)                  | Check if the given param is present                                      |
| .keys()                     | .qsKeys()                     | Get an array of all param names                                          |
| N/A                         | .qsReset()                    | Clear out all params - same as .qsClear() and .qsDeleteAll()             |
| .set(name, value)           | .qsSet(name, value)           | Set one param                                                            |
| N/A                         | .qsSetAll(params)             | Reset then set params by string, URLSearchParams object, or plain object |
| .sort()                     | .qsSort()                     | Sort params alphabetically (helpful for comparison or caching)           |
| .values()                   | .qsValues()                   | Get an array of all param values                                         |

Wait, what is `FluentURLSearchParams`? It is a class used internally for all the
`qs*` methods. Its methods are named without the `qs` such as append(), clear(),
delete(), etc. If you would like to use it directly, it is exported by name so
it can be used like this:

```js
import url, { FluentURLSearchParams } from 'fluent-url';
const FluentURLSearchParams = require('fluent-url').FluentUrlSearchParams;
```

## Properties

| Name                       | Description                      |
| -------------------------- | -------------------------------- |
| .URL                       | The URL object                   |
| .fluentParams              | The FluentURLSearchParams object |
| .fluentParams.searchParams | Reference to .URL.searchParams   |

## Unit Tests and Code Coverage

Powered by jest

```bash
npm test
npm run coverage
```

## Contributing

Contributions are welcome. Please open a GitHub ticket for bugs or feature
requests. Please make a pull request for any fixes or new code you'd like to be
incorporated.

## License

Open Source under the [ISC License](https://opensource.org/licenses/ISC).
