const covidapi = require('covid19-api');

async function getCases(countrySearch){
    var cases = {};

    await covidapi.getReports().then( obj => {

        let item = obj[0][0].table[0];

        for(let i = 0; i < item.length; i++){

            if(Object.values(item[i])[0] == countrySearch ){
                cases.totalCases = parseInt(item[i].TotalCases);
                cases.totalDeaths = parseInt(item[i].TotalDeaths);
                cases.totalRecovered = parseInt(item[i].TotalRecovered);
                cases.activeCases = parseInt(item[i].ActiveCases);

                break;
            }
        }        
    });

    return cases;
}

async function hasNewCases(country, currentCases){
    let fetchedCases = await getCases(country);
    let awnser = false;

    if(currentCases.totalCases < fetchedCases.totalCases) {
        awnser = true;
    }

    console.log( currentCases.totalCases +'--'+ fetchedCases.totalCases+'--'+ (currentCases.totalCases < fetchedCases.totalCases))
    
    return awnser;
}

module.exports = {
    getCases,
    hasNewCases
}