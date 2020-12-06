import {join} from 'path';

(() => {
    const rawDay = process.argv[2];
    if (!rawDay) throw new Error('Missing argument for day to run.');

    const day = ('0' + rawDay).slice(-2);

    console.time();
    require(join(__dirname, '..', day + '.js'));
    console.timeEnd();
})();
