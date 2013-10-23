var crypto = require('crypto')
var exec   = require('child_process').exec
var path   = require('path')

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
        files: [
          {
            expand: true,     // Enable dynamic expansion.
            cwd: 'doc/src/',      // Src matches are relative to this path.
            src: ['*.jade', '!block_*.jade'], // Actual pattern(s) to match.
            dest: 'doc/',   // Destination path prefix.
            ext: '.html',   // Dest filepaths will have this extension.
          }

        ]
      }
    },
    connect: {
      dev_server:{
        options: {
          port: 8888,
          base: './',
          keepalive: true 
        } 
      }
    },
    mocha: {
      // runs all html files (except test2.html) in the test dir
      // In this example, there's only one, but you can add as many as
      // you want. You can split them up into different groups here
      // ex: admin: [ 'test/admin.html' ]
      all: [ 'test/**/*.html' ],
      options: {
        reporter: 'Nyan'
      }
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
        closureLibraryPath: 'vendor/closure-library',
        root_with_prefix: '"src ../../../../src"'
      },
      standalone: {
        dest: 'src/deps.js'
      }
    },
    less: {
      development: {
        options: {
          paths: ["doc/css/less/", "doc/css/bootstrap/"]
        },
        files: {
          "doc/css/bootstrap.auto.css": "doc/css/bootstrap/bootstrap.less",
          "doc/css/main.auto.css": "doc/css/less/main.less"
        }
      }
    },
    watch: {
      options: {
        // Start a live reload server on the default port 35729
        livereload: true,
      },
      all: {
        files: [
          "doc/css/less/**/*.less",
          "doc/src/*.jade"
        ],
        // tasks: ['less', 'cssmin']
        tasks: ["less", "jade"],

      }
    },
    jshint: {
      files: {
        src: [
          'src/**/*.js'
        ],
        options: {
          jshintrc: 'src/.jshintrc'
        }
      }
    },
    copy: {
      mocha: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/mocha/mocha.js',
              'node_modules/chai/chai.js',
              'node_modules/sinon-chai/lib/sinon-chai.js',
              'node_modules/grunt-mocha/phantomjs/bridge.js',
              'node_modules/sinon/pkg/sinon.js'
            ],
            dest: 'test/js/',
          },
          {
            expand: true,
            flatten: true,
            src: 'node_modules/mocha/mocha.css',
            dest: 'test/css/',
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-closure-tools');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');

  function execCommand(cmd, cb) {
    var child = exec(cmd, cb)
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
  }

  var COMPILE_SOURCE_FILE = 'src/main.js'
  var COMPILE_TMP_FILE = 'dist/tmp.js'
  var COMPILE_OUTPUT_FILE = 'dist/znode_seajs.js'
  var COMPILE_OUTPUT_FILE_ORIGIN = 'dist/znode.js'
  var CLOSURE_LIB_PATH = 'vendor/closure-library'
  var COMPILER_PATH = 'vendor/compiler.jar'
  grunt.registerTask('compile', function() {
    var done = this.async()
    var cmd = 'python ' + CLOSURE_LIB_PATH + '/closure/bin/build/closurebuilder.py '
             + '--input ' + COMPILE_SOURCE_FILE + ' '
             + '--root src ' 
             + '--root ' + CLOSURE_LIB_PATH +' '
             + '--output_mode compiled '
             + '-f "--compilation_level=SIMPLE_OPTIMIZATIONS" '
             + '--compiler_jar ' + COMPILER_PATH + ' '
             + '--output_file ' + COMPILE_TMP_FILE + ' '
    //var cmd = 'java -jar vendor/compiler.jar --js ' + COMPILE_SOURCE_FILE + ' --js_output_file ' + COMPILE_OUTPUT_FILE

    //TODO: add wrapper for seajs.
    execCommand(cmd, function(error, stdout, stderr) {
      //Save a origin file.
      grunt.file.copy(COMPILE_TMP_FILE, COMPILE_OUTPUT_FILE_ORIGIN)

      //Create a version with seajs define wrapper.
      grunt.file.copy(COMPILE_TMP_FILE, COMPILE_OUTPUT_FILE, {
        process: function(contents, path) {
          var wrapper = grunt.file.read('scripts/seajs_wrapper.js')
          var obj = {
            compiledCode: contents
          }
          contents = grunt.template.process(wrapper, {data: obj})
          return contents
        }
      })
      grunt.file.delete(COMPILE_TMP_FILE)
      done()
    })
  })

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
  

    // 先生成一个独立的 deps 文件，再运行 mocha
  grunt.registerTask('test', ['closureDepsWriter:standalone', 'mocha']);

  grunt.registerTask('dev_server', ['connect:dev_server']);

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'closureDepsWriter:standalone', 'mocha', 'less', 'jade']);
  // grunt.registerTask('default', ['uglify']);
  // grunt.registerTask('server', ['server']);

};