const degreesToRadians = (degrees) => {
    return degrees * Math.PI / 180;
}

const round = (num) => {
    const m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}

const getDistanceInKilometer = (lat1, lon1, lat2, lon2) => {
    const radiusOfEarthKm = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1) *
        Math.cos(lat2);


    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return round(radiusOfEarthKm * c);
}

export default getDistanceInKilometer;