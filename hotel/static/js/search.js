window.onload = function () {
	//function for the typeahead input.
	function typeaheadInit(cityList){ 
		var substringMatcher = function (strs) {
			return function findMatches(q, cb) {
				var matches, substringRegex;

				// an array that will be populated with substring matches
				matches = [];

				// regex used to determine if a string contains the substring `q`
				substrRegex = new RegExp(q, 'i');

				// iterate through the pool of strings and for any string that
				// contains the substring `q`, add it to the `matches` array
				$.each(strs, function (i, str) {
					if (substrRegex.test(str)) {
						matches.push(str);
					}
				});

				cb(matches);
			};
		};

		var states = cityList;

		$('#the-basics .typeahead').typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		},
			{
				name: 'states',
				source: substringMatcher(states)
			});
	};

	//to get all the city names
	$.ajax({
		url: "/api/city/",
		cache: false,
		success: function(data){
			const cities = data.map(function(d){
				return d.name;
			});

			typeaheadInit(cities);
		}
	});

	//for checkboxes
	$.ajax({
		url: "/api/roomtype/",
		cache: false,
		success: function(data){
			console.log(data);
			
			data.map(function(d){
				var div= $('<div/>');
				div.addClass('form-check');
				div.append(`<input type="checkbox" class="form-check-input filter1" id="${d.name}" value="${d.name}"></input>`);
				div.append(`<label class="form-check-label" for="${d.name}">${d.name}</label>`);
				div.appendTo('#roomtype-filter');
			});
			//to change the result when checkboxes are clicked
			$('.filter1').click(function(d){
				// console.log($(this).val());
				let clicked = [];
				$('.filter1').each(function(i,d){
					//console.log(i,d);
					if ($(this).is(':checked')) {
						clicked.push($(this).val());
					}
				})
				$('#results').html('');
				console.log(clicked);
				var newResult=[];
				result.map(function(d){
					var d_new={}
					
					d_new.room_types={};
					//console.log(d_new);
					var count=0;
					clicked.map(function(k){
						//console.log(k,d.room_types[k]);
						if(d.room_types[k]!=undefined){ //to see if the required room type is present in the result
							d_new.room_types[k]=d.room_types[k];
							count+=1;
						}
					})
					//console.log(d_new);
					if(count>0){
						d_new.hotel=d.hotel;
						d_new.image_link=d.image_link;
						newResult.push(d_new);
						putResults(d_new);
					}
				});
				console.log(newResult);
				

			})
		}
	});

	//dates
	var fromdate=moment().format('YYYY-MM-DD');
	var todate=moment().format('YYYY-MM-DD');
	
	//datepicker as daterange picker
	$('input[name="daterange"]').daterangepicker({
		opens: 'right',
		startDate: moment(),
		endDate: moment(),
		minDate: moment(),
		dateFormat: 'dd-mm-yyyy',
	}, function (start, end, label) {
		console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
		fromdate=start.format('YYYY-MM-DD');
		todate=end.format('YYYY-MM-DD');
		console.log( fromdate, todate);
	});


	var result;

	//to append results in the body in bootstrap card format
	function putResults(d){
		var out= $('<div/>')
		var div= $('<div/>');
		div.addClass('card');    
		div.append(`<img src=${d.image_link} class="hotel_img card-img-top">`);
		var cardbody= $('<div/>');
		cardbody.addClass('card-body');
		cardbody.append(`<h5 class='card-title'>${d.hotel}</h5>`);
		cardbody.append(`<p class='card-text'>${Object.keys(d.room_types)}</p>`);
		cardbody.append(`<a href='/hotel/${d.hotel_id}/' class="btn btn-primary">Book</a>`)
		
		div.append(cardbody);
		out.append(div);
		out.addClass('col-md-4')
		out.appendTo('#results');
	}

	//function when the main search button is clicked
	$("#main-filter-button").click(function(e){
		const cityVal = $("#typeahead").val();
		const dateRange = $("#date-range").val();
		
		console.log(cityVal, dateRange, fromdate, todate);
		$.ajax({
            url: "/api/search/?name="+cityVal+"&start="+fromdate+"&end="+todate,
            cache: false,
            success: function(data){
				console.log(data);
				result=data;
				$('#results').html('');
				data.map(function(d){
					//console.log(d.hotel, Object.keys(d.room_types));
					
					putResults(d);
				});
				$('.filter1').attr('checked','true');
            }
          });
	});
}
