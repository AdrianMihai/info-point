const getInstitutions = (dbConnection, currentLocation) => {
	return new Promise((resolve, reject) => {
		dbConnection.query('SELECT * FROM Institutions', function(error, results, fields) {
	        if (error)
	            reject(error.message);
	        
	        resolve(results);
		});
	});
};

const getInstitutionActions = (dbConnection, institution) => {
	return new Promise((resolve, reject) => {
		dbConnection.query('SELECT * FROM `Actions` WHERE `InstitutionId` = ?', institution.Id, function(error, results, fields) {
	        if (error)
	            reject(error.message);
	        resolve(results);
	    });
	    
	});
};
const getActionInstructions = (dbConnection, action) => {
	return new Promise((resolve, reject) => {
		dbConnection.query(
			'SELECT * FROM `ActionInstructions` WHERE `ActionId` = ? ORDER BY `Order` ASC',
			action.Id,
			function(error, results, fields) {
				if (error)
					reject(error.message);
				resolve(results);
		});
	});
};

let institutionsData = {
	getAllInstitutionsData: async function(dbConnection, response, currentLocation = {}){
		try {
			let institutionsData = await getInstitutions(dbConnection, currentLocation)

			for (let i = 0; i < institutionsData.length; i++) {
				institutionsData[i].actions = await getInstitutionActions(dbConnection, institutionsData[i]);

				for (let j = 0; j < institutionsData[i].actions.length; j++) {
					institutionsData[i].actions[j].instructions = await getActionInstructions(dbConnection, institutionsData[i].actions[j]);
				}
			}
			
			response.send(JSON.stringify(institutionsData));

		}
		catch(error) {
			console.log(error);
		}
	}
};

module.exports = institutionsData;