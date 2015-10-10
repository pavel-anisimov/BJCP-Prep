module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
    'clean:dev',
    'jade:dev',
    'stylus:dev',
    'copy:dev'
	]);
};
