window.onload = function () {
	var url = new URL(window.location.href);
    var start_url= url.searchParams.get("start");
    var source_url=url.searchParams.get("source")
	var destination_url = url.searchParams.get("destination");
	var type_url = url.searchParams.get("type");
	var min_url =url.searchParams.get("minprice");
	var max_url =url.searchParams.get("maxprice");
	var page_url = url.searchParams.get("page");

	function psedoRefresh(nexturl){
		var nexturl = new URL(window.location.href);
		var nextstart_url= nexturl.searchParams.get("start");
		var nextsource_url = nexturl.searchParams.get("source");
		var nextdestination_url = nexturl.searchParams.get("destination");
		var nexttype_url = nexturl.searchParams.get("type");
		var nextmin_url = nexturl.searchParams.get("minprice");
		var nextmax_url = nexturl.searchParams.get("maxprice");
		$.ajax({
			url: "/api/sflights/?source="+nextsource_url+"&destination="+nextdestination_url+"&start="+nextstart_url+"&type="+nexttype_url+"&minprice="+nextmin_url+"&maxprice="+nextmax_url,
			cache: false,
			success: function(data){
				result=data;
				$('#results').html('');

				if(data['response'].length>0){
					$('#noresults').hide();
					$('.optional-filter').show();
				}
				else{
					$('#noresults').show();
					$('.optional-filter').show();
				}

				data['response'].map(function(d){
					putResults(d);
				});
				paginate(data)	
			}
		});

	}

	function paginate(data){
		var nexturl = new URL(window.location.href);
		var nextstart_url= nexturl.searchParams.get("start");
		var nextsource_url = nexturl.searchParams.get("source");
		var nextdestination_url = nexturl.searchParams.get("destination");
		var nexttype_url = nexturl.searchParams.get("type");
		var nextmin_url = nexturl.searchParams.get("minprice");
		var nextmax_url = nexturl.searchParams.get("maxprice");
		$(`.pagination`).html('')
		var span=$('<span/>')
		span.addClass('page-links')
		if(data['has_prev']){
			span.append(`<a href="/flight/?source=${nextsource_url}&destination=${nextdestination_url}&start=${nextstart_url}&type=${nexttype_url}&minprice=${nextmin_url}&maxprice=${nextmax_url}&page=${data['prev_page']}">previous</a>`)
		}
		if(data['has_next']){
			span.append(`<a href="/flight/?source=${nextsource_url}&destination=${nextdestination_url}&start=${nextstart_url}&type=${nexttype_url}&minprice=${nextmin_url}&maxprice=${nextmax_url}&page=${data['next_page']}">next</a>`)
		}
		span.appendTo(`.pagination`)
	}


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
		startdate=start.format('YYYY-MM-DD');
  });

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
	$.ajax({
		url: "/api/seattype/",
		cache: false,
		success: function(data){
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
				var source = $("#typeahead-source").val();
				var destination = $("#typeahead-destination").val();
				let clicked = [];
				$('.filter1').each(function(i,d){
					if ($(this).is(':checked')) {
						clicked.push($(this).val());
					}
				})
				$('#results').html('');
				nexturl="/flight/"+"?source="+source+"&destination="+destination+"&start="+startdate+"&type="+clicked.join('|')+"&minprice="+min_url+"&maxprice="+max_url
				history.pushState({}, null, nexturl);
				priceRefresh(clicked);
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

	function priceRefresh(para_clicked){
		if(para_clicked==undefined){
			type_to_use=type_url
		}
		else{
			type_to_use=para_clicked.join('|')
		}
		$.ajax({
			url:`/api/maximumseatcharge/?source=${source_url}&destination=${destination_url}&type=${type_to_use}`,
			cache: false,
			success: function(data){
				max_price=data.price
				$.ajax({
					url:`/api/minimumseatcharge/?source=${source_url}&destination=${destination_url}&type=${type_to_use}`,
					cache: false,
					success: function(data){
						min_price=data.price
						if(max_url!=null && min_url!=null){
							higher=max_url
							lower=min_url
						}
						else if(max_url==null || min_url==null){
							higher=max_price
							lower=min_price
						}
						else{
							higher=max_url
							lower=min_url
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
								nexturl="/flight/"+"?source="+source_url+"&destination="+destination_url+"&start="+start_url+"&type="+type_to_use+"&minprice="+ui.values[ 0 ]+"&maxprice="+ui.values[ 1 ]
								history.pushState({}, null, nexturl);
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
	}

	priceRefresh();

	var startdate=moment().format('YYYY-MM-DD');
	var result;	

	//to append results in the body in bootstrap card format
	function putResults(d){
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
		cardbody.append(`<p><b>Takeoff time:</b> ${d.takeoff_time}</p>`)
		cardbody.append(`<p><b>Landing time:</b> ${d.landing_time}</p>`)
		cardbody.append(`<a href='/flight/${d.flight_id}/?startdate=${startdate}&source=${d.source}&destination=${d.destination}' class="btn btn-primary book-btn">Book Seat</a>`)
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
		window.location.href="/flight/"+"?source="+source+"&destination="+destination+"&start="+startdate+"&type="+clicked.join('|')+"&minprice="+min_price+"&maxprice="+max_price
	});

	
	if(type_url == null){
		type_url="Economy|Business|First Class";
		nexturl="/flight/"+"?source="+source_url+"&destination="+destination_url+"&start="+start_url+"&type="+type_url+"&minprice="+min_url+"&maxprice="+max_url+"&page="+page_url;
		history.pushState({}, null, nexturl);
	}
	if(source_url!=null & destination_url!=null & start_url!=null){
		$.ajax({
            url: "/api/sflights/?source="+source_url+"&destination="+destination_url+"&start="+start_url+"&type="+type_url+"&minprice="+min_url+"&maxprice="+max_url+"&page="+page_url,
            cache: false,
            success: function(data){
				$('#typeahead-source').val(source_url)
				$('#typeahead-destination').val(destination_url)

				//datepicker as daterange picker
					$('input[name="daterange"]').daterangepicker({
					    singleDatePicker: true,
					    showDropdowns: true,
					   	minDate: moment(),
					    startDate:moment(start_url),
					    dateFormat: 'dd-mm-yyyy',
					  }, function(start, end, label) {
						startdate=start.format('YYYY-MM-DD');
				  });
				type_url_arr=type_url.split('|')
				$('.filter1').each(function(i,d){
					if ($.inArray(d.id, type_url_arr)>-1) {
						$(this).prop("checked",true);
					}
					else{
						$(this).prop("checked",false);
					}
				})
				startdate=moment(start_url).format('YYYY-MM-DD')
				result=data;

				if(data['response'].length>0){
					$('#noresults').hide();
					$('.optional-filter').show();		
				}
				else{
					$('#noresults').show();
					$('.optional-filter').hide();
				}
				data['response'].map(function(d){
					putResults(d);
				});	
				paginate(data)
            }
        });
	}
}