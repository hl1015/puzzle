module.exports = function(grunt){
	grunt.initConfig({
		concat: {
			dist:{
				src: ['scripts/src/*.js'],
				dest: 'scripts/main.js'
			}
		},
		uglify: {
			dist:{
				files: {'scripts/main.min.js': ['scripts/main.js']},
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
}