window.onload = function () {
	var url = new URL(window.location.href);
    var start_url= url.searchParams.get("start");
	var end_url = url.searchParams.get("end");
	var name_url = url.searchParams.get("name");
	var type_url = url.searchParams.get("type");
	var min_url =url.searchParams.get("minprice");
	var max_url =url.searchParams.get("maxprice");
	var page_url = url.searchParams.get("page");
	//function for the typeahead input.
	function psedoRefresh(nexturl){
		var nexturl = new URL(window.location.href);
		var nextstart_url= nexturl.searchParams.get("start");
		var nextend_url = nexturl.searchParams.get("end");
		var nextname_url = nexturl.searchParams.get("name");
		var nexttype_url = nexturl.searchParams.get("type");
		var nextmin_url = nexturl.searchParams.get("minprice");
		var nextmax_url = nexturl.searchParams.get("maxprice");
		$.ajax({
			url: "/api/search/?name="+nextname_url+"&start="+nextstart_url+"&end="+nextend_url+"&type="+nexttype_url+"&minprice="+nextmin_url+"&maxprice="+nextmax_url,
			cache: false,
			success: function(data){
				console.log(data);
				result=data;
				//$('#results').html('');

				if(data['response'].length>0){
					$('#noresults').hide();
					$('.optional-filter').show();
				}
				else{
					$('#noresults').show();
					$('.optional-filter').show();
				}

				data['response'].map(function(d){
					//console.log(d.hotel, Object.keys(d.room_types));
					//console.log(d);
					putResults(d);
				});
				paginate(data)	
			}
		});

	}

	function paginate(data){
		var nexturl = new URL(window.location.href);
		var nextstart_url= nexturl.searchParams.get("start");
		var nextend_url = nexturl.searchParams.get("end");
		var nextname_url = nexturl.searchParams.get("name");
		var nexttype_url = nexturl.searchParams.get("type");
		var nextmin_url = nexturl.searchParams.get("minprice");
		var nextmax_url = nexturl.searchParams.get("maxprice");
		$(`.pagination`).html('')
		var span=$('<span/>')
		span.addClass('page-links')
		if(data['has_prev']){
			span.append(`<a href="/hotel/?name=${nextname_url}&start=${nextstart_url}&end=${nextend_url}&type=${nexttype_url}&minprice=${nextmin_url}&maxprice=${nextmax_url}&page=${data['prev_page']}">previous</a>`)
		}
		if(data['has_next']){
			span.append(`<a href="/hotel/?name=${nextname_url}&start=${nextstart_url}&end=${nextend_url}&type=${nexttype_url}&minprice=${nextmin_url}&maxprice=${nextmax_url}&page=${data['next_page']}">next</a>`)
		}
		span.appendTo(`.pagination`)
	}

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
				//var cityVal = $("#typeahead").val();
				let clicked = [];
				$('.filter1').each(function(i,d){
					console.log(i,d);
					if ($(this).is(':checked')) {
						clicked.push($(this).val());
					}
				})

				$('#results').html('');
				nexturl="/hotel/"+"?name="+name_url+"&start="+start_url+"&end="+end_url+"&type="+clicked.join('|')+"&minprice="+min_url+"&maxprice="+max_url
				history.pushState({}, null, nexturl);
				
				psedoRefresh(nexturl)
			})
		}
	});

	var tooltip = $('<div id="tooltip" />').css({
		position: 'absolute',
		top: -25,
		left: -10
	}).hide();

	var max_price;
	var min_price;
	var lower;
	var higher;
	
	$.ajax({
		url:`/api/maxroomprice/?name=${name_url}&type=${type_url}`,
		cache: false,
		success: function(data){
			console.log(data)
			max_price=data.price
			$.ajax({
				url:`/api/minroomprice/?name=${name_url}&type=${type_url}`,
				cache: false,
				success: function(data){
					console.log(data)
					min_price=data.price
					console.log(max_price,min_price, max_url, min_url=='null')
					if(max_url!='null' && min_url!='null'){
						higher=max_url
						lower=min_url
					}
					else{
						higher=max_price
						lower=min_price
					}
					$( "#slider" ).slider({
						range:true,
						min: parseFloat(min_price),
						max: parseFloat(max_price),
						values: [ parseFloat(lower),parseFloat(higher) ],
						step: 10,
						create: function(event,ui){
							$(`#changevalue`).val("$" + lower + " - $" + higher)
						},
						change: function( event, ui ) {
							lower= ui.values[ 0 ] 
							higher= ui.values[ 1 ]
							$(`#changevalue`).val("$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ])
							$('#results').html('');
							console.log(type_url)
							nexturl="/hotel/"+"?name="+name_url+"&start="+start_url+"&end="+end_url+"&type="+type_url+"&minprice="+ui.values[ 0 ]+"&maxprice="+ui.values[ 1 ]
							history.pushState({}, null, nexturl);
							console.log(ui.values[ 0 ],ui.values[ 1 ])
							psedoRefresh(nexturl)
						},
						slide: function( event, ui ) {
							tooltip.text(ui.value);
						}
					}).find(".ui-slider-handle").append(tooltip).hover(function() {
						tooltip.show()
					}, function() {
						tooltip.hide()
					});
					
				}
			});
		}
	});

	//dates
	var fromdate=moment().format('YYYY-MM-DD');
	var todate=moment().add(1,'days').format('YYYY-MM-DD');
	


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
		window.location.href="/hotel/"+"?name="+cityVal+"&start="+fromdate+"&end="+todate+"&type="+clicked.join('|')+"&minprice="+min_price+"&maxprice="+max_price
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

	
	console.log(moment(start_url), moment(end_url), name_url, type_url)
	console.log('\n\n\n\n',min_url,max_url)
	if(type_url == null){
		type_url="AC|Non-AC|Delux";
		nexturl="/hotel/"+"?name="+name_url+"&start="+start_url+"&end="+end_url+"&type="+type_url+"&minprice="+min_url+"&maxprice="+max_url+"&page="+page_url;
		history.pushState({}, null, nexturl);
	}
	/*
	if(min_url==null || max_price==null){
		min_url=min_price;
		max_url=max_price;
		nexturl="/hotel/"+"?name="+name_url+"&start="+start_url+"&end="+end_url+"&type="+type_url+"&minprice="+min_url+"&maxprice="+max_url;
		history.pushState({}, null, nexturl);
	}
	*/
	console.log('\n\n\n\n',min_url,max_url)
	if(start_url!=null & end_url!=null & name_url!=null){
		$.ajax({
            url: "/api/search/?name="+name_url+"&start="+start_url+"&end="+end_url+"&type="+type_url+"&minprice="+min_url+"&maxprice="+max_url+"&page="+page_url,
            cache: false,
            success: function(data){
				$('#typeahead').val(name_url)

				
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

				type_url_arr=type_url.split('|')
				$('.filter1').each(function(i,d){
					console.log(i,d);
					if ($.inArray(d.id, type_url_arr)>-1) {
						console.log(d.id)
						$(this).prop("checked",true);
						console.log(d,$(this).prop("checked"))
					}
					else{
						console.log($.inArray(d.id, type_url_arr),d.id,type_url_arr)
						$(this).prop("checked",false);
						console.log(d,$(this).prop("checked"))
					}
				})
				

				fromdate=moment(start_url).format('YYYY-MM-DD')
				todate=moment(end_url).format('YYYY-MM-DD')
				console.log(data);
				result=data;
				//$('#results').html('');

				if(data['response'].length>0){
					$('#noresults').hide();
					$('.optional-filter').show();	
				}
				else{
					console.log("hi")
					$('#noresults').show();
					$('.optional-filter').hide();
				}

				

				//$('.filter1').attr('checked','true');
				data['response'].map(function(d){
					//console.log(d.hotel, Object.keys(d.room_types));
					//console.log(d);
					putResults(d);
				});
				paginate(data)
            }
        });
	}
	
	
	
}
