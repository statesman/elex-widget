module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    // Empty directories before build process
    clean: {
      css: ["dist/*.css", "dist/*.css.map", "build/*.scss"],
      js: ["build/*.js", "dist/*.js", "dist/*.js.map"]
    },

    // Transpile SASS
    sass: {
      dist: {
        options: {
          loadPath: [
            'bower_components/neat/app/assets/stylesheets',
            'bower_components/bitters/app/assets/stylesheets',
            'bower_components/bourbon/dist'
          ],
          style: 'compressed'
        },
        files: {
          'dist/styles.css': 'src/css/main.scss'
        }
      }
    },

    // Pre-render Handlebars templates
    handlebars: {
      options: {
        namespace: "jst",
        amd: ['handlebars', '../templates/helpers'],
        // Returns the filename, with its parent directory if
        // it's in a subdirectory of the src/templates folder
        processName: function(filePath) {
          var path = filePath.toLowerCase(),
              pieces = path.split("/"),
              name = '';
          if(pieces[pieces.length - 2] !== 'templates') {
            name = name + pieces[pieces.length - 2];
          }
          name = name + pieces[pieces.length - 1];
          return name.split(".")[0];
        }
      },
      compile: {
        files: {
          'build/templates.js': ['src/templates/**/*.hbs']
        }
      }
    },

    // Run our JavaScript through JSHint
    jshint: {
      js: {
        src: ['src/js/**.js']
      }
    },

    // Use Uglify to bundle up a pym file for the home page
    uglify: {
      homepage: {
        files: {
          'dist/hp.js': ['bower_components/pym.js/src/pym.js', 'src/js/hp.js']
        }
      }
    },

    // Runs the r.js optimizer
    requirejs: {
      compile: {
        options: {
          baseUrl: 'src/js',
          mainConfigFile: 'src/js/main.js',
          out: 'dist/scripts.js',
          optimize: 'uglify2',
          include: [
            'app'
          ],
          name: '../../bower_components/almond/almond',
          generateSourceMaps: true,
          preserveLicenseComments: false
        }
      }
    },

    // Watch for changes in SASS and JavaScript files,
    // relint/retranspile when a file
    watch: {
      options: {
        livereload: 35729,
      },
      markup: {
        files: ['**.html']
      },
      scripts: {
        files: ['src/js/**.js', 'src/js/**/**.js', 'src/templates/**/*.hbs', 'src/templates/helpers.js'],
        tasks: ['jshint', 'clean:js', 'handlebars', 'requirejs']
      },
      styles: {
        files: ['src/css/**.scss'],
        tasks: ['clean:css', 'sass']
      }
    },

    // A simple local dev server
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          keepalive: true,
          livereload: 35729,
          open: true,
          useAvailablePort: true
        }
      }
    },

    // A task to run watch and connect concurrently to faciliate
    // automatic watch -> build -> reload
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      target1: ['watch', 'connect']
    }

  });

  // Load the task plugins
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('build', ['clean', 'sass', 'handlebars', 'jshint', 'requirejs']);
  grunt.registerTask('default', ['build', 'concurrent']);

};
