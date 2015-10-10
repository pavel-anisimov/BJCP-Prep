module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
    'jade:dev',
    'stylus:dev',
    'sync:dev'
	]);
};
