# Easy Config variables

###
  Pick your theme for the Prism syntax highlighter
  Available themes:
    coy, dark, funky, okaidia, tomorrow, twilight, or default
###
prism_theme = "default"
get_prism_theme = ->
  str = 'prism'
  if prism_theme != 'default'
    str += "-#{prism_theme}"

  console.log "Prism Theme File: #{str}.css"
  str

# Generic processing function
process = (src, path) ->
  return "//##### #{path} \n#{src}\n"


module.exports = (grunt) ->
  JS = 'public/js'
  BOWER = "bower_components"
  BUILD = "build"
  PUBLIC = "public"

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    bump:
      options:
        files: ['package.json', 'bower.json']
        updateConfigs: ['pkg']
        commitMessage: "Version %VERSION% built on #{grunt.template.today('yyyy-mm-dd')} at #{grunt.template.today('hh:MM:ss TT')}"
        commitFiles: ['package.json', 'bower.json']
        createTag: true
        tagName: 'v%VERSION%'
        tagMessage: "Version %VERSION% built on #{grunt.template.today('yyyy-mm-dd')} at #{grunt.template.today('hh:MM:ss TT')}"
        push: true
        pushTo: 'origin'
    clean:
      js: [
        "#{BUILD}/public/**"
        "#{PUBLIC}/js/**"
      ]
      css: [
        "#{BUILD}/css/**"
        "#{PUBLIC}/css/**"
      ]
      lib: [
        "#{BUILD}/**"
      ]
    coffee:
      app:
        options:
          bare: true
        files: [{
          expand: true
          cwd: 'coffee/'
          src: [
            '**/*.coffee'
            "!#{PUBLIC}/**/*.coffee"
          ]
          dest: './'
          ext: '.js'
        }]
      public:
        options:
          bare: true
          separator: '\n\n'
          sourceMap: true
          sourceMapDir: "#{JS}/maps/"
          join: true
        files:
          'build/public/rex.js': ['coffee/public/**/*.coffee']
    concat:
      options:
        separator: '\n'
        stripBanners: true
        process: process
      public:
        src: [
          "#{BUILD}/lib/prism.min.js"
          "#{BUILD}/lib/prism-*.js"
          "#{BUILD}/lib/**/*.js"
          "#{BUILD}/public/rex.min.js"
          "#{BUILD}/public/**/*.js"
          "!#{BUILD}/public/rex.js"
        ]
        dest: "#{JS}/rex.min.js"
    copy:
      js:
        expand: true
        flatten: true
        filter: 'isFile'
        src: [
          "#{BOWER}/build/packaged/javascript/semantic.min.js"
          "#{BOWER}/prism/components/prism-coffeescript.min.js"
          "#{BOWER}/prism/components/prism-css.min.js"
          "#{BOWER}/prism/components/prism-php.min.js"
          "#{BOWER}/prism/components/prism-ruby.min.js"
          "#{BOWER}/prism/components/prism-scss.min.js"
          "#{BOWER}/prism/components/prism-sql.min.js"
          "#{BOWER}/prism/components/prism-bash.min.js"
        ]
        dest: 'build/lib'
      css:
        expand: true
        flatten: true
        filter: 'isFile'
        src: [
          "#{BOWER}/semantic/build/packaged/css/semantic.min.css"
          "#{BOWER}/prism/themes/#{get_prism_theme()}.css"
        ]
        dest: 'build/css'
      fonts:
        expand: true
        flatten: true
        filter: 'isFile'
        src: "#{BOWER}/semantic/build/less/fonts/*"
        dest: "#{PUBLIC}/fonts/"
      images:
        expand: true
        flatten: true
        filter: 'isFile'
        src: [
          "#{BOWER}/semantic/build/less/images/*"
          "src/images/*"
        ]
        dest: "#{PUBLIC}/images/"
    cssmin:
      options:
        report: 'min'
        keepSpecialComments: 0
      app:
        files:
          'public/css/rex.min.css': [
            "build/css/**/*.css"
            "build/css/style.css"
          ]
    express:
      dev:
        options:
          script: 'app.js'
          node_env: 'development'
      prod:
        options:
          script: 'app.js'
          node_env: 'production'
    less:
      development:
        options:
          paths: [
            "#{BOWER}/semantic/build/less"
            "#{BOWER}/mrmrs-colors/less"
            "less"
          ]
          compress: false
          cleancss: false
        files:
          "build/css/style.css": "less/rex.less"
      production:
        options:
          paths: ["#{BOWER}/semantic/build/less"]
          compress: true
          cleancss: true
        files:
          "build/css/style.css": "less/rex.less"
    lesslint:
      src: ['less/**/*.less']
    uglify:
      options:
        mangle: true
        compress: true
        preserveComments: false
      lib:
        files: [{
          expand: true
          flatten: true
          cwd: BOWER
          src: [
            "prism/prism.js"
          ]
          dest: "#{BUILD}/lib"
          ext: '.min.js'
        }]
      public:
        files: [{
          expand: true
          flatten: true
          cwd: 'build/'
          src: [
            "#{PUBLIC}/**/*.js"
          ]
          dest: "build/public/"
          ext: '.min.js'
        }]
    watch:
      options:
        debounceDelay: 250
      gruntfile:
        files: [
          'Gruntfile.coffee'
        ]
        tasks: ['build', 'express:dev']
      app:
        files: [
          'coffee/**/*.coffee'
          '!coffee/public/**/*.coffee'
        ]
        tasks: ['app', 'express:dev']
        options:
          spawn: false
      css:
        files: [
          'less/**/*.less'
        ]
        tasks: ['css']
      js:
        files: [
          'coffee/public/**/*.coffee'
        ]
        tasks: ['js']

  grunt.loadNpmTasks 'grunt-banner'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-lesslint'
  grunt.loadNpmTasks 'grunt-express-server'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-bump'

  ###
    Release tasks
  ###
  grunt.registerTask 'major', ['app', 'bump:major']
  grunt.registerTask 'release', ['app', 'bump:minor']
  grunt.registerTask 'patch', ['app', 'bump:patch']

  ###
    Actual code/build tasks
  ###
  grunt.registerTask 'css', ['clean:css', 'less:development', 'copy:css', 'cssmin']
  grunt.registerTask 'js', ['clean:js', 'coffee:public', 'copy:js', 'uglify', 'concat:public']
  grunt.registerTask 'assets', ['copy:fonts', 'copy:images']
  grunt.registerTask 'app', ['coffee:app']

  ###
    Development tasks
  ###
  grunt.registerTask 'build', ['clean', 'css', 'js', 'assets', 'app']
  grunt.registerTask 'default', ['clean', 'build', 'express:dev', 'watch']