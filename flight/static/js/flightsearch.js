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

	//datepicker as daterange picker
	$('input[name="daterange"]').daterangepicker({
	    singleDatePicker: true,
	    showDropdowns: true,
	    minDate: moment(),
	    dateFormat: 'dd-mm-yyyy',
	  }, function(start, end, label) {
    	console.log("A new date selection was made: " + start.format('YYYY-MM-DD'));
		startdate=start.format('YYYY-MM-DD'); //fromdate
		console.log(startdate)
  });

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

	let clicked=[]
	//for checkboxes
	$.ajax({
		url: "/api/seattype/",
		cache: false,
		success: function(data){
			console.log(data);
			
			data.map(function(d){
				var div= $('<div/>');
				div.addClass('form-check');
				div.append(`<input type="checkbox" class="form-check-input filter1" id="${d.name}" value="${d.name}"></input>`);
				div.append(`<label class="form-check-label" for="${d.name}">${d.name}</label>`);
				div.appendTo('#seattype-filter');
				clicked.push(d.name)
			});
			//to change the result when checkboxes are clicked
			$('.filter1').click(function(d){
				// console.log($(this).val());
				var source = $("#typeahead-source").val();
				var destination = $("#typeahead-destination").val();
				let clicked = [];
				$('.filter1').each(function(i,d){
					console.log("checked:",i,d);
					if ($(this).is(':checked')) {
						clicked.push($(this).val());
					}
				})
				$('#results').html('');
				console.log(clicked);
				nexturl="/flight/"+"?source="+source+"&destination="+destination+"&start="+startdate+"&type="+clicked.join('|')
				history.pushState({}, null, nexturl);
				
				$.ajax({
					url: "/api/sflights/?source="+source+"&destination="+destination+"&start="+start_url+"&type="+clicked.join('|'),
					cache: false,
					success: function(data){
						result=data;
						//$('#results').html('');
		
						if(data.length>0){
							$('#noresults').hide();
							$('.optional-filter').show();
						}
						else{
							$('#noresults').show();
							$('.optional-filter').hide();
						}
		
						data.map(function(d){
							//console.log(d.hotel, Object.keys(d.room_types));
							console.log(d);
							putResults(d);
						});
						
					}
				});
				/*result.map(function(d){
					var d_new={}
					
					d_new.seat_types={};
					//console.log(d_new);
					var count=0;
					clicked.map(function(k){
						//console.log(k,d.room_types[k]);
						if(d.seat_types[k]!=undefined){ //to see if the required room type is present in the result
							d_new.seat_types[k]=d.seat_types[k];
							count+=1;
						}
					})
					//console.log(d_new);
					if(count>0){
						d_new.flight=d.flight;
						d_new.image_link=d.image_link;
						d_new.flight_id=d.flight_id;
						newResult.push(d_new);
						putResults(d_new);
					}
				});
				console.log(newResult);
				
				$('.filter1').attr('checked','true');*/
			})
		}
	});

	//dates
	var startdate=moment().format('YYYY-MM-DD');
	
	var result;

	//to append results in the body in bootstrap card format
	function putResults(d){
		console.log(d)
		var out= $('<div/>')
		var div= $('<div/>');
		div.addClass('card');    
		
		var imgdiv= $('<div class="imgdiv"/>');
		imgdiv.append(`<img src=${d.image_link} class="flight_img card-img-top">`);
		imgdiv.append(`<div class="flight_img_overlay card-img-top"/>`);
		
		imgdiv.append(`<h5 class='card-title flightname'>${d.flight}</h5>`);
		div.append(imgdiv);
		var cardbody= $('<div/>');
		cardbody.addClass('card-body flightbody');
		cardbody.append(`<p class='card-text'><span class='chiptext'>Seat Position</span> ${Object.keys(d.seat_position)}</p>`);
		cardbody.append(`<a href='/flight/${d.flight_id}/?startdate=${startdate}&source=${d.source}&destination=${d.destination}' class="btn btn-primary book-btn">Book</a>`)
		
		div.append(cardbody);
		out.append(div);
		out.addClass('col-md-4 carddiv')
		out.appendTo('#results');
	}

	//function when the main search button is clicked
	$("#main-filter-button").click(function(e){
		const source = $("#typeahead-source").val();
		const destination = $("#typeahead-destination").val();
		const dateRange = $("#date-range").val();
		console.log(window.location)
		window.location.href="/flight/"+"?source="+source+"&destination="+destination+"&start="+startdate+"&type="+clicked.join('|')
		console.log(source,destination, startdate);
/*		$.ajax({
            url: "/api/search/?name="+cityVal+"&start="+fromdate+"&end="+todate,
            cache: false,
            success: function(data){
				console.log(data);
				result=data;
				$('#results').html('');

				if(data.length>0){
					$('#noresults').hide();
					$('.optional-filter').show();
				}

				data.map(function(d){
					//console.log(d.hotel, Object.keys(d.room_types));
					//console.log(d);
					putResults(d);
				});
				$('.filter1').attr('checked','true');
            }
		  });
		  */
	});

	var url = new URL(window.location.href);
    var start_url= url.searchParams.get("start");
    var source_url=url.searchParams.get("source")
	var destination_url = url.searchParams.get("destination");
	var type_url = url.searchParams.get("type");
	console.log(moment(start_url), source_url, destination_url, type_url)
	console.log(type_url)
	if(type_url == null){
		type_url="Economy|Business|First Class";
		nexturl="/flight/"+"?source="+source_url+"&destination="+destination_url+"&start="+start_url+"&type="+type_url;
		history.pushState({}, null, nexturl);
	}
	if(source_url!=null & destination_url!=null & start_url!=null){
		$.ajax({
            url: "/api/sflights/?source="+source_url+"&destination="+destination_url+"&start="+start_url+"&type="+type_url,
            cache: false,
            success: function(data){
				$('#typeahead-source').val(source_url)
				$('#typeahead-destination').val(destination_url)
				console.log(source_url, destination_url)

				//datepicker as daterange picker
					$('input[name="daterange"]').daterangepicker({
					    singleDatePicker: true,
					    showDropdowns: true,
					   	minDate: moment(),
					    startDate:moment(start_url),
					    dateFormat: 'dd-mm-yyyy',
					  }, function(start, end, label) {
				    	console.log("A new date selection was made: " + start.format('YYYY-MM-DD'));
						startdate=start.format('YYYY-MM-DD');
						console.log(startdate);
				  });
				type_url=type_url.split('|')
				$('.filter1').each(function(i,d){
					console.log(i,d);
					if ($.inArray(d.id, type_url)>-1) {
						console.log(d.id)
						$(this).prop("checked",true);
						console.log(d,$(this).prop("checked"))
					}
					else{
						console.log($.inArray(d.id, type_url),d.id,type_url)
						$(this).prop("checked",false);
						console.log(d,$(this).prop("checked"))
					}
				})
				startdate=moment(start_url).format('YYYY-MM-DD')
				console.log(data);
				result=data;
				//$('#results').html('');

				if(data.length>0){
					$('#noresults').hide();
					$('.optional-filter').show();		
				}
				else{
					console.log("hi")
					$('#noresults').show();
					$('.optional-filter').hide();
				}
				//$('.filter1').attr('checked','true');
				console.log(data)
				data.map(function(d){
					//console.log(d.hotel, Object.keys(d.room_types));
					//console.log(d);
					putResults(d);
				});	
            }
        });
	}
}