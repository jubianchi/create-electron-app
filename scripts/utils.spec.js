const child = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { log, npm, prompt, spdx, steps: { appDirectory, packageJson, license, sources } } = require('./utils');

jest.mock('child_process');
jest.mock('fs-extra');
jest.mock('inquirer');

describe('Scripts utils', () => {
    describe('log', () => {
        const message = 'Hello World!';

        beforeEach(() => { log.io.out = jest.fn(); });
        beforeEach(() => { log.io.err = jest.fn(); });

        describe('default style', () => {
            const style = 'none';

            test('should write to stdout', () => expect(log().io.out.mock.calls.length).toBe(1));
            test('should write a cariage return if no message provided', () => expect(log().io.out.mock.calls[0][0]).toBe('\n'));
            test('should not format the message', () => expect(log(style, message).io.out.mock.calls[0][0]).toBe(`${message}\n`));
            test('should provide a line helper', () => expect(log.line(style, message).io.out.mock.calls[0][0]).toBe(`${message}\n`));

            describe('block', () => {
                test('should format the message', () => expect(log(style, message, true).io.out.mock.calls[0][0]).toBe(`              \n ${message} \n              \n`));
                test('should provide a helper', () => expect(log.block(style, message).io.out.mock.calls[0][0]).toBe(`              \n ${message} \n              \n`));
            });
        });

        describe('success style', () => {
            const style = 'success';

            test('should write to stdout', () => expect(log(style).io.out.mock.calls.length).toBe(1));
            test('should format the message', () => expect(log(style, message).io.out.mock.calls[0][0]).toBe(`${chalk.green(message)}\n`));
            test('should provide a helper', () => expect(log.success(message).io.out.mock.calls[0][0]).toBe(`${chalk.green(message)}\n`));
            test('should provide a line helper', () => expect(log.success.line(message).io.out.mock.calls[0][0]).toBe(`${chalk.green(message)}\n`));

            describe('block', () => {
                test('should format the message', () => expect(log(style, message, true).io.out.mock.calls[0][0]).toBe(`${chalk.bgGreen.black.bold(' Success      ')}\n${chalk.bgGreen.black('              ')}\n${chalk.bgGreen.black(` ${message} `)}\n${chalk.bgGreen.black('              ')}\n`));
                test('should provide a helper', () => expect(log.success.block(message).io.out.mock.calls[0][0]).toBe(`${chalk.bgGreen.black.bold(' Success      ')}\n${chalk.bgGreen.black('              ')}\n${chalk.bgGreen.black(` ${message} `)}\n${chalk.bgGreen.black('              ')}\n`));
            });
        });

        describe('info style', () => {
            const style = 'info';

            test('should write to stdout', () => expect(log(style).io.out.mock.calls.length).toBe(1));
            test('should format the message', () => expect(log(style, message).io.out.mock.calls[0][0]).toBe(`${chalk.cyan(message)}\n`));
            test('should provide a helper', () => expect(log.info(message).io.out.mock.calls[0][0]).toBe(`${chalk.cyan(message)}\n`));
            test('should provide a line helper', () => expect(log.info.line(message).io.out.mock.calls[0][0]).toBe(`${chalk.cyan(message)}\n`));

            describe('block', () => {
                test('should format the message', () => expect(log(style, message, true).io.out.mock.calls[0][0]).toBe(`${chalk.bgCyan.black.bold(' Info         ')}\n${chalk.bgCyan.black('              ')}\n${chalk.bgCyan.black(` ${message} `)}\n${chalk.bgCyan.black('              ')}\n`));
                test('should provide a helper', () => expect(log.info.block(message).io.out.mock.calls[0][0]).toBe(`${chalk.bgCyan.black.bold(' Info         ')}\n${chalk.bgCyan.black('              ')}\n${chalk.bgCyan.black(` ${message} `)}\n${chalk.bgCyan.black('              ')}\n`));
            });
        });

        describe('warning style', () => {
            const style = 'warning';

            test('should write to stdout', () => expect(log(style).io.out.mock.calls.length).toBe(1));
            test('should format the message', () => expect(log(style, message).io.out.mock.calls[0][0]).toBe(`${chalk.yellow(message)}\n`));
            test('should provide a helper', () => expect(log.warning(message).io.out.mock.calls[0][0]).toBe(`${chalk.yellow(message)}\n`));
            test('should provide a line helper', () => expect(log.warning.line(message).io.out.mock.calls[0][0]).toBe(`${chalk.yellow(message)}\n`));

            describe('block', () => {
                test('should format the message', () => expect(log(style, message, true).io.out.mock.calls[0][0]).toBe(`${chalk.bgYellow.black.bold(' Warning      ')}\n${chalk.bgYellow.black('              ')}\n${chalk.bgYellow.black(` ${message} `)}\n${chalk.bgYellow.black('              ')}\n`));
                test('should provide a helper', () => expect(log.warning.block(message).io.out.mock.calls[0][0]).toBe(`${chalk.bgYellow.black.bold(' Warning      ')}\n${chalk.bgYellow.black('              ')}\n${chalk.bgYellow.black(` ${message} `)}\n${chalk.bgYellow.black('              ')}\n`));
            });
        });

        describe('error style', () => {
            const style = 'error';

            test('should write to stderr', () => expect(log(style).io.err.mock.calls.length).toBe(1));
            test('should format the message', () => expect(log(style, message).io.err.mock.calls[0][0]).toBe(`${chalk.red(message)}\n`));
            test('should provide a helper', () => expect(log.error(message).io.err.mock.calls[0][0]).toBe(`${chalk.red(message)}\n`));
            test('should provide a line helper', () => expect(log.error.line(message).io.err.mock.calls[0][0]).toBe(`${chalk.red(message)}\n`));

            describe('block', () => {
                test('should format the message', () => expect(log(style, message, true).io.err.mock.calls[0][0]).toBe(`${chalk.bgRed.white.bold(' Error        ')}\n${chalk.bgRed.white('              ')}\n${chalk.bgRed.white(` ${message} `)}\n${chalk.bgRed.white('              ')}\n`));
                test('should provide a helper', () => expect(log.error.block(message).io.err.mock.calls[0][0]).toBe(`${chalk.bgRed.white.bold(' Error        ')}\n${chalk.bgRed.white('              ')}\n${chalk.bgRed.white(` ${message} `)}\n${chalk.bgRed.white('              ')}\n`));
            });
        });
    });

    describe('npm', () => {
        const cwd = __dirname;
        const arg = 'run';
        const otherArg = 'foo';

        beforeEach(() => npm(__dirname, arg, otherArg));

        test('should spawn npm synchronously', () => expect(child.spawnSync.mock.calls.length).toBe(1));
        test('should inherit I/O', () => expect(child.spawnSync.mock.calls[0][2]).toHaveProperty('stdio', 'inherit'));
        test('should set the current working directory', () => expect(child.spawnSync.mock.calls[0][2]).toHaveProperty('cwd', cwd));
        test('should run npm silently', () => expect(child.spawnSync.mock.calls[0][1]).toContain('--silent'));
        test('should run npm with arguments', () => expect(child.spawnSync.mock.calls[0][1].slice(1)).toEqual([arg, otherArg]));
    });

    describe('prompt', () => {
        beforeEach(() => prompt({ type: 'confirm' }));

        test('should register a new type', () => expect(inquirer.registerPrompt.mock.calls.length).toBe(1));
        test('should register autocomplete', () => expect(inquirer.registerPrompt.mock.calls[0][0]).toBe('autocomplete'));
    });

    describe('spdx', () => {
        beforeEach(() => prompt({ type: 'confirm' }));

        test('should contain an empty choice', () => expect(spdx).toHaveProperty('', { name: '' }));
        test('should contain the UNLICENSED license', () => expect(spdx).toHaveProperty('UNLICENSED', { name: 'Unlicensed' }));
    });

    describe('steps', () => {
        describe('appDirectory', () => {
            const dir = __dirname + '/foobar';

            describe('directory does not exist', () => {
                beforeEach(() => appDirectory(dir));

                test('should create directory', () => expect(fs.mkdirpSync.mock.calls.length).toBe(1));
            });

            describe('directory already exists', () => {
                beforeEach(() => fs.existsSync.mockReturnValue(true));

                test('should throw', () => expect(() => appDirectory(dir)).toThrowError(`Directory ${dir} already exists!`));
            });
        });

        describe('packageJson', () => {
            const dir = __dirname + '/foobar';
            const json = {
                _test: true,
                name: 'foo',
                version: '1.0.0',
                description: 'foo app',
                license: 'MIT',
                bin: {},
                bundleDependencies: {},
                deprecated: false,
                optionalDependencies: {
                    'bootstrap': '^4',
                    'react': '^16',
                    'react-dom': '^16',
                },
                devDependencies: {
                    jest: '^23',
                    webpack: '^4',
                },
                scripts: {
                    test: 'jest',
                    build: 'webpack',
                    'test:scripts': 'jest --rootDir scripts/',
                }
            };
            const appJson = {
                name: 'bar',
                version: '0.1.0',
                description: 'bar app',
                license: 'BSD-2-Clause',
                dependencies: {
                    'react': '^17',
                    'react-dom': '^17',
                },
                devDependencies: {
                    jest: '^24',
                    mocha: '^1',
                },
                scripts: {
                    build: 'webpack --bail'
                }
            };


            beforeEach(() => packageJson(dir, json, appJson));

            test('should write package.json synchronously', () => expect(fs.writeFileSync.mock.calls.length).toBe(1));
            test('should write package.json to the target directory', () => expect(fs.writeFileSync.mock.calls[0][0]).toBe(path.resolve(dir, 'package.json')));
            test('should exclude underscore-prefixed keys from template JSON', () => expect(JSON.parse(fs.writeFileSync.mock.calls[0][1])).not.toHaveProperty('_test'));

            ['bin', 'bundleDependencies', 'deprecated', 'optionalDependencies'].forEach(key => {
                test(`should exclude the ${key} key from template JSON`, () => expect(JSON.parse(fs.writeFileSync.mock.calls[0][1])).not.toHaveProperty(key));
            });

            test('should set the private key', () => expect(JSON.parse(fs.writeFileSync.mock.calls[0][1])).toHaveProperty('private', true));

            Object.keys(appJson)
                .filter(key => ['dependencies', 'devDependencies', 'scripts'].indexOf(key) === -1)
                .forEach(key => {
                    test(`should override the ${key} key from template JSON`, () => expect(JSON.parse(fs.writeFileSync.mock.calls[0][1])).toHaveProperty(key, appJson[key]));
                })
            ;

            describe('dependencies', () => {
                test('should set from template optionalDependencies', () => expect(Object.keys(JSON.parse(fs.writeFileSync.mock.calls[0][1]).dependencies)).toEqual(Object.keys(json.optionalDependencies)));

                test('should overwrite versions in application JSON', () => Object.keys(json.optionalDependencies)
                    .forEach(dependency => expect(JSON.parse(fs.writeFileSync.mock.calls[0][1]).dependencies[dependency]).toEqual(json.optionalDependencies[dependency])));
            });

            describe('devDependencies', () => {
                test('should merge template and application JSONs', () => expect(Object.keys(JSON.parse(fs.writeFileSync.mock.calls[0][1]).devDependencies)).toEqual(Object.keys({ ...json.devDependencies, ...appJson.devDependencies}).sort((a, b) => a > b ? 1 : b > a ? -1 : 0)));

                test('should overwrite versions in application JSON', () => Object.keys(json.devDependencies)
                    .forEach(dependency => expect(JSON.parse(fs.writeFileSync.mock.calls[0][1]).devDependencies[dependency]).toEqual(json.devDependencies[dependency])));
            });

            describe('scripts', () => {
                test('should exclude the text:scripts script', () => expect(Object.keys(JSON.parse(fs.writeFileSync.mock.calls[0][1]).scripts)).not.toContain('test:scripts'));
                test('should merge template and application JSONs', () => expect(Object.keys(JSON.parse(fs.writeFileSync.mock.calls[0][1]).scripts)).toEqual([...Object.keys(json.scripts).filter(key => key !== 'test:scripts'), ...Object.keys(appJson.scripts)].filter((key, index, array) => array.indexOf(key) === index).sort((a, b) => a > b ? 1 : b > a ? -1 : 0)));
                test('should overwrite script definitions in application JSON', () => Object.keys(json.scripts).filter(key => key !== 'test:scripts')
                    .forEach(script => expect(JSON.parse(fs.writeFileSync.mock.calls[0][1]).scripts[script]).toEqual(json.scripts[script])));
            });
        });

        describe('license', () => {
            const dir = __dirname + '/foobar';
            const text = 'Lorem ipsum dolor si amet';

            beforeEach(() => license(dir, text));

            test('should write LICENSE synchronously', () => expect(fs.writeFileSync.mock.calls.length).toBe(1));
            test('should write LICENSE to the target directory', () => expect(fs.writeFileSync.mock.calls[0][0]).toBe(path.resolve(dir, 'LICENSE')));
        });

        describe('sources', () => {
            const dir = __dirname + '/foobar';

            beforeEach(() => { for (const _ of sources(dir)); });

            ['config', 'src'].forEach((entry, index) => {
                test(`should copy the ${entry} file/directory`, () => {
                    expect(fs.copySync.mock.calls[index][0]).toBe(path.resolve(__dirname, '..', entry));
                    expect(fs.copySync.mock.calls[index][1]).toBe(path.resolve(dir, entry));
                });
            });

            test(`should write the .gitignore to the target directory`, () => expect(fs.writeFileSync.mock.calls[0][0]).toBe(path.resolve(dir, '.gitignore')));
        });
    });
});
