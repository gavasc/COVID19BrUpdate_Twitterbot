const control = require('./casesControler');

let updatedCases = {};
cases = {
    'totalCases': 1000000,
    'activeCases': 500000,
    'criticalCases': 7000,
    'recoveredCases': 1000000,
    'deathCases': 60000
}

postCurrentTotal();

check('brazil');

setInterval( () => {
    check('brazil');
}, 60000); // 1min  

async function check(country){

    if(await control.hasNewCases(country, cases)){
        await update(country);
        postUpdate();

        setTimeout(() => {
            postCurrentTotal();
        }, 6000); // 3s
    } else {
        console.log('No new cases');
    }
}

function postUpdate(){
    let text = '';
    let hashtags = '\n\n#covid19 #COVID_19 #covid19brasil #coronavirusnobrasil';

    if(updatedCases.difTotal > 0){
        text = '\n' + `Mais ${updatedCases.difTotal} novo(s) caso(s) reportados no país.\nAgora com um total de ${cases.totalCases} casos, sendo ${cases.activeCases} casos ativos\n`;
        console.log( text.concat(hashtags) );

    }
    if(updatedCases.difDeaths > 0){
        text = '\n' +`Mais ${updatedCases.difDeaths} óbito(s) devido ao vírus no país.\nAgora com um total de ${cases.deathCases} mortes.\n`;
        
        setTimeout(()=>{
            console.log( text.concat(hashtags) );
        }, 2000); //2s

    }
    if(updatedCases.difRecovered > 0){
        text = '\n' +`Mais ${updatedCases.difRecovered} caso(s) de recuperação no país.\nAgora com um total de ${cases.recoveredCases} casos curados.\n`;

        setTimeout(()=>{
            console.log( text.concat(hashtags) );
        }, 4000); //4s

    }
}

function postCurrentTotal(){
    let text = `Até agora temos no Brasil:\n\n-${cases.totalCases} casos confirmados\n-${cases.deathCases} mortes confirmadas\n-${cases.recoveredCases} casos de recuperação\n-${cases.activeCases} casos ativos, sendo que ${cases.criticalCases} desses casos são críticos`;
    let hashtags = '\n\n#covid19 #COVID_19 #covid19brasil #coronavirusnobrasil';

    text = text.concat(hashtags);
    
    console.log(text);
}

async function update(country){
    let newCases = await control.getCases(country);
    
    updatedCases = {
        'difTotal': newCases.totalCases - cases.totalCases,
        'difActive': newCases.activeCases - cases.activeCases,
        'difCritical': newCases.criticalCases - cases.criticalCases,
        'difRecovered': newCases.recoveredCases - cases.recoveredCases,
        'difDeaths': newCases.deathCases - cases.deathCases
    }
    
    cases.totalCases += updatedCases.difTotal;
    cases.activeCases += updatedCases.difActive;
    cases.criticalCases += updatedCases.difCritical;
    cases.recoveredCases += updatedCases.difRecovered;
    cases.deathCases += updatedCases.difDeaths;

}