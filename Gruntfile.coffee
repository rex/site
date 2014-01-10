# Easy Config variables
prism_theme = "tomorrow"


module.exports = (grunt) ->
  JS = 'public/js'
  BOWER = "#{JS}/bower_components"
  DIST = "#{JS}/dist"


  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    # clean:
    #   app: [
    #     "#{DIST}/**/*.js"
    #     "#{JS}/app.js"
    #   ]
    concat:
      options:
        separator: '\n'
        stripBanners: true
        process: (src, path) ->
          return "//##### #{path} \n#{src}\n"
      css:
        options:
          separator: '\n'
          stripBanners: true
          process: (src, path) ->
            return "//##### #{path} \n#{src}\n"
            # return "/****** #{path} ******/ \n#{src}\n"
        src: [
          "#{BOWER}/prism/themes/prism-#{prism_theme}.css"
          "public/css/style.css"
        ]
        dest: 'public/css/rex.min.css'
      app:
        src: [
          "#{BOWER}/foundation/js/foundation.min.js"
          "#{BOWER}/underscore/underscore-min.js"
          "#{BOWER}/backbone/backbone-min.js"
          "#{DIST}/lib/prism/prism.min.js"
          "#{DIST}/lib/**/*.min.js"
          "#{DIST}/main.min.js"
          "#{DIST}/**/*.min.js"
        ]
        dest: "#{JS}/rex.min.js"
    uglify:
      options:
        mangle: true
        compress: true
        preserveComments: false
      lib:
        files: [{
          expand: true
          cwd: BOWER
          src: [
            "prism/prism.js"
            "prism/components/prism-coffeescript.js"
            "prism/components/prism-css.js"
            "prism/components/prism-php.js"
            "prism/components/prism-ruby.js"
            "prism/components/prism-scss.js"
            "prism/components/prism-sql.js"
            "prism/components/prism-bash.js"
          ]
          dest: "#{DIST}/lib"
          ext: '.min.js'
        }]
      app:
        files: [{
          expand: true
          cwd: JS
          src: [
            "app/main.js"
            "app/**/*.js"
            "!rex.min.js"
          ]
          dest: "#{DIST}"
          ext: '.min.js'
        }]
    watch:
      files: [
        "#{JS}/**/*.js"
        "!#{JS}/rex.min.js"
      ]
      tasks: ['app']

  grunt.loadNpmTasks 'grunt-banner'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-clean'

  grunt.registerTask 'app', ['uglify:lib', 'uglify:app', 'concat:app']
  grunt.registerTask 'default', ['app', 'watch']