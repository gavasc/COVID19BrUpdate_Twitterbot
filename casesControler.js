const api = require('covid19-gatherer');

async function getCases(countrySearch){

    let fetchedCases = await api.getCasesByCountry(countrySearch);

    let cases = {
        'totalCases': fetchedCases.total,
        'activeCases': fetchedCases.activeCases.totalActiveCases,
        'criticalCases': fetchedCases.activeCases.criticalCases,
        'recoveredCases': fetchedCases.closedCases.recoveredCases,
        'deathCases': fetchedCases.closedCases.deathCases
    }

    return cases;
}

async function hasNewCases(country, currentCases){
    let fetchedCases = await getCases(country);
    let awnser = false;
    
    if(currentCases.totalCases < fetchedCases.totalCases) {
        awnser = true;
    } else if (currentCases.deathCases < fetchedCases.deathCases){
        awnser = true;
    } else if (currentCases.recoveredCases < fetchedCases.recoveredCases){
        awnser = true;
    }
    
    return awnser;
}

module.exports = {
    getCases,
    hasNewCases
}