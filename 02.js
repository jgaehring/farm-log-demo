const farmConnect = require('farmos');
const farmLog = require('./farmLog');
const defaultResources = require('./defaultResources');
const print = require('./print');

const {
  getLogTypes,
  setLogTypes,
  createLog,
  formatLogForServer,
} = farmLog(defaultResources.log);

// Print out the default log types.
print(Object.keys(getLogTypes()));

// Set up the connection with the server.
const connection = farmConnect('http://localhost', { clientId: 'farm' });
connection.authorize('admin', 'admin')
  // Call the /farm.json endpoint.
  .then(() => connection.info())
  .then(response => {
    // Set the log types based on the server response and print again.
    setLogTypes(response.resources.log);
    print(Object.keys(getLogTypes()));
  })
  .then(() => {
    // Create a new log based on the new log types.
    const localLog = createLog({
      type: 'farm_soil_test',
      name: 'New Soil Test',
    });
    print(localLog);
    return localLog;
  })
  .then(localLog => {
    // Prepare the log for the server and send it.
    const formattedLog = formatLogForServer(localLog);
    return connection.log.send(formattedLog);
  })
  .then(print);
