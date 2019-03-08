const fs = require('fs');

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

const getActionInstructionDetails = (dbConnection, instruction) => {
	return new Promise((resolve, reject) => {

		if (instruction.FormId !== null) {
			dbConnection.query('SELECT * FROM Forms WHERE Id = ? ', instruction.FormId, function(error, results, fields) {
				if (error) {
			    	reject(error);
			    }

				let details = results[0];

				fs.readFile(details.JsonFormPath, (error, data) => {
			        if (error) {
			            throw error;
			        }

			        delete details.JsonFormPath;
			        details.formFields = JSON.parse(data);

			        resolve(details);
    			});
			});

			//console.log('form');
		}
		else if (instruction.PaymentId !== null) {

			dbConnection.query('SELECT * FROM Payments WHERE Id = ? ', instruction.PaymentId, function(error, results, fields) {
			    if (error) {
			    	reject(error);
			    }

			    resolve(results[0]);
			});
			
			//console.log('payment');
		}
		else if (instruction.TextId !== null) {
			dbConnection.query('SELECT * FROM Texts WHERE Id = ? ', instruction.TextId, function(error, results, fields) {
			    if (error) {
			    	reject(error);
			    }
			    resolve(results[0]);
			});

			//console.log('text');
		}

	});
};

const getActionInstructions = (dbConnection, action) => {
	return new Promise((resolve, reject) => {
		dbConnection.query(
			'SELECT * FROM `ActionInstructions` WHERE `ActionId` = ? ORDER BY `Order` ASC',
			action.Id,
			async function(error, results, fields) {
				if (error)
					reject(error.message);
				
				for (let i = 0; i < results.length; i++) {
					results[i].details = await getActionInstructionDetails(dbConnection, results[i]);
				}

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