const farmConnect = require('farmos');
const farmLog = require('./farmLog');
const defaultResources = require('./defaultResources');

const {
  createLog,
  formatLogForServer,
  mergeLogFromServer,
  getConflicts,
  resolveConflict,
} = farmLog(defaultResources.log);

const connection = farmConnect('http://localhost', { clientId: 'farm' });
const localLog = createLog({
  type: 'farm_activity',
  name: 'My brand new log!',
});

connection.authorize('admin', 'admin')
  .then(() => connection.log.send(formatLogForServer(localLog)))
  .then(response => {
    // Before the timeout fires, go make a change to the log on the server.
    console.log(`Update the log server-side at ${response.uri}`);

    // Meanwhile this will change the log client-side.
    localLog.name = 'Update from the client!';

    // Set a timeout to request the log again after 30 seconds.
    return new Promise (resolve => {
      setTimeout(() => connection.log.get(+response.id).then(resolve), 30000)
    })
  })
  .then(serverLog => {
    // Merge the response into our local copy of the log.
    mergeLogFromServer(localLog, serverLog);
    // Read out the conflicts created by the merge.
    const conflicts = getConflicts(localLog);
    console.log('Conflicts on the name prop: ', conflicts.name);
    // Resolve the conflict by selecting the server version of the name.
    resolveConflict(localLog, 'name', conflicts.name[0].data);
    // Show that the name conflict has been resolved.
    console.log('Resolved name: ', localLog.name);
  })
  .catch(console.error);
