module.exports = function(grunt) {

	var src				= 'src/',
		build			= 'build/',
		globalConfig	= {
			src			: src,
			build		: build,
			srcStyle	: src	+ 'style/',
			buildStyle	: build + 'style/',
			srcJs		: src	+ 'js/',
			buildJs		: build + 'js/'
		};


	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		gc: globalConfig,

		clean: {
			html: ['<%= gc.src %>index.proc.html']
		},

		copy: {
			main: {
				files: [
					{expand: true, cwd: '<%= gc.src %>img/', src: ['**'], dest: '<%= gc.build %>img/'},
					{expand: true, cwd: '<%= gc.srcStyle %>css', src: ['**'], dest: '<%= gc.buildStyle %>'},
					{src: '<%= gc.src %>index.proc.html', dest: '<%= gc.build %>index.html'}
				]
			},
		},

		htmlmin: {
			dist: {
				options: {
					removeComments		: true,
					collapseWhitespace	: true
				},
				files: {
					'<%= gc.src %>index.proc.html': '<%= gc.src %>index.proc.html'
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: ['Gruntfile.js', '<%= gc.srcJs %>**/*.js']
		},

		preprocess : {
			options: {},
			html : {
				src : '<%= gc.src %>index.html',
				dest : '<%= gc.src %>index.proc.html'
			}
		},

		sass: {
			options: {
				outputStyle: 'compressed',
				sourceMap: false
			},

			dist: {
				files: {
					'<%= gc.srcStyle %>css/app.css': '<%= gc.srcStyle %>scss/app.scss'
				}
			}
		},

		uglify: {
			options: {
				screwIE8: true
			},
			build: {
				src: '<%= gc.srcJs %>App.js',
				dest: '<%= gc.buildJs %>App.min.js'
			}
		},

		watch: {
			css: {
				files: ['<%= gc.srcStyle %>**/*.scss'],
				tasks: ['sass']
			},
			jshint: {
				files: ['<%= gc.srcJs %>**/*.js', 'Gruntfile.js'],
				tasks: ['jshint']
			}
		}

	});

	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', ['jshint', 'uglify', 'sass', 'preprocess', 'htmlmin', 'copy', 'clean:html']);

};
