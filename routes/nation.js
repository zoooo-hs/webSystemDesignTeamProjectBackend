var express = require('express');
var router = express.Router();

var geo = [ 
    { 
        "nation" : "Korea",
        "lat" : 37.5650172,
        "lng" : 126.8494663
    },
    {   "nation" : "Japan",
        "lat" : 35.6691074,
        "lng" : 139.6012967
    },
    {   "nation" : "Spain",
        "lat" : 40.4378698,
        "lng" : -3.81962
    },
    {
        "nation" : "China",
        "lat" : 39.9385466,
        "lng" : 116.1172767 
    },
    {
        "nation" : "France",
        "lat" : 48.8588377,
        "lng" : 2.2770204 
    }
]

router.get('/:nation', function(req, res, next) {
    console.log('server log')

    var reqNation = req.params.nation;

    geo.forEach(function(nation, index) {
        if (nation.nation == reqNation) {
            res.json(nation);
        }
    });
});

module.exports = router;
