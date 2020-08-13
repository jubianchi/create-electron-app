const chalk = require('chalk');
const inquirer = require('inquirer');
const child = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const sortPackageJson = require('sort-package-json');
const autocomplete = require('inquirer-autocomplete-prompt');

const styles = {
    block: {
        none: msg => msg,
        error: chalk.bgRed.white,
        success: chalk.bgGreen.black,
        info: chalk.bgCyan.black,
        warning: chalk.bgYellow.black,
    },
    line: {
        none: msg => msg,
        error: chalk.red,
        success: chalk.green,
        info: chalk.cyan,
        warning: chalk.yellow,
    },
};
styles.block.none.bold = msg => msg;

const block = (type = 'none', msg = '') => {
    const pad = ` ${msg} `.replace(/./g, ' ');
    const title = `${styles.block[type].bold(
        ` ${type.substr(0, 1).toUpperCase()}${type.substr(1)}${pad.substr(type.length + 1)}`,
    )}\n`;

    return `${type !== 'none' ? title : ''}${styles.block[type](pad)}\n${styles.block[type](
        ` ${msg} `,
    )}\n${styles.block[type](pad)}`;
};
const line = (type = 'none', msg = '') => `${styles.line[type](`${msg}`)}`;
const log = (type = 'none', msg = '', isBlock = false) => {
    write(type, isBlock ? block(type, msg) : line(type, msg));

    return log;
};
const write = (type = 'none', msg = '') => log.io[type === 'error' ? 'err' : 'out'](`${msg}\n`);

log.io = {
    out: process.stdout.write.bind(process.stdout),
    err: process.stderr.write.bind(process.stderr),
};
log.line = (type, msg) => log(type, msg);
log.block = (type, msg) => log(type, msg, true);
log.error = (msg, isBlock = false) => log[isBlock ? 'block' : 'line']('error', msg);
log.error.line = msg => log.error(msg);
log.error.block = msg => log.error(msg, true);
log.success = (msg, isBlock = false) => log[isBlock ? 'block' : 'line']('success', msg);
log.success.line = msg => log.success(msg);
log.success.block = msg => log.success(msg, true);
log.info = (msg, isBlock = false) => log[isBlock ? 'block' : 'line']('info', msg);
log.info.line = msg => log.info(msg);
log.info.block = msg => log.info(msg, true);
log.warning = (msg, isBlock = false) => log[isBlock ? 'block' : 'line']('warning', msg);
log.warning.line = msg => log.warning(msg);
log.warning.block = msg => log.warning(msg, true);

const exclude = (object, excluded) =>
    Object.keys(object)
        .filter(key => !excluded.includes(key) && !excluded.find(regexp => key.match(regexp)))
        .reduce(
            (prev, key) => ({
                ...prev,
                [key]: object[key],
            }),
            {},
        );

module.exports = {
    log,
    npm: (cwd, ...opts) =>
        child.spawnSync('npm', ['--silent', ...opts], {
            stdio: 'inherit',
            cwd,
        }),
    prompt: (...prompts) => {
        inquirer.registerPrompt('autocomplete', autocomplete);

        return inquirer.prompt(prompts);
    },
    spdx: {
        '': { name: '' },
        UNLICENSED: { name: 'Unlicensed' },
        ...require('spdx-license-list/full'),
    },
    steps: {
        appDirectory: appDirectory => {
            if (fs.existsSync(appDirectory)) {
                throw new Error(`Directory ${appDirectory} already exists!`);
            }

            return fs.mkdirpSync(path.resolve(appDirectory));
        },
        packageJson: (appDirectory, packageJson, appPackageJson) =>
            fs.writeFileSync(
                path.resolve(appDirectory, 'package.json'),
                `${JSON.stringify(
                    sortPackageJson({
                        ...exclude(packageJson, [
                            /^_/,
                            'bin',
                            'bundleDependencies',
                            'deprecated',
                            'optionalDependencies',
                            'author',
                            'homepage',
                            'repository',
                        ]),
                        private: true,
                        ...appPackageJson,
                        dependencies: {
                            ...(appPackageJson.dependencies || {}),
                            ...packageJson.optionalDependencies,
                        },
                        devDependencies: {
                            ...(appPackageJson.devDependencies || {}),
                            ...packageJson.devDependencies,
                        },
                        scripts: {
                            ...(appPackageJson.scripts || {}),
                            ...exclude(packageJson.scripts, ['test:scripts']),
                        },
                    }),
                    null,
                    2,
                )}\n`,
            ),
        license: (appDirectory, license) => fs.writeFileSync(path.resolve(appDirectory, 'LICENSE'), license),
        sources: function* (appDirectory) {
            for (const entry of ['config', 'resources', 'src']) {
                fs.copySync(path.resolve(__dirname, '..', entry), path.resolve(appDirectory, entry));

                yield entry;
            }

            fs.writeFileSync(
                path.resolve(appDirectory, '.gitignore'),
                `${['/dist/', '/node_modules/', '/packages/', '/coverage/'].join('\n')}\n`,
            );

            yield '.gitignore';
        },
        dotGithub: function* (appDirectory, dependabot, ghActions) {
            if (dependabot) {
                const entry = '.github/dependabot.yml';

                fs.copySync(path.resolve(__dirname, '..', entry), path.resolve(appDirectory, entry));

                yield entry;
            }

            if (ghActions) {
                const entry = '.github/workflows';

                fs.copySync(path.resolve(__dirname, '..', entry), path.resolve(appDirectory, entry));

                yield entry;
            }
        },
    },
};
