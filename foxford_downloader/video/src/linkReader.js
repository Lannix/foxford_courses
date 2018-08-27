const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const prompt = require("prompt-sync")();

module.exports = class {
    constructor() {
        this.linksFile = path.join(path.dirname(process.argv[0]), 'links.txt');
    }

    get linkList() {
        let linkList = fs.readFileSync(this.linksFile, 'utf8')
                         .replace(/\r\n/g, "\r")
                         .replace(/\n/g, "\r")
                         .split(/\r/)
                         .filter(Boolean)
                         |> (filteredList => new Set(filteredList))
                         |> (uniqueList => [...uniqueList]);

        if (linkList.length === 0) {
            console.log(chalk.red('Ссылки не загружены'));
            process.exit(1);
        }

        if (!linkList.every(elem => { return /^https:\/\/foxford\.ru\/groups\/\d{3,6}$/.test(elem) })) {
            console.log(chalk.red('Одна или несколько ссылок не прошли проверку на корректность.'));
            process.exit(1);

        } else {
            console.log(chalk.green(`Ссылок загружено: ${linkList.length}\n`));
            return linkList;
        }
    }

    promptLinks() {
        if (fs.existsSync(this.linksFile)) {
            console.log(chalk.green('links.txt найден.\n'));

        } else {
            fs.closeSync(fs.openSync(this.linksFile, 'w'));
            console.log(chalk.yellow('links.txt создан.\n'));
        }

        console.log(chalk.yellow('Соберите ссылки на видео вида "https://foxford.ru/groups/<id>" и положите их в links.txt\n'));

        let isReady = 'Введите Y, когда будете готовы. N - чтобы выйти. '
                        |> chalk.yellow
                        |> prompt
                        |> (input => /^Y$/i.test(input));
        if (!isReady) {
            process.exit(0);
        }
    }
};
