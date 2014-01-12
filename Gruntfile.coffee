# Easy Config variables
prism_theme = "tomorrow"

# Generic processing function
process = (src, path) ->
  return "//##### #{path} \n#{src}\n"



module.exports = (grunt) ->
  JS = 'public/js'
  BOWER = "bower_components"
  BUILD = "build"


  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    bump:
      options:
        files: ['package.json', 'bower.json']
        updateConfigs: ['pkg']
        commitMessage: 'Release v%VERSION%'
        commitFiles: ['package.json', 'bower.json']
        createTag: true
        tagName: 'v%VERSION%'
        tagMessage: 'Version %VERSION%'
        push: true
        pushTo: 'origin'
    clean:
      public: [
        'public/'
      ]
      build: [
        "#{BUILD}/**"
        "public/css/style.css"
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
            '!public/**/*.coffee'
            "!#{BOWER}/**"
            "!node_modules/**"
          ]
          dest: './'
          ext: '.js'
        }]
      public:
        options:
          bare: true
          separator: '\n\n'
          sourceMap: true
          sourceMapDir: 'public/js/maps/'
          join: true
        files:
          'build/app/rex.js': ['coffee/public/**/*.coffee']
    concat:
      options:
        separator: '\n'
        stripBanners: true
        process: process
      app:
        src: [
          "#{BUILD}/lib/semantic/**/*.js"
          "#{BUILD}/lib/prism/prism.min.js"
          "#{BUILD}/lib/prism/**/*.js"
          "#{BUILD}/app/rex.min.js"
          "#{BUILD}/app/**/*.js"
          "!#{BUILD}/app/rex.js"
        ]
        dest: "#{JS}/rex.min.js"
    copy:
      js:
        expand: true
        flatten: true
        filter: 'isFile'
        src: [

        ]
        dest: 'build/lib'
      prism:
        expand: true
        flatten: true
        filter: 'isFile'
        src: [
          "#{BOWER}/prism/components/prism-coffeescript.min.js"
          "#{BOWER}/prism/components/prism-css.min.js"
          "#{BOWER}/prism/components/prism-php.min.js"
          "#{BOWER}/prism/components/prism-ruby.min.js"
          "#{BOWER}/prism/components/prism-scss.min.js"
          "#{BOWER}/prism/components/prism-sql.min.js"
          "#{BOWER}/prism/components/prism-bash.min.js"
        ]
        dest: 'build/lib/prism'
      semantic:
        expand: true
        flatten: true
        filter: 'isFile'
        cwd: "#{BOWER}/semantic/build/minified/modules/"
        src: [
          'behavior/api.min.js'
          'behavior/colorize.min.js'
          # 'behavior/form.min.js'
          # 'behavior/state.min.js'
          # 'accordion.min.js'
          # 'chatroom.min.js'
          # 'checkbox.min.js'
          # 'dimmer.min.js'
          # 'dropdown.min.js'
          # 'modal.min.js'
          # 'nag.min.js'
          # 'popup.min.js'
          # 'rating.min.js'
          # 'search.min.js'
          # 'shape.min.js'
          # 'sidebar.min.js'
          # 'tab.min.js'
          # 'transition.min.js'
          # 'video.min.js'
        ]
        dest: 'build/lib/semantic'
      css:
        expand: true
        flatten: true
        filter: 'isFile'
        src: [
          "#{BOWER}/prism/themes/prism-#{prism_theme}.css"
        ]
        dest: 'build/css'
      fonts:
        expand: true
        flatten: true
        filter: 'isFile'
        src: "#{BOWER}/semantic/build/less/fonts/*"
        dest: 'public/fonts/'
      images:
        expand: true
        flatten: true
        filter: 'isFile'
        src: [
          "#{BOWER}/semantic/build/less/images/*"
          "src/images/*"
        ]
        dest: 'public/images/'
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
          dest: "#{BUILD}/lib/prism"
          ext: '.min.js'
        }]
      public:
        files: [{
          expand: true
          flatten: true
          cwd: 'build/'
          src: [
            'app/**/*.js'
          ]
          dest: "build/app"
          ext: '.min.js'
        }]
    watch:
      options:
        debounceDelay: 250
      express:
        files: [
          'controllers/**/*.js'
          'lib/**/*.js'
          'app.js'
        ]
        tasks: ['express:dev']
        options:
          spawn: false
      less:
        files: [
          'less/**/*.less'
        ]
        tasks: ['less:development', 'copy:css', 'cssmin']
      coffee:
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
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-lesslint'
  grunt.loadNpmTasks 'grunt-express-server'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-bump'

  grunt.registerTask 'major', ['app', 'bump:major']
  grunt.registerTask 'release', ['app', 'bump:minor']
  grunt.registerTask 'patch', ['app', 'bump:patch']
  grunt.registerTask 'app', ['clean:public', 'coffee', 'less:development', 'copy', 'uglify', 'concat', 'cssmin', 'clean:build'] #
  grunt.registerTask 'default', ['app', 'express:dev','watch']