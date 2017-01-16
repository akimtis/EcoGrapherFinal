	function drawGraph() {
    // Create the chart
	    Highcharts.chart('graph-well', {
			chart: {
				type: 'line',
				zoomType: 'xy'
        	},

			title: {
	            text: 'Highcharts data from Google Spreadsheets'
	        },

	        data: {
	            googleSpreadsheetKey: '1swa7IJkys5J2UmZRswntYrvgo_lm7M9ADgW7W0mgC-o'
	        }
	    });
	}; // drawGraph()