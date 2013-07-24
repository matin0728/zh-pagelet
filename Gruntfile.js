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
    closureDepsWriter: {
      options: {
        closureLibraryPath: 'src/google-closure-library',
        root_with_prefix: '"src ../../../src"'
      },
      standalone: {
        dest: 'src/deps.js'
      }
    },
    copy: {
      mocha: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/grunt-mocha/example/test/js/mocha.js',
              'node_modules/grunt-mocha/example/test/js/chai.js',
              'node_modules/grunt-mocha/phantomjs/bridge.js',
            ],
            dest: 'test/js/',
          },
          {
            expand: true,
            flatten: true,
            src: 'node_modules/grunt-mocha/example/test/css/mocha.css',
            dest: 'test/css/',
          }
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-closure-tools');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');
  

    // 先生成一个独立的 deps 文件，再运行 mocha
  grunt.registerTask('test', ['closureDepsWriter:standalone', 'mocha']);


  // Default task(s).
  grunt.registerTask('default', ['jade']);
  // grunt.registerTask('default', ['uglify']);
  // grunt.registerTask('server', ['server']);
};