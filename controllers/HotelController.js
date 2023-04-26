const Amadeus = require('amadeus');

const amadeus = new Amadeus({
  clientId: 'QHX1gTf9QqTQ0RFbS9r8IkctsPd1PMh5',
  clientSecret: 'casjiyryVG9uAylR'
});

let cityCode = '';
// City search suggestions
exports.citySearch = async (req, res) => {
  const { keyword } = req.query;
  const response = await amadeus.referenceData.locations.get({
    keyword,
    subType: Amadeus.location.city,
  });
  
  try {
    const data = JSON.parse(response.body).data;
    if (data.length > 0) {
      cityCode = data[0].address.cityCode;
    }
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
}



exports.hotelSearch = async (req, res) => {
    const { hotelId } = req.query;
    const response = await amadeus.referenceData.locations.hotels.byCity.get({
        cityCode : cityCode
      })
    try {
      await res.json(JSON.parse(response.body));
    } catch (err) {
      await res.json(err);
    }
  }
