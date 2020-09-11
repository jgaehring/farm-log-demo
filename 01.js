const farmLog = require('./farmLog');
const defaultResources = require('./defaultResources');
const print = require('./print');

// Preload the library with defaults and destructure the functions we need.
const {
  createLog,
  getLastChange,
} = farmLog(defaultResources.log);


// Create a log with those defaults.
const log = createLog();
print(log);


// Reassign the name and print it.
log.name = 'A new name';
print(log.name);


// After a while, mark the log done, then access the metadata.
setTimeout(() => {
  log.done = true;
  const nameChanged = getLastChange(log, 'name');
  const doneChanged = getLastChange(log, 'done');
  print(`Name changed @ ${new Date(nameChanged).toLocaleTimeString()}`);
  print(`Done changed @ ${new Date(doneChanged).toLocaleTimeString()}`);
}, 2000);
