const http = require("https");
const port = (process.env.PORT || 3000);

const options = {
	"method": "POST",
	"hostname": "hotels4.p.rapidapi.com",
	"port": port,
	"path": "/properties/v2/list",
	"headers": {
		"content-type": "application/json",
		"X-RapidAPI-Key": "24d62bf0admshd14e69ed3280831p18dd94jsn1b4310951a39",
		"X-RapidAPI-Host": "hotels4.p.rapidapi.com",
		"useQueryString": true
	}
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on("data", function (chunk) {
		chunks.push(chunk);
	});

	res.on("end", function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});



req.write(JSON.stringify({
  currency: 'USD',
  eapid: 1,
  locale: 'en_US',
  siteId: 300000001,
  destination: {regionId: '6054439'},
  checkInDate: {day: 10, month: 10, year: 2022},
  checkOutDate: {day: 15, month: 10, year: 2022},
  rooms: [{adults: 2, children: [{age: 5}, {age: 7}]}],
  resultsStartingIndex: 0,
  resultsSize: 200,
  sort: 'PRICE_LOW_TO_HIGH',
  filters: {price: {max: 150, min: 100}}
}));
req.end();

