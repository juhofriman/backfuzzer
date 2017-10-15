# Backfuzzer

HTTP is cool. It's aiming to be self descriptive and you can essentially
informs client when they are doing something wrong. They can give
information on request formats, how client should authorize and such.

Attackers *fuzz* inputs to our HTTP services - maybe we should fuzz back?

This is a spike on backfuzzer.

```
docker-compose build
docker-compose up
```

And then you have upstream service on localhost:4000 and backfuzzer on localhost:5000.
Upstream service now works by just returning given HTTP status, such as:

```
$ curl -i localhost:4000/418
HTTP/1.1 418 I'm a teapot
Content-Type: text/plain
Date: Sun, 15 Oct 2017 15:40:56 GMT
Connection: keep-alive
Transfer-Encoding: chunked

Some data from the origin
```

Localhost:5000 just proxies request to upstream service, but it uses Radamsa to
fuzz response from upstream, if response status is 4xx OR 5xx.

```
curl -i localhost:5000/418
HTTP/1.0 418 I'm a teapot
content-type: text/plain
date: Sun, 15 Oct 170141183460469231731687303715884103712 15:49:3 -3 GMT
connection: close
transfer-encoding: chunked
transfer-encoding: chunked
Some data from the origin
curl: (18) transfer closed with outstanding read data remaining
```

It's important to understand, that when the same exact request is executed, the
response is completely different.

```
curl -i localhost:5000/418
HTTP/1.1 418 I'm a teapot
HTTP/1.1 418 I'm a teapot
content-type: text/plain
dat��e: Sun, 15 Oct 2017 􏿾15:51:06 GMT
connection: close
󠀻transfer-encoding: chunked

Some data from the origin
```

This leaves very little space for attacker to work on.


## Rationale

When you have a backend for you UI, you'll probably see attacks from the logs.
On many cases, attackers just try to *fuzz* HTTP requests to your service, and
try to find something interesting. Usually *fuzzed* attack requests generate 4xx or
5xx HTTP response from the server, and those responses tend to be informative.

Well crafted HTTP inteface **tells** clients, how they should operate.

Can we mitigate this by proxying our production environment and fuzzing responseAsString
back to not well behaving clients?

The basic idea is to keep test environments behind VPN or soething similar. Your
third party developers should develop against them, and in those environments
they should get proper HTTP responses on errors. But in production, if someone
creates illegal request, they are probably doing something evil. Right?

This approach is not suitable when

1. You have an open API
2. You can't hide test/development environments
