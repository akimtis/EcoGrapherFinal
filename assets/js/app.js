$(document).ready(function(){
	var selection1 = "";
	var selection2 = "";

	$(document).on('click', '.dataSet', function() {
		// console.log('you clicked: ' + $(this).text().trim());

		if ($(this).text().trim() == selection1) {
			$(this).css('background-color', '#c4d4ca');
			$(this).css('color', 'black');
			selection1 = "";
		} else if ($(this).text().trim() == selection2) {
			$(this).css('background-color', '#c4d4ca');
			$(this).css('color', 'black');
			selection2 = "";
		} else if ((selection1 != "") && (selection2 != "")) {
			// do nothing-> show popover:
			// 'You must deselect one item before you can select this one.'
		} else if (selection1 == "") {
			$(this).css('background-color', '#5BC0DE');
			$(this).css('color', 'white');
			selection1 = $(this).text().trim();
			// console.log("selection1 set to: " + selection1);			
		} else if (selection2 == "") {
			$(this).css('background-color', '#5BC0DE');
			$(this).css('color', 'white');
			selection2 = $(this).text().trim();
			// console.log("selection2 set to: " + selection2);
		}
		// console.log("selection1 set to: " + selection1);
		// console.log("selection2 set to: " + selection2);
	}); // .dataSet on-click selection function


	function getSpreadsheetData() {
		var url = 'https://sheets.googleapis.com/v4/spreadsheets/1swa7IJkys5J2UmZRswntYrvgo_lm7M9ADgW7W0mgC-o/values/Sheet1!A2:H115?majorDimension=COLUMNS&key=AIzaSyCWbVVxyblRIxU04_pxNh3g2WQXkXPAknE';

		$.getJSON(url).success(function(data) {

		}).error(function(message) {
			console.error('error' + message);
		}).complete(function(data) {
			console.log('completed!');
			db = data;
			// console.log(db);

			drawGraph(db);
		});
	};

	// Need single word to act as key in hashtable.
	function getFirstWord(selection) {
        if (selection.indexOf(' ') === -1)
            return selection;
        else
            return selection.substr(0, selection.indexOf(' '));
    };


	function drawGraph(db) {
    	var arrDataSets = db.responseJSON.values;
    	var hash = {
    		Palmer: {
				data: arrDataSets[1],
				color: '#9717ed',
				units: ' (Scale: -10 to +10, Driest to Wettest)'
			},
    		Precipitation: {
				data: arrDataSets[2].map(Number),
				color: '#7eb6ea',
				units: ' cm per year',
			},
    		Human: {
				data: arrDataSets[3].map(Number),
				color: '#823c06',
				units: '',
			},
			Plant: {
				data: arrDataSets[4].map(Number),
				color: '#93eb82',
				units: ' (avg. qty. of individual species per 49 meter grid)',
			},
			Rabbit: {
				data: arrDataSets[5].map(Number),
				color: '#ef5e81',
				units: ' (per 10km of road)',
			},
    		Soil: {
				data: arrDataSets[6].map(Number),
				color: '#F5A362',
				units: '°C (at 5cm depth)',
			},
    		Mean: {
				data: arrDataSets[7].map(Number),
				color: '#E3D25E',
				units: '°C',
			}
    	};
    	console.log(arrDataSets[2].map(Number));
    	var key1 = getFirstWord(selection1);
    	var key2 = getFirstWord(selection2);

		Highcharts.chart('graph-well', {
			chart: {
				type: 'line',
				zoomType: 'xy'
        	},
	        xAxis: {
	            categories: db.responseJSON.values[0] // this is the years
	        },
			title: {	
	            text: 'Jornada Ecological Data'
	        },
			series: [{
	        	name: selection1,
	        	color: hash[key1].color,
	            tooltip: {
	        		valueSuffix: hash[key1].units
	        	},
	            data: JSON.parse("[" + hash[key1].data + "]")	            
	        }, {
	        	name : selection2,
				color: hash[key2].color,
	            tooltip: {
	        		valueSuffix: hash[key2].units
	        	},
	        	data: JSON.parse("[" + hash[key2].data + "]")
	        }]
	    });
	    drawTable(arrDataSets, hash, key1, key2);
	}; // drawGraph()


	function drawTable(arrDataSets, hash, key1, key2) {
		// console.log(hash);
		// console.log("drawTable is alive with: " + arrDataSets + key1 + key2);

		$('#data-table').empty();
		var rows = arrDataSets[0].length;
		$('#data-table').append("<th>Year</th><th>" + selection1 + "</th><th>" + selection2 + "</th>");
		for (var i = 0; i < rows; i++) {
			$('#data-table').append("<tr><td>" + arrDataSets[0][i] + "</td>" + "<td>" + hash[key1].data[i] + "</td>" + "<td>" + hash[key2].data[i] + "</td></tr>");
		}
	};

	
	$(document).on('click', '#graphBtn', function() {
		console.log("Clicked graphBtn.");
		getSpreadsheetData();
		drawGraph();
	}); // #graphBtn on-click


	$(document).on('click', '#pdfButton', function() {
		console.log('Clicked DownloadPDF button.');

        var chart = $('#graph-well').highcharts();
		// POSSIBLY COULD APPEND THE CAPTION TO chart HERE. **************************
        chart.exportChart({
            type: 'application/pdf',
    	});
	}); // #pdfButton on-click

	// dictionary functionality
    var definitions = {
        'abundance': "(noun) abun·dance: The number of individuals or the representation of the number of individuals of a species in a particular ecosystem. Unit: number of individuals/sampling area or sampling effort."
        ,
        'biogeochemical': "(noun) bio·geo·chem·i·cal: of or relating to the partitioning and cycling of chemical elements and compounds between the living and nonliving parts of an ecosystem"

        ,
        'biomass': "(noun) bio·mass: The mass per unit area of living material (plants, animals, microbes). Unit: g/m2 or kg/ha."

        ,
        'cover': "(noun)  cov·er: The amount or proportion of surface area occupied by plants or animals. Unit: %."

        ,
        'decomposition': "The breakdown of organic matter (e.g., litter) accompanied by the release of carbon dioxide and other inorganic compounds. It is a key process in nutrient cycling."

        ,
        'density': "The number of individuals found in an area. Unit: #/m2 or #/ha."

        ,
        'fire disturbance': "Area burned by a fire. Unit: ha, or % of area."

        ,
        'human population density': "Number of people per unit area."

        ,
        'human population size': "Number of people living in a specified geographic area at a specified time."

        ,
        'Ice duration': "The number of days in a year when a water body (e.g., lake, a part of an ocean) is covered by ice. Unit: days/year."

        ,
        'Land use': "Land use is the human modification of natural environment or wilderness into built environment such as farmland, pastures, and settlements."

        ,
        'Litter': "(Noun): Recently fallen plant material that is only partially decomposed. Unit: %."

        ,
        'Net primary production': "The amount of carbon or energy (usually measured as biomass) fixed by primary producers (e.g., plants, algae) minus their respiratory loss. It can be used for growth and reproduction of primary producers, and is available for consumption by herbivores. Unit: g/m2/yr."

        ,
        'Palmer drought severity index': "Developed by Wayne Palmer in the 1960s and uses temperature and rainfall information in a formula to determine dryness. It uses a 0 as normal, and drought is shown in terms of minus numbers; for example, minus 2 is moderate drought, minus 3 is severe drought, and minus 4 is extreme drought."

        ,
        'Plant phenology': "The timing of life history events, such as initiation of growth, flowering and dormancy."

        ,
        'Precipitation': "(noun): The amount and pattern of rainfall and snowfall. Unit: cm"

        ,
        'Precipitation chemistry': "Concentration or total amount of an element (e.g., nitrogen, sulfur, calcium, chloride, phosphate) in precipitation. It can be expressed as volume-weighted concentration or deposition. Volume-weighted concentration is concentration per unit volume of precipitation (mg/L). It is measured on a subsample of precipitation and then converted to total volume of precipitation collected. Deposition is total amount of an element per unit of land area (kg/ha). It is converted from volume-weighted concentration based on the area receiving precipitation."

        ,
        'Primary production': "The amount of carbon or energy (usually measured as biomass) transformed from CO2 to organic carbon by primary producers (e.g., plants, algae) per unit area in a specified time period, usually seasonally or annually. Unit: g/m2/yr. Unit: cm"

        ,
        'Sea Level': "Annual mean sea level is defined as the annual arithmetic means of hourly heights relative to the National Tidal Datum Epoch (i.e., the most recent mean sea level datum established by CO-OPS currently the mean sea level 1983-2001). Unit: m."

        ,
        'soil moisture': "The total amount of water, including the water vapor, in an unsaturated soil. Unit: % by volume."

        ,
        'soil radiation': "The visible and near visible (ultra violet and near infrared) radiation emitted from the sun received per unit area. Unit: MJ/m2 The temperature of soil at a specified depth. Unit: oC"

        ,
        'species diversity': "Species diversity is a measure of the diversity within an ecological community that incorporates both species richness and the evenness of species' abundances."

    }

    for (var key in definitions) {
        var li = $("<li>");
        li.addClass("term");
        li.attr('data-term', key);

        var a = $("<a>");
        a.attr("data-toggle", "modal");
        a.attr("href", "#myModal");


        a.text(key);
        li.append(a)
        $("#dictionary-drop").append(li);

    };

    $(document).on('click', '.term', function() {
        // debugger;
        var term = $(this).attr('data-term')

        $(".modal-title").html(term);
        $(".modal-body").html(definitions[term])

    });

}); // document.ready