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
        postUpdate();
        setTimeout(() => {
            postCurrentTotal();
        }, 180000); //3min
    }

    console.log('------------------------------');
}

function postUpdate(){
    let text;

    if(updateCases.newCases > 0) text = `Mais ${updateCases.newCases} novos casos reportados no país.
                                Agora com um total de ${cases.totalCases} casos, sendo ${cases.activeCases} casos ativos`;
    else if(updateCases.newDeaths > 0) text = `Mais ${updateCases.newDeaths} óbitos devido ao vírus no país.
                                Agora com um total de ${cases.totalDeaths} mortes.`;
    else if(updateCases.newRecovered > 0) text = `Mais ${updateCases.newRecovered} casos de recuperação no país.
                                Agora com um total de ${cases.totalRecovered} casos curados.`;

    let tweet = {
        status: text
    }

    bot.post('statuses/update', tweet, (err, data, response) => {
        if(err) console.log(err);
        else console.log('Success');
    })
}

function postCurrentTotal(){
    let text = `Até agora temos no Brasil:\n\n-${cases.totalCases} casos confirmados\n-${cases.totalDeaths} mortes confirmadas\n-${cases.totalRecovered} casos de recuperação\n-${cases.activeCases} casos ativos`;

    let tweet = {
        status: text
    }

    bot.post('statuses/update', tweet, (err, data, response) => {
        if(err) console.log(err);
        else console.log('Success');
    })
}

async function update(country){
    let newCases = await control.getCases(country);

    updateCases.newCases = newCases.totalCases - cases.totalCases;
    updateCases.newDeaths = newCases.totalDeaths - cases.totalDeaths;
    updateCases.newRecovered = newCases.totalRecovered - cases.totalRecovered;
    updateCases.activeCases = newCases.activeCases;

}

async function begin() {
    cases = await control.getCases('Brazil');

    postCurrentTotal();
}