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