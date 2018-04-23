'use strict';

const got = require('got');
const chalk = require('chalk');

const mappings = require('../mappings.json');

got('http://builds.emberjs.com/canary/ember-docs.json')
  .then(response => {
    let json = JSON.parse(response.body);
    processJSON(json);
  })
  .catch(error => {
    console.error(chalk.red(error));
  });

function processJSON(json) {
  let staticClasses = Object.keys(json.classes)
    .map(it => json.classes[it])
    .filter(it => it.static)
    .map(it => it.name);

  json.classitems
    .filter(it => it.access === 'public')
    .filter(it => staticClasses.indexOf(it.class) !== -1)
    .forEach(it => {
      if (!it.name) {
        return;
      }

      let globalName = `${it.class}.${it.name}`;
      let newImport = mappings.find(
        it => !it.deprecated && it.global === globalName
      );

      report(globalName, newImport);
    });

  Object.keys(json.classes)
    .map(it => json.classes[it])
    .filter(it => !it.static)
    .filter(it => it.access === 'public')
    .forEach(it => {
      let globalName = it.name;
      let newImport = mappings.find(
        it => !it.deprecated && it.global === globalName
      );

      report(globalName, newImport);
    });
}

function report(globalName, newImport) {
  if (newImport) {
    console.log(
      chalk.green(
        `${globalName} -> ${newImport.module} ${
          newImport.export === 'default' ? '' : `(${newImport.export})`
        }`
      )
    );
  } else {
    console.log(chalk.red(`${globalName} -> ?`));
  }
}
