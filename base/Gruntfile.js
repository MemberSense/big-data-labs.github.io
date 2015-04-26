"use strict";
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    copy: {
      slick: {
        files: [
          {expand: true, cwd: 'bower_components/slick-carousel/slick', src: ['slick.css', 'slick-theme.css', 'ajax-loader.gif'], dest: 'vendor/css/'},
          {expand: true, cwd: 'bower_components/slick-carousel/slick', src: ['slick.min.js'], dest: 'vendor/js/'},
          {expand: true, cwd: 'bower_components/slick-carousel/slick/fonts', src: ['**'], dest: 'vendor/fonts/'}
          
        ]
      }
    }
  });

  // Load the plugin that provides the "copy" task.
  grunt.loadNpmTasks("grunt-contrib-copy");

  // Default task(s).
  // grunt.registerTask('default', ['uglify']);
  grunt.registerTask('default', ['copy']);

};

