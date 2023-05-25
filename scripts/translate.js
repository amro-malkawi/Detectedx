const dotenv = require('dotenv');
const { Translate } = require('@google-cloud/translate').v2;
const _ = require('lodash');
const fs = require('fs');

const TRANSLATIONS_PATH = './src/Assets/i18n';
const SOURCE_LANGUAGE = 'en';
const GOOGLE_STRING_LIMIT = 128;

const getAllPathsAndValues = (parent) => {
    const paths = [];

    const recursive = (object, path = '') => {
        if (typeof object === 'object') {
            Object.keys(object).forEach((key) => {
                const newPath = path ? `${path}.${key}` : key;
                recursive(object[key], newPath);
            });
        } else {
            paths.push([path, object]);
        }
    };

    recursive(parent);

    return paths;
};

const env = dotenv.config({ path: '.env' }).parsed;
const apiKey = env.GOOGLE_TRANSLATE_API_KEY;
if (!apiKey) {
    console.error('No Google Translate API key.');
    process.exit(1);
}

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Supported arguments:');
    console.log('   translate [target language key] - Translate to target language');
    console.log('   translate languages - List supported languages');
    process.exit(0);
}

if (args[0] === 'languages') {
    const translate = new Translate({ key: apiKey });
    translate.getLanguages().then((response) => {
        const languages = response[0];
        console.log('Supported languages:');
        languages.forEach((language) => console.log(`   ${language.code} - ${language.name}`));
    });
    return;
}

const targetLanguage = args[0];

const sourceExists = fs.existsSync(`./${TRANSLATIONS_PATH}/${SOURCE_LANGUAGE}.json`);
if (!sourceExists) {
    console.error(`Source language file does not exist: ${TRANSLATIONS_PATH}/${SOURCE_LANGUAGE}.json`);
    process.exit(1);
}

const targetExists = fs.existsSync(`./${TRANSLATIONS_PATH}/${targetLanguage}.json`);
if (!targetExists) {
    console.log(`Target language file does not exist: ${TRANSLATIONS_PATH}/${targetLanguage}.json`);
    console.log('Creating file...');
    fs.writeFileSync(`./${TRANSLATIONS_PATH}/${targetLanguage}.json`, '{}');
}

const sourceFile = fs.readFileSync(`./${TRANSLATIONS_PATH}/${SOURCE_LANGUAGE}.json`, 'utf-8');
const targetFile = fs.readFileSync(`./${TRANSLATIONS_PATH}/${targetLanguage}.json`, 'utf-8');

let sourceTranslations;
let targetTranslations;

try {
    sourceTranslations = JSON.parse(sourceFile);
} catch (error) {
    console.error(`Error parsing ${TRANSLATIONS_PATH}/${SOURCE_LANGUAGE}.json`);
    console.error(error.message);
    process.exit(1);
}

try {
    targetTranslations = JSON.parse(targetFile);
} catch (error) {
    console.error(`Error parsing ${TRANSLATIONS_PATH}/${targetLanguage}.json`);
    console.error(error.message);
    process.exit(1);
}

const sourcePathsValues = getAllPathsAndValues(sourceTranslations);
const targetPathsValues = getAllPathsAndValues(targetTranslations);

const pathValuesToTranslate = _.differenceBy(sourcePathsValues, targetPathsValues, (path) => path[0]);

const valuesToTranslate = pathValuesToTranslate.map((path) => path[1]);

if (valuesToTranslate.length === 0) {
    console.log('No new values to translate. Exiting...');
    process.exit(0);
}

console.log(`Found ${valuesToTranslate.length} values to translate.`);

const translate = new Translate({ key: apiKey });

const dividedValues = _.chunk(valuesToTranslate, GOOGLE_STRING_LIMIT);
const promises = dividedValues.map((values) => translate.translate(values, targetLanguage));
Promise.all(promises).then((response) => {
    console.log('Translations received.');
    const result = response.flatMap((translation => translation[0]));

    const pathsWithNewTranslations = pathValuesToTranslate.map((path, index) => [path[0], result[index]]);
    pathsWithNewTranslations.forEach((path) => _.set(targetTranslations, path[0], path[1]));

    const newTargetPathsValues = getAllPathsAndValues(targetTranslations);
    const unneededKeys = _.differenceBy(newTargetPathsValues, sourcePathsValues, (path) => path[0]);
    if (unneededKeys.length > 0) {
        console.log(`Removing ${unneededKeys.length} unneeded keys.`)
        unneededKeys.forEach((path) => _.unset(targetTranslations, path[0]));
    }

    console.log('Writing new translations to file...');
    fs.writeFileSync(`./${TRANSLATIONS_PATH}/${targetLanguage}.json`, JSON.stringify(targetTranslations, null, 2));
    console.log('Done.');
});
