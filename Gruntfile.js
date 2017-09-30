var fs = require('fs');
var username = require('username').sync();
var history = require('connect-history-api-fallback');
var apiRouterProxy = require('api-router-proxy');
var config = require('wwt-config-client');

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    function loadTemplate(filename, data) {
        // We have to use a sync method because this function needs to return synchronously
        var templateText = fs.readFileSync(__dirname + '/' + filename, {encoding: 'utf8'});
        return grunt.template.process(templateText, {data: data});
    }

    var projectConfigFile = './project.conf.js',
        tempDir = 'temp',
        moduleDefFile = tempDir + '/moduleDefinition.js',
        projectConfig = require(projectConfigFile),
        concatBanner = loadTemplate('gruntacular/functionOpen.js', {}),
        concatFooter = loadTemplate('gruntacular/functionClose.js', {}),
        postcssProcessors = [
          require('autoprefixer')({browsers: ['last 2 version']})
        ];

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    [ projectConfig.outputDir + "/internal.js" ]: projectConfig.outputDir + "/internal.js"
                }
            }
        },
        basePageName: projectConfig.basePageName,
        clean: {
            outputDir: [projectConfig.outputDir, projectConfig.archiveDir, 'temp']
        },
        concat: {
            internal: {
                src: [moduleDefFile]
                    .concat(projectConfig.javaScriptFiles.internal)
                    .concat(["!" + projectConfig.sourceDir + "/**/*Spec.js"]),
                dest: projectConfig.outputDir + "/internal.js",
                options: {
                    /*
                     * Wrap the entire app in a module function.
                     * Also: define a single Angular module with name and includes from project.conf.js.
                     * This feels hacky at first, but it greatly simplifies dependency management.
                     */
                    banner: concatBanner,
                    footer: concatFooter,
                    process: function (src, filepath) {
                        if (filepath === moduleDefFile) {
                            /*
                             * Don't wrap the module definition in a closure since we want it available to everything
                             * internal.
                             */
                            return src;
                        }
                        /*
                         * Wrap our files in closures so that we don't accidentally leak between them.
                         */
                        // Are these closures really necessary if we're writing everything in ng modules?
                        return "(function () {\n" + src + "\n}());";
                    }
                }
            },
            "third-party": {
                src: projectConfig.javaScriptFiles.external,
                dest: projectConfig.outputDir + "/third-party.js"
            }
        },
        copy: {
            "fonts": {
                files: [
                    {
                        cwd: projectConfig.depDir + "/font-awesome/fonts/",
                        src: ['**'],
                        dest: projectConfig.outputDir + "/fonts/",
                        expand: true
                    },
                    {
                        cwd: projectConfig.depDir + "/ui-primer/fonts/",
                        src: ['**'],
                        dest: projectConfig.outputDir + "/fonts/",
                        expand: true
                    }
                ]
            },
            "index": {
                files: [
                    {
                        cwd: projectConfig.sourceDir,
                        src: ['index.html'],
                        dest: projectConfig.outputDir,
                        expand: true
                    }
                ],
                options: {
                    process: addCacheBustingToGeneratedFileReferences
                }
            },
            "assets": {
                files: [
                    {
                        cwd: projectConfig.sourceDir + "/img/",
                        src: ["**"],
                        dest: projectConfig.outputDir + "/img/",
                        expand: true
                    }
                ]
            },
            "side-nav-files": {
                files: [
                    {
                        cwd: projectConfig.depDir + "/side-nav/dist/fonts/",
                        src: ['**'],
                        dest: projectConfig.outputDir + "/fonts/",
                        expand: true
                    }
                ]
            },
            "browser-support-images": {
                files: [
                    {
                        cwd: projectConfig.depDir + "/browser-detector/src/img/",
                        src: ['**'],
                        dest: projectConfig.outputDir + "/img/",
                        expand: true
                    }
                ]
            },
            "cloudfoundry-files": {
                files: [
                    {
                        cwd: projectConfig.cloudFoundryDir,
                        src: '*',
                        dest: projectConfig.outputDir,
                        expand: true
                    }
                ]
            }
        },
        'gh-pages': {
            options: {
                base: projectConfig.outputDir
            },
            src: ['**']
        },
        html2js: {
            options: {
                fileHeaderString: '(function (angular) {\n"use strict";\n',
                fileFooterString: '}(window.angular));'
            },
            main: {
                src: projectConfig.html2js.templateFiles,
                dest: projectConfig.html2js.outputFile
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                projectConfig.sourceDir + '/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        less: {
            all: {
                src: [projectConfig.rootLessFile],
                dest: projectConfig.outputDir + '/app.css',
                options: {
                    compress: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapFilename: projectConfig.outputDir + '/app.css.map',
                    sourceMapURL: 'app.css.map'
                }
            }
        },
        ngAnnotate: {
            internal: {
                expand: true,
                cwd: projectConfig.outputDir,
                src: ['internal.js'],
                dest: projectConfig.outputDir
            }
        },
        postcss: {
            options: {
                map: true,
                processors: postcssProcessors
            },
            dist: {
                src: projectConfig.outputDir + '/app.css'
            }
        },
        uglify: {
            /*
             * 'Beautify' the internal.js file for better readability. Even though we're mangling the final output,
             * it improves the source map.
             */
            beautify: {
                options: {
                    beautify: true,
                    mangle: false
                },
                files: [
                    {
                        expand: true,
                        cwd: projectConfig.outputDir,
                        src: 'internal.js',
                        dest: projectConfig.outputDir
                    }
                ]
            },
            all: {
                options: {
                    sourceMap: true
                },
                files: [
                    {
                        expand: true,
                        cwd: projectConfig.outputDir,
                        src: '**/*.js',
                        dest: projectConfig.outputDir
                    }
                ]
            }
        },
        watch: {
            less: {
                files: [projectConfig.sourceDir + "/**/*.less"],
                tasks: 'css'
            },
            templates: {
                files: projectConfig.html2js.templateFiles,
                tasks: 'html2js'
            },
            "js-internal": {
                files: projectConfig.javaScriptFiles.internal.concat([moduleDefFile]),
                tasks: 'concat:internal'
            },
            "js-third-party": {
                files: projectConfig.javaScriptFiles.external,
                tasks: 'concat:third-party'
            },
            index: {
                files: [
                    projectConfig.sourceDir + '/index.html',
                    projectConfig.outputDir + '/*.*', // all generated files (but not directories)
                    '!' + projectConfig.outputDir + '/index.html' // don't re-run when index.html updates
                ],
                tasks: 'copy:index',
                options: {
                    livereload: projectConfig.livereload
                }
            },
            'project-config': {
                files: ['project.conf.js'],
                tasks: ['reload-project-config', 'compile']
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: projectConfig.outputDir,
                    open: true,
                    middleware: function(connect, options, middlewares) {
                        username = grunt.option('username') || username;
                        middlewares.unshift(history());
                        middlewares.unshift(['/apirouter', apiRouterProxy(username)]);
                        return middlewares;
                    },
                    livereload: projectConfig.livereload
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: projectConfig.archiveDir + '/' + projectConfig.archiveName + '.zip'
                },
                files: [
                    { expand: true, cwd: projectConfig.outputDir, src: ['**/*'] }
                ]
            }
        }
    });

    // Composite Tasks
    grunt.registerTask('css', ['less', 'postcss']);
    grunt.registerTask('compile', ['clean', 'create-module-definition', 'concat', 'css', 'html2js', 'copy']);
    grunt.registerTask('transpile', ['compile', 'babel']);
    grunt.registerTask('optimize', ['ngAnnotate', 'uglify:beautify', 'uglify:all']);
    grunt.registerTask('package', ['transpile', 'optimize', 'compress']);
    grunt.registerTask('analyze', ['jshint']);
    grunt.registerTask('release', ['package', 'gh-pages']);
    grunt.registerTask('cit', ['analyze', 'package']);
    grunt.registerTask('serve', ['compile', 'wwt-config-init', 'connect', 'watch']);
    grunt.registerTask('default', ['cit']);

    grunt.registerTask('reload-project-config',
        'Reload the project configuration after changes to project.conf.js',
        function () {
            projectConfig = require(projectConfigFile);
        });

    grunt.registerTask('create-module-definition',
        'Use the information in project.conf.js to create a moduleDefinition.js file',
        function () {
            var moduleDefinition = loadTemplate('gruntacular/moduleDefinition.js', projectConfig.appModule);
            grunt.file.write(moduleDefFile, moduleDefinition);
        }
    );

    grunt.registerTask('wwt-config-init',
        'Initialize the wwt-config-client',
        function () {
            var done = this.async();
            config.init().then(done).catch(function (err) {
                grunt.log.error(err);
                done(false);
            });
        }
    );

    /*
     * Add cache busting for generated files by appending "?c={timestamp}" to each generated file referenced from
     * index.html. This means that we'll always get an updated URL to each of our generated files and can
     * cache them indefinitely while avoiding cacheing bugs.
     */
    function addCacheBustingToGeneratedFileReferences(indexHtml) {
        var files = fs.readdirSync(projectConfig.outputDir);
        files.forEach(function (filename) {
            var fileReference = '="' + filename + '"';
            if (indexHtml.indexOf(fileReference) !== -1) {
                /*
                 * Ideally, we'd use the async version of these fs calls, but we can only invoke Grunt's async stuff
                 * from within a task (and we have to return the transformed file string from this function). It
                 * seems to remain under a millisecond, though.
                 */
                var stats = fs.statSync(projectConfig.outputDir + '/' + filename);
                var timestamp = stats.mtime.getTime();
                var newFileReference = '="' + filename + '?c=' + timestamp + '"';
                indexHtml = indexHtml.replace(fileReference, newFileReference);
            }
        });
        return indexHtml;
    }
};
