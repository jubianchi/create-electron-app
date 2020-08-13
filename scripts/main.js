#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const { Command } = require('commander');
const emailValidator = require('email-validator');
const urlValidator = require('valid-url');
const packageJson = require('../package.json');
const chalk = require('chalk');
const { log, npm, prompt, steps, spdx } = require('./utils');

let appDirectory, appDirectoryExists, updateExistingApp, appPackageJson;

const program = new Command(packageJson.name.replace(/^@.*?\//, ''))
    .version(packageJson.version)
    .arguments('<app-directory>')
    .option('-u, --update', 'Update existing application')
    .action((directory, { update }) => {
        appDirectory = path.resolve(process.cwd(), directory);
        appDirectoryExists = fs.existsSync(appDirectory);
        updateExistingApp = !!update;

        try {
            appPackageJson = require(path.resolve(appDirectory, 'package.json'));
        } catch (error) {
            appPackageJson = {};
        }
    })
    .parse(process.argv);

if (typeof appDirectory === 'undefined') {
    log.error.block('the app-directory argument is required!');

    program.outputHelp();

    process.exit(1);
}

new Promise(resolve => {
    const message = `Directory already exists at ${appDirectory}!`;

    if (appDirectoryExists && !updateExistingApp) {
        throw new Error(`${message} Use --update if you want to update an existing application.`);
    }

    if (appDirectoryExists && updateExistingApp) {
        log.warning.block(`${message} Be sure to have a VCS configured to track changes.`);
        log();
    }

    resolve();
})
    .then(() =>
        prompt(
            {
                type: 'input',
                name: 'name',
                message: 'Application name?',
                default: appPackageJson.name || path.basename(appDirectory),
                validate: input => !!input || 'Application name is required!',
            },
            {
                type: 'input',
                name: 'version',
                message: 'Application version?',
                default: appPackageJson.version || '0.1.0',
                validate: input => {
                    if (!input) {
                        return 'Application version is required!';
                    }

                    if (!semver.valid(input)) {
                        return 'Application version is invalid!';
                    }

                    return true;
                },
            },
            {
                type: 'input',
                name: 'description',
                message: 'Application description?',
                default: appPackageJson.description || null,
            },
            {
                type: 'autocomplete',
                name: 'license',
                message: 'Application license?',
                source: async (answersSoFar, input) => {
                    const quote = input => (input || '').replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
                    const pattern = new RegExp(quote(input), 'i');

                    return Object.keys(spdx)
                        .map(value => ({
                            name: `${spdx[value].name}${value ? ` (${value})` : ''}${
                                typeof spdx[value].osiApproved !== 'undefined'
                                    ? spdx[value].osiApproved
                                        ? ' ✔'
                                        : ' ✖'
                                    : ''
                            }`,
                            value,
                        }))
                        .filter(
                            choice =>
                                typeof input === 'undefined' ||
                                choice.name.match(pattern) ||
                                choice.value.match(pattern),
                        )
                        .sort(({ name: a }, { name: b }) => (a > b ? 1 : b > a ? -1 : 0));
                },
                filter: input => (!input ? packageJson.license || '' : input),
            },
            {
                type: 'input',
                name: 'authorName',
                message: 'Application author name?',
                default: (appPackageJson.author || {}).name || process.env.USER || null,
            },
            {
                type: 'input',
                name: 'authorEmail',
                message: 'Application author email?',
                default: (appPackageJson.author || {}).email || null,
                validate: input => !input || emailValidator.validate(input) || 'Application author email is invalid',
            },
            {
                type: 'input',
                name: 'homepage',
                message: 'Application homepage?',
                default: appPackageJson.homepage || null,
                validate: input => !input || !!urlValidator.isWebUri(input) || 'Application homepage is invalid',
            },
            {
                type: 'confirm',
                name: 'dependabot',
                message: 'Would you like us to configure Dependabot?',
                default: true,
            },
            {
                type: 'confirm',
                name: 'ghActions',
                message: 'Would you like us to configure GitHub Actions?',
                default: true,
            },
        ),
    )
    .then(({ authorName, authorEmail, dependabot, ghActions, ...answers }) => {
        log();

        if (!appDirectoryExists) {
            log.info('Creating application directory...');
            steps.appDirectory(appDirectory);
            log.success(` ✔ Directory was created at ${appDirectory}`);
        }

        log.info('Writing package.json file...');
        const author = {};

        if (authorName && authorEmail) {
            author.name = authorName;
            author.email = authorEmail;
        } else {
            log.warning(
                ' ! You did not set the author name and/or email: this is required to package the application for Linux targets.',
            );
        }

        if (!answers.homepage) {
            log.warning(
                ' ! You did not set the homepage: this is required to package the application for Linux targets.',
            );
        }

        steps.packageJson(appDirectory, packageJson, { ...appPackageJson, author, ...answers });
        log.success(` ✔ File was written to ${path.resolve(appDirectory, 'package.json')}`);

        if (answers.license !== appPackageJson.license && spdx[answers.license].licenseText) {
            log.info('Writing LICENSE file...');
            steps.license(appDirectory, spdx[answers.license].licenseText);
            log.success(` ✔ File was written to ${path.resolve(appDirectory, 'LICENSE')}`);
            log.warning(
                ` ! You should review the contents of ${path.resolve(
                    appDirectory,
                    'LICENSE',
                )} as it probably needs to be customized.`,
            );
        }

        log.info('Preparing application sources...');
        for (const entry of steps.sources(appDirectory)) {
            log.success(` ✔ ${entry} was written to ${path.resolve(appDirectory, entry)}`);
        }

        if (dependabot || ghActions) {
            log.info('Preparing Github configurations...');

            for (const entry of steps.dotGithub(appDirectory, dependabot, ghActions)) {
                log.success(` ✔ ${entry} was written to ${path.resolve(appDirectory, entry)}`);
            }
        }

        log();

        return prompt({
            type: 'confirm',
            name: 'install',
            message: 'Would you like us to run npm install?',
            default: true,
        });
    })
    .then(({ install }) => {
        if (install) {
            npm(appDirectory, 'install');

            return prompt({
                type: 'confirm',
                name: 'build',
                message: 'Would you like us to do an initial build?',
                default: true,
            });
        }

        return { build: false };
    })
    .then(({ build }) => {
        if (build) {
            npm(appDirectory, 'run', 'build');
        }
    })
    .then(() => {
        log();
        log.success.block('Your application is ready!');

        log(
            'none',
            chalk`
            \r{bold Before you start, you should:}
   
            \r* Be sure to have read the documentation;    
            \r* Configure a VCS in your application directory (if it's not already done);
            \r${
                appDirectoryExists
                    ? chalk`* Review the changes made by {magenta create-electron-app}`
                    : chalk`* Review the contents of {magenta config/electron-builder.js}`
            };

            \r{bold From now on, you will be able to:}

            \r* Start your development environment using {magenta npm start};
            \r* Execute the test suite using {magenta npm test};
            \r* Build the application using {magenta npm run build};
            \r* Package the application using {magenta npm run package};
        `,
        );
    })
    .catch(error => {
        log.error.block(error.message);

        program.outputHelp();

        process.exit(1);
    });
