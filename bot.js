const Twit = require('twit');
const config = require('./config');
const bot = new Twit(config);

const control = require('./casesControler');
var cases = {};
var updateCases = {};

begin();

setInterval( () => {
    check('Brazil');
}, 900000); //15min

async function check(country){

    if(await control.hasNewCases(country, cases)){
        update(country);

        console.log(updateCases);

        postUpdate();
        setTimeout(() => {
            postCurrentTotal();
        }, 180000); //3min
    } else {
        let dateObj = new Date();
        console.log(`Without new cases at ${dateObj.getDate}/${dateObj.getMonth}-${dateObj.getHours}:${dateObj.getMinutes}`);
    }
}

function postUpdate(){
    let text;
    let hashtags = '\n\n#covid19 #COVID_19 #covid19brasil #coronavirusnobrasil';

    if(updateCases.newCases != 0){
        text = `Mais ${updateCases.newCases} novo(s) caso(s) reportados no país.\nAgora com um total de ${cases.totalCases} casos, sendo ${cases.activeCases} casos ativos`;
        console.log('1');
    } else if(updateCases.newDeaths != 0){
        text = `Mais ${updateCases.newDeaths} óbito(s) devido ao vírus no país.\nAgora com um total de ${cases.totalDeaths} mortes.`;
        console.log('2');
    } else if(updateCases.newRecovered != 0){
        text = `Mais ${updateCases.newRecovered} caso(s) de recuperação no país.\nAgora com um total de ${cases.totalRecovered} casos curados.`;
        console.log('3');
    }

    // let tweet = {
    //     status: text
    // }

    text = text.concat(hashtags);

    bot.post('statuses/update', { status: text }, (err, data, response) => {
        if(err) console.log(err);
        else console.log('Update success');
    })
}

function postCurrentTotal(){
    let text = `Até agora temos no Brasil:\n\n-${cases.totalCases} casos confirmados\n-${cases.totalDeaths} mortes confirmadas\n-${cases.totalRecovered} casos de recuperação\n-${cases.activeCases} casos ativos`;
    let hashtags = '\n\n#covid19 #COVID_19 #covid19brasil #coronavirusnobrasil';

    // let tweet = {
    //     status: text
    // }

    text = text.concat(hashtags);

    bot.post('statuses/update', { status: text }, (err, data, response) => {
        if(err) console.log(err);
        else console.log('Success');
    })
}

async function update(country){
    let newCases = await control.getCases(country);
    updateCases = {
        'newCases': newCases.totalCases - cases.totalCases,
        'newDeaths': newCases.totalDeaths - cases.totalDeaths,
        'newRecovered': newCases.totalRecovered - cases.totalRecovered,
        'activeCases': newCases.activeCases
    };

    cases.totalCases += updateCases.newCases;
    cases.totalDeaths += updateCases.newDeaths;
    cases.totalRecovered += updateCases.newRecovered;
    cases.activeCases = updateCases.activeCases;
}

async function begin() {
    cases = await control.getCases('Brazil');

    // postCurrentTotal();
}