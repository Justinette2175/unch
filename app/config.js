var staticPath = __dirname + '/static';

var db = process.env.DB || "localhost";
var db_port = process.env.DB_PORT || 27017;

module.exports = {
	'url' : 'http://localhost',
	'secret': 'whatisthepointhereistherearea',
	'database' : 'mongodb://' + db + ':' + db_port + '/unch',
	//display rules
	showLogin: false,
	gridLink: false
}
