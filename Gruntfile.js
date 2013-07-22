module.exports = function(grunt) {

  var port = 8981;
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          // {"src": "doc/src/tpl_.html", "des": "doc/*.html"}
          "doc/pagelet.html":"doc/src/tpl_pagelet.jade"
        }
      }
    },
    mocha: {
      // runs all html files (except test2.html) in the test dir
      // In this example, there's only one, but you can add as many as
      // you want. You can split them up into different groups here
      // ex: admin: [ 'test/admin.html' ]
      all: [ 'test/**/*.html' ]
    },
    // connect: {
    //   server: {
    //     options: {
    //       port: 9001,
    //       base: 'doc/'
    //     }
    //   }
    // },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    connect: {
      server: {
        options: {
          port: port,
          base: '.'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-connect');
  // grunt.loadNpmTasks('grunt-contrib-connect');
  
  // Alias 'test' to 'mocha' so you can run `grunt test`
  grunt.task.registerTask('test', ['connect', 'mocha']);

  // Default task(s).
  grunt.registerTask('default', ['jade']);
  // grunt.registerTask('default', ['uglify']);
  // grunt.registerTask('server', ['server']);
};