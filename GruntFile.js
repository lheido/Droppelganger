module.exports = function(grunt) {

    grunt.initConfig({
        uglify: {
            my_target: {
                options: {
                    beautify: false
                },
                files: {
                    'droppelganger.min.js': ['droppelganger.js'],
                }
            }
        },
        watch: {
            scripts: {
                files: ["droppelganger.js"],
                tasks: ['uglify:my_target']
            },
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('min', ['uglify:my_target']);
}