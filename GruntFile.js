module.exports = function(grunt) {

    grunt.initConfig({
        // uglify: {
        //     my_target: {
        //         options: {
        //             beautify: false
        //         },
        //         files: {
        //             'public/js/Sync.js': ['assets/js/Sync.js'],
        //         }
        //     }
        // },
        watch: {
            scripts: {
                files: ["droppelgagner.js"],
                tasks: []
            },
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);
}