'use strict';

var _    = require('lodash'),
    path = require('path'  );

module.exports = function(grunt) {
 
    //build list of top level static resource folders
    var staticResources = _.reduce(
        grunt.file.expand('src/staticresources/*'),
        function(memo,f){
            if(grunt.file.isDir(f)) 
                memo.push(path.basename(f));
            return memo;
        },
        [] //inital memo value - empty array
    );

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist'],
        watch: {
            src: {
                files: ['src/*/**'],
                tasks: ['deploy'],
                options: {spawn: false}
            }
        },
        copy: {
            main:{
                files:[
                     {  expand: true, 
                        cwd   : 'src/', 
                        src   : ['**','!**/staticresources/**','!**/templates/**'], 
                        dest  : 'dist/deploy/'}
                    ,{
                        expand: true, 
                        cwd   : 'src/staticresources/', 
                        src   : ['*/**','!**/*.scss'], 
                        dest  : 'dist/staticresources/'  
                    }
                ]
            }
        },
        compass: _.reduce(staticResources,function(memo,staticResource){
            memo[staticResource] = {
                options:{
                    force        : true                              ,
                    httpPath     : ''                                ,
                    sassDir      : 'src/staticresources/'+staticResource         ,
                    fontsDir     : 'src/staticresources/'+staticResource+'/fonts'   ,
                    httpFontsPath: 'fonts'                           ,
                    specify      : 'src/staticresources/'+staticResource+'/'+staticResource+'.scss',
                    cssDir       : 'dist/staticresources/'+staticResource+''
                }
            };
            return memo;
        },{}),
        compress: _.reduce(staticResources,function(memo,staticResource){
            memo[staticResource] = {
                options: {archive: 'dist/deploy/staticresources/'+staticResource+'.resource'},
                files: [{expand: true, cwd: 'dist/staticresources/'+staticResource+'/', src: ['**'] }]
            };
            return memo;
        },{options: {mode: 'zip'}}),
        antdeploy: {
            options: {
                root: 'dist/deploy',
                version: '31.0',
                useEnv: true
            },
            all: { 
                pkg: { 
                    staticresource: ['*'], 
                    components: ['*'], 
                    pages: ['*'], 
                    classes: ['*'] 
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-ant-sfdc');

    grunt.registerTask('write-meta', 'Write the required salesforce metadata', function() {
        var templates = _.reduce(grunt.file.expand('meta-templates/*.xml'),function(memo,filename){
            memo['.'+path.basename(filename,'.xml')] = _.template(grunt.file.read(filename));
            return memo;
        },{});
        _.each(grunt.file.expand('dist/deploy/*/**'),function(f){
            if(grunt.file.isFile(f) && templates[path.extname(f)]){
                grunt.file.write(f + '-meta.xml',
                    templates[path.extname(f)]({apiVersion:'31.0',label:path.basename(f).replace(/\.[^/.]+$/, '')})
                );
            }
        });
    });

    grunt.registerTask('build', ['clean','copy','compass','compress','write-meta']);
    grunt.registerTask('deploy', ['build','antdeploy']);
  
};