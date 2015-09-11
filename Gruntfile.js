'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		clean: {
			build: ['dist','doc'],
            test_orig: ['test_nodeunit/*_run.js','test_qunit/*_run.html'],
            test_dist: ['test_nodeunit_dist/*_run.js','test_qunit_dist/*_run.html'],
            test_min: ['test_nodeunit_min/*_run.js','test_qunit_min/*_run.html']
        },
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: [
                    'node_modules/crisp-base/dist/crisp-base.js',
                    'node_modules/crisp-create/dist/crisp-create.js',
                    'node_modules/crisp-event/dist/crisp-event.js',
					'node_modules/crisp-path/dist/crisp-path.js',
				],
				dest: 'dist/<%= pkg.name %>.js'
			},
		},
		uglify: {
			options: {
				banner: '<%= banner %>',
				compress: {
					drop_console: true
				}
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'dist/<%= pkg.name %>.min.js'
			},
		},
		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			src: {
				options: {
					jshintrc: 'src/.jshintrc'
				},
				src: ['src/**/*.js']
			},
			test: {
				options: {
					jshintrc: 'test_/.jshintrc'
				},
				src: ['test_/**/*.js']
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src', 'qunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'qunit']
			},
		},

        createunit: {
            nodeunit_orig: {
                options: {
                    destination: 'test_nodeunit',
                    template: 'test_/template/nodeunit.tpl'
                },
                src: [
                    'test_/*_test.js',
                    'node_modules/crisp-base/test_/*_test.js'
                ]
            },
            nodeunit_dist: {
                options: {
                    destination: 'test_nodeunit_dist',
                    template: 'test_/template/nodeunit_dist.tpl'
                },
                src: 'test_/*_test.js'
            },
            nodeunit_min: {
                options: {
                    destination: 'test_nodeunit_min',
                    template: 'test_/template/nodeunit_min.tpl'
                },
                src: 'test_/*_test.js'
            },
            qunit_orig: {
                options: {
                    destination: 'test_qunit',
                    template: 'test_/template/qunit.tpl',
                    run_sufix: '_run.html'
                },
                src: [
                    'test_/*_test.js',
                    'node_modules/crisp-base/test_/*_test.js'
                ]
            },
            qunit_dist: {
                options: {
                    destination: 'test_qunit_dist',
                    template: 'test_/template/qunit_dist.tpl',
                    run_sufix: '_run.html'
                },
                src: 'test_/*_test.js'
            },
            qunit_min: {
                options: {
                    destination: 'test_qunit_min',
                    template: 'test_/template/qunit_min.tpl',
                    run_sufix: '_run.html'
                },
                src: 'test_/*_test.js'
            }
        },
        
        nodeunit: {
            orig: ['test_nodeunit/*.js'],
            dist: ['test_nodeunit_dist/*.js'],
            min: ['test_nodeunit_min/*.js']
        },
        qunit: {
            orig: ['test_qunit/**/*.html'],
            dist: ['test_qunit_dist/**/*.html'],
            min: ['test_qunit_min/**/*.html']
        },

		jsdoc : {
			dist : {
                src: [ 'src/**/*.js', 'README.md' ],
				options: {
					destination: 'doc',
					// template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
					// configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.loadNpmTasks('grunt-createunit');
	grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['jshint', 'test_orig', 'clean:build', 'concat', 'uglify', 'createunit:qunit_dist', 'qunit:dist', 'createunit:qunit_min', 'qunit:min', 'jsdoc']);

    grunt.registerTask('test_orig', ['jshint:test', 'clean:test_orig', 'createunit:nodeunit_orig', 'nodeunit:orig', 'createunit:qunit_orig', 'qunit:orig']);
    grunt.registerTask('test_dist', ['jshint:test', 'clean:test_dist', 'createunit:nodeunit_dist', 'nodeunit:dist', 'createunit:qunit_dist', 'qunit:dist']);
    grunt.registerTask('test_min', ['jshint:test', 'clean:test_min', 'createunit:nodeunit_min', 'nodeunit:min', 'createunit:qunit_min', 'qunit:min']);

    grunt.registerTask('test', ['nodeunit:dist', 'qunit']);
    grunt.registerTask('t', ['test_orig']);
};