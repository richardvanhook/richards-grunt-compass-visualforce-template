Template grunt-based project that builds static resources from folders via [grunt-ant-sfdc](https://github.com/kevinohara80/grunt-ant-sfdc).  The interesting part is the conventions used by this template's `Gruntfile.js` that allow static resource(s) to simply be a folder of stuff instead of a zip file.  Also, the static resource can contain SCSS files, which are converted into CSS files when the static resources are created.

## Dependencies

* [grunt](http://gruntjs.com/installing-grunt)

## How to use

Executing the below commands will create two Visualforce pages Foo and Bar.

    $ git clone https://github.com/richardvanhook/richards-grunt-compass-visualforce-template
    $ cd richards-grunt-compass-visualforce-template
    $ npm install
    $ export SFSERVERURL=REPLACE_ME
    $ export SFUSER=REPLACE_ME
    $ export SFPASS=REPLACE_ME
    $ export SFTOKEN=REPLACE_ME
    $ grunt deploy

## Tasks in Gruntfile.js

* `clean`
* `copy`
* `compass`
* `compress`
* `antdeploy`
* `write-meta`
* `build`
* `deploy`

## Notes

* Only one SCSS file will be processed in each static resource and that SCSS file must be a top-level file with the exact same name as the static resource folder.
* Files directly underneath `src/staticresources` will be ignored.  Only folders should be added.
* If you need to support more metadata types than what's included in the `meta-templates` folder, simply add another appropriately named file to that folder and the `write-meta` task will pick it up.  The file name convention is metadata extension dot xml, for example, since triggers have the extension `.trigger`, the metadata file should be named `trigger.xml`.
