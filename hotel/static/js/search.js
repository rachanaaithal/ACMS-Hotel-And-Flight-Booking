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
		opens: 'right',
		startDate: moment(),
		endDate: moment().add(1,'days'),
		minDate: moment(),
		dateFormat: 'dd-mm-yyyy',
	}, function (start, end, label) {
		console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
		fromdate=start.format('YYYY-MM-DD');
		todate=end.format('YYYY-MM-DD');
		console.log( fromdate, todate);
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

	let clicked = [];
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
				clicked.push(d.name)
			});
			//to change the result when checkboxes are clicked
			$('.filter1').click(function(d){
				// console.log($(this).val());
				var cityVal = $("#typeahead").val();
				let clicked = [];
				$('.filter1').each(function(i,d){
					console.log(i,d);
					if ($(this).is(':checked')) {
						clicked.push($(this).val());
					}
				})

				$('#results').html('');
				console.log(clicked);
				nexturl="/hotel/"+"?name="+cityVal+"&start="+fromdate+"&end="+todate+"&type="+clicked.join('|')
				history.pushState({}, null, nexturl);
				
				$.ajax({
					url: "/api/search/?name="+name_url+"&start="+start_url+"&end="+end_url+"&type="+clicked.join('|'),
					cache: false,
					success: function(data){
						console.log(data);
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
							//console.log(d);
							putResults(d);
						});
						
					}
				});


				/*
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
						d_new.hotel_id=d.hotel_id;
						newResult.push(d_new);
						putResults(d_new);
					}
				});
				console.log(newResult);
				*/
				//$('.filter1').attr('checked','true');
			})
		}
	});

	//dates
	var fromdate=moment().format('YYYY-MM-DD');
	var todate=moment().format('YYYY-MM-DD');
	


	var result;

	//to append results in the body in bootstrap card format
	function putResults(d){
		console.log(d)
		var out= $('<div/>')
		var div= $('<div/>');
		div.addClass('card');    
		
		var imgdiv= $('<div class="imgdiv"/>');
		imgdiv.append(`<img src=${d.image_link} class="hotel_img card-img-top">`);
		imgdiv.append(`<div class="hotel_img_overlay card-img-top"/>`);
		
		imgdiv.append(`<h5 class='card-title hotelname'>${d.hotel}</h5>`);
		div.append(imgdiv);
		var cardbody= $('<div/>');
		cardbody.addClass('card-body hotelbody');
		cardbody.append(`<p class='card-text'><span class='chiptext'>Categories</span> ${Object.keys(d.room_types)}</p>`);
		cardbody.append(`<a href='/hotel/${d.hotel_id}/?fromdate=${fromdate}&todate=${todate}' class="btn btn-primary book-btn">Book</a>`)
		
		div.append(cardbody);
		out.append(div);
		out.addClass('col-md-4 carddiv')
		out.appendTo('#results');
	}

	//function when the main search button is clicked
	$("#main-filter-button").click(function(e){
		const cityVal = $("#typeahead").val();
		const dateRange = $("#date-range").val();
		console.log(window.location)
		window.location.href="/hotel/"+"?name="+cityVal+"&start="+fromdate+"&end="+todate+"&type="+clicked.join('|')
		console.log(cityVal, dateRange, fromdate, todate);
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
	var end_url = url.searchParams.get("end");
	var name_url = url.searchParams.get("name");
	var type_url = url.searchParams.get("type");
	console.log(moment(start_url), moment(end_url), name_url, type_url)
	console.log(type_url)
	if(start_url!=null & end_url!=null & name_url!=null){
		$.ajax({
            url: "/api/search/?name="+name_url+"&start="+start_url+"&end="+end_url+"&type="+type_url,
            cache: false,
            success: function(data){
				$('#typeahead').attr('value',name_url)

				
				console.log(start_url, end_url)
				$('input[name="daterange"]').daterangepicker({
					opens: 'right',
					startDate: moment(start_url), 
					endDate: moment(end_url),
					minDate: moment(),
					dateFormat: 'dd-mm-yyyy',
				}, function (start, end, label) {
					console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
					fromdate=start.format('YYYY-MM-DD');
					todate=end.format('YYYY-MM-DD');
					console.log( fromdate, todate);
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


				fromdate=moment(start_url).format('YYYY-MM-DD')
				todate=moment(end_url).format('YYYY-MM-DD')
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
				data.map(function(d){
					//console.log(d.hotel, Object.keys(d.room_types));
					//console.log(d);
					putResults(d);
				});
				
            }
        });
	}

}
