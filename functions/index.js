const functions = require('firebase-functions');
const xmljs = require('xml-js');

exports.parseUddf = functions.region('europe-west1').https.onCall((data, context) => {
    const body = data.uddf;
    const parsed = JSON.parse(xmljs.xml2json(body, {
        compact: true,
        spaces: 2,
        ignoreDeclaration: true,
        ignoreComment: true
    }));
    let divesites;
    const dives = [];
    if (parsed && parsed.divelog) {
        if (parsed.divelog.divesites) {
            divesites = getDiveSites(parsed.divelog.divesites);
        }
        if (parsed.divelog.dives) {
            if (Array.isArray(parsed.divelog.dives.dive)) {
                const allDives = parsed.divelog.dives.dive;
                allDives.map(dive => {
                    const divesite = getDiveSiteForDive(dive, divesites);
                    const details = getDiveDetails(dive, divesite)
                    const waypoints = getWaypoints(dive.divecomputer.sample)
                    dives.push({details: details, waypoints: waypoints})
                })
            } else {
                const dive = parsed.divelog.dives.dive
                const divesite = getDiveSiteForDive(dive, divesites);
                const details = getDiveDetails(dive, divesite)
                const waypoints = getWaypoints(dive.divecomputer.sample)
                dives.push({details: details, waypoints: waypoints})
            }
        }
    }
    return dives;
});

getDiveSites = function (divesites) {
    if (Array.isArray(divesites.site)) {
        return divesites.site.map(element => {
            const gps = element._attributes.gps.split(" ");
            const site = {
                id: element._attributes.uuid,
                name: element._attributes.name,
                country: element.geo?._attributes?.value,
                lat: Number(gps[0]),
                long: Number(gps[1]),
            };
            return { id: element._attributes.uuid, diveSite: site };
        })
    } else {
        const gps = divesites.site._attributes.gps.split(" ");
        const site = {
            id: divesites.site._attributes.uuid,
            name: divesites.site._attributes.name,
            country: divesites.site.geo?._attributes?.value,
            lat: Number(gps[0]),
            long: Number(gps[1]),
        }
        return [{ id: divesites.site._attributes.uuid, diveSite: site }]
    }
};

getDiveDetails = function (dive, diveSite) {
    return {
        greatestDepth: Number(dive.divecomputer.depth._attributes.max.split(" ")[0]).round(2),
        avgDepth: Number(dive.divecomputer.depth._attributes.mean.split(" ")[0]).round(2),
        duration: getDurationInSeconds(dive._attributes.duration),
        startTime: `${dive._attributes.date}T${dive._attributes.time}`,
        current: '',
        diveSite: diveSite
    }
}

getDiveSiteForDive = function (dive, divesites) {
    if (!dive._attributes.divesiteid) {
        return {}
    }
    const divesite = divesites.filter(site => site.id === dive._attributes.divesiteid)
    if (divesite.length === 1) {
        return divesite[0].diveSite;
    }
    return {}
}

getWaypoints = function (diveSamples) {
    let waypoints = []
    diveSamples.map(waypoint => {
        waypoints.push({
            depth: parseDepthInMeters(waypoint._attributes.depth),
            divetime: getDurationInSeconds(waypoint._attributes.time),
            temperature: getKelvin(waypoint._attributes.temp)
        })
    })
    return waypoints
}

getDurationInSeconds = function (minutesDuration) {
    const duration = minutesDuration.split(" ")[0]
    const unit = minutesDuration.split(" ")[1]
    if (unit === 'min') {
        const minutes = duration.split(":")[0]
        const seconds = duration.split(":")[1]
        return Number(minutes) * 60 + Number(seconds)
    } else {
        // TODO handle other units than minutes
        return 0
    }
}

parseDepthInMeters = function (depth) {
    return Number(depth.substr(0, depth.indexOf(' ')));
}

getKelvin = function (temp) {
    if (!temp) {
        return undefined;
    }
    const unit = temp.slice(-1);
    if (unit === 'C') {
        return (Number(temp.substr(0, temp.indexOf(' '))) + 273.15).round(2);
    }
    // TODO handle F
}

Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places)  + "e-" + places);
}

addWaypoint = function (waypointToAdd, waypoints) {
    waypoints.push(
        {
            depth: Number(waypointToAdd.depth._text),
            divetime: Number(waypointToAdd.divetime._text),
            temperature: Number(waypointToAdd.temperature._text)
        }
    );
}
