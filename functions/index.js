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
    let parsedDives;
    let dives;
    if (parsed && parsed.uddf) {
        if (parsed.uddf.divesite) {
            divesites = getDiveSites(parsed.uddf.divesite.site);
        }
        if (parsed.uddf.profiledata && parsed.uddf.profiledata.repetitiongroup) {
            parsedDives = parsed.uddf.profiledata.repetitiongroup.dive;
            dives = parsedDives.map(dive => {
                const waypoints = [];
                const afterDive = dive.informationafterdive;
                const beforeDive = dive.informationbeforedive;
                const divesite = getDiveSiteForDive(beforeDive, divesites);
                const details = getDiveDetails(afterDive, beforeDive, divesite);
                if (dive && dive.samples && dive.samples.waypoint) {
                    dive.samples.waypoint.map(waypoint => addWaypoint(waypoint, waypoints))
                }
                return {
                    details: details,
                    waypoints: waypoints,
                };
            });
        }
    }
    return dives;
});

getDiveSites = function (divesites) {
    return divesites.map(element => {
        const site = {
            name: element.name._text,
            country: element.geography.address.country._text,
            location: element.geography.location._text,
            lat: Number(element.geography.latitude._text),
            long: Number(element.geography.longitude._text),
        };
        return { id: element._attributes.id, site: site };
    })
};

getDiveDetails = function (afterDive, beforeDive, divesite) {
    return {
        avgDepth: Number(afterDive.averagedepth._text),
        current: afterDive.current._text,
        duration: Number(afterDive.diveduration._text),
        greatestDepth: Number(afterDive.greatestdepth._text),
        startTime: beforeDive.datetime._text,
        diveSite: divesite
    };
}

getDiveSiteForDive = function (beforeDive, divesites) {
    let diveSite;
    if (beforeDive && beforeDive.link && beforeDive.link._attributes && beforeDive.link._attributes.ref) {
        // Warning: No divesite found
        diveSite = divesites.filter(site => site.id === beforeDive.link._attributes.ref)[0].site;
    }
    return diveSite;
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
