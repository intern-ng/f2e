intern-ng f2e
=============

Frontend part of [intern-ng](https://github.com/shinohane/intern-ng) project.

Deployment
----------

1. Run build task with `grunt`
2. Configure nginx to use static content from `build` directory
   under the same domain configured for application server
3. Ask CDN Service Provider to update their cache (if exists)

