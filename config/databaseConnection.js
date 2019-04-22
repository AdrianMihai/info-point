const getDatabaseCredentials = function(fileSystem) {
	if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME) {
		return {
		    host: process.env.DB_HOST ,
		    user: process.env.DB_USER,
		    password: process.env.DB_PASSWORD,
		    database: process.env.DB_NAME
		}
	}
	else {
		return JSON.parse(fileSystem.readFileSync("./dbCredentials.json", {encoding: 'utf8'}));
	}
}

module.exports = {
	getDatabaseCredentials: getDatabaseCredentials
}