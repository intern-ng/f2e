
module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [ 'Gruntfile.js', 'src/script/**/*.js' ]
    },

    jade: {
      compile: {
        options: {
          pretty: true
        },
        expand: true,
        cwd: 'src/',
        dest: 'build/',
        src: '**/*.jade',
        ext: '.html'
      }
    },

    stylus: {
      compile: {
        options: {
          use: [
            require('axis-css'),
            require('nib'),
            require('rupture'),
          ],
        },
        expand: true,
        cwd: 'src/',
        dest: 'build/',
        src: 'style/**/*.styl',
        ext: '.css'
      }
    },

    copy: {
      script: {
        expand: true,
        cwd: 'src/',
        dest: 'build/',
        src: 'script/**/*.js',
        ext: '.js'
      },
      resource: {
        expand: true,
        dest: 'build/',
        src: 'asset/**',
      },
    },

    devserver: {
      server: {
        options: {
          port: 8020,
          base: 'build/'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-devserver');

  grunt.registerTask('default', [ 'jshint', 'jade' , 'stylus', 'copy' ]);

};

