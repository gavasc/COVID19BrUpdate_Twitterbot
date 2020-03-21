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
    } else {
        let dateObj = new Date();
        console.log(`Without new cases at ${dateObj.getDate}/${dateObj.getMonth}-${dateObj.getHours}:${dateObj.getMinutes}`);
    }
}

function postUpdate(){
    let text;

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

    bot.post('statuses/update', { status: text }, (err, data, response) => {
        if(err) console.log(err);
        else console.log('Update success');
    })

    console.log(updateCases);
}

function postCurrentTotal(){
    let text = `Até agora temos no Brasil:\n\n-${cases.totalCases} casos confirmados\n-${cases.totalDeaths} mortes confirmadas\n-${cases.totalRecovered} casos de recuperação\n-${cases.activeCases} casos ativos`;

    // let tweet = {
    //     status: text
    // }

    bot.post('statuses/update', { status: text }, (err, data, response) => {
        if(err) console.log(err);
        else console.log('Success');
    })
}

async function update(country){
    let newCases = await control.getCases(country);
    updateCases = {};

    updateCases.newCases = newCases.totalCases - cases.totalCases;
    updateCases.newDeaths = newCases.totalDeaths - cases.totalDeaths;
    updateCases.newRecovered = newCases.totalRecovered - cases.totalRecovered;
    updateCases.activeCases = newCases.activeCases;

    cases.totalCases += updateCases.newCases;
    cases.totalDeaths += updateCases.newDeaths;
    cases.totalRecovered += updateCases.newRecovered;
    cases.activeCases = updateCases.activeCases;
}

async function begin() {
    cases = await control.getCases('Brazil');
    updateCases = {
        newCases: 0,
        newDeaths: 0,
        newRecovered: 0,
        activeCases: 0
    }

    // postCurrentTotal();
}