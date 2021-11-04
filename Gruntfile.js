const sass = require('node-sass');

module.exports = function(grunt) {

    let settings = grunt.file.readJSON("build-settings.json");

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        sass: {
            options: {
                implementation: sass,
                sourcemap: "none"
            },
            default: {
                files: {
                    "dest/css/common.css":      "dest/sass/common.sass",
                    "dest/css/options.css":     "dest/sass/options.sass"
                }
            }
        },

        clean: {
            dest: ["dest/"],
            sass: ["dest/sass"]
        },

        copy: {
            "src-to-dest": {
                expand: true,
                cwd: "src",
                src: ["**/*.*", "!firefox-overrides/**", "!chrome-overrides/**"],
                dest: "dest/"
            },
            "firefox-overrides": {
                expand: true,
                cwd: "src/firefox-overrides",
                src: ["**/*.*"],
                dest: "dest/"
            },
            "chrome-overrides": {
                expand: true,
                cwd: "src/chrome-overrides",
                src: ["**/*.*"],
                dest: "dest/"
            }
        },

        "string-replace": (() => {
            let ret = {};
            for(let name in settings.browsers){
                ret[name] = {
                    files: {
                        "dest/": ["dest/**/*.html", "dest/**/*.json", "dest/**/*.sass"]
                    },
                    options: {
                        replacements: [{
                            pattern: /<%=(.*?)%>/ig,
                            replacement(match, p1){
                                return settings.browsers[name][p1.trim()] || settings[p1.trim()] || "";
                            }
                        }]
                    }
                };
            }
            return ret;
        })(),

        watch: { // Compile everything into one task with Watch Plugin
            chrome: {
                files: "src/**/*.*",
                tasks: ["build-chrome"]
            },
            firefox: {
                files: "src/**/*.*",
                tasks: ["build-firefox"]
            }
        }
    });

    // Load Grunt plugins
    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-string-replace");

    // Default task(s).
    grunt.registerTask("build-chrome",  ["clean:dest", "copy:src-to-dest", "string-replace:chrome",  "sass", "clean:sass", "copy:chrome-overrides"]);
    grunt.registerTask("build-firefox", ["clean:dest", "copy:src-to-dest", "string-replace:firefox", "sass", "clean:sass", "copy:firefox-overrides"]);

    grunt.registerTask("watch-chrome",  ["build-chrome",  "watch:chrome"]);
    grunt.registerTask("watch-firefox", ["build-firefox", "watch:firefox"]);

    grunt.registerTask("default", ["watch-chrome"]);
};