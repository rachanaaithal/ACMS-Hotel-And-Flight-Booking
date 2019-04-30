window.onload = function () {
	var url = new URL(window.location.href);
    var start_url= url.searchParams.get("start");
	var end_url = url.searchParams.get("end");
	var name_url = url.searchParams.get("name");
	var type_url = url.searchParams.get("type");
	var min_url =url.searchParams.get("minprice");
	var max_url =url.searchParams.get("maxprice");
	var page_url = url.searchParams.get("page");
	
	
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
		var nextend_url = nexturl.searchParams.get("end");
		var nextname_url = nexturl.searchParams.get("name");
		var nexttype_url = nexturl.searchParams.get("type");
		var nextmin_url = nexturl.searchParams.get("minprice");
		var nextmax_url = nexturl.searchParams.get("maxprice");
		$(`.pagination`).html('')
		var span=$('<span/>')
		span.addClass('page-links')
		if(!data['has_prev']){
			span.append(`<a id="prev_link" class="btn btn-primary disabled" href="/hotel/?name=${nextname_url}&start=${nextstart_url}&end=${nextend_url}&type=${nexttype_url}&minprice=${nextmin_url}&maxprice=${nextmax_url}&page=${data['prev_page']}">previous</a>`)
		}else{
			span.append(`<a id="prev_link" class="btn btn-primary" href="/hotel/?name=${nextname_url}&start=${nextstart_url}&end=${nextend_url}&type=${nexttype_url}&minprice=${nextmin_url}&maxprice=${nextmax_url}&page=${data['prev_page']}">previous</a>`)
		
		}
		if(!data['has_next']){
			span.append(`<a id="next_link" class="btn btn-primary disabled" href="/hotel/?name=${nextname_url}&start=${nextstart_url}&end=${nextend_url}&type=${nexttype_url}&minprice=${nextmin_url}&maxprice=${nextmax_url}&page=${data['next_page']}">next</a>`);
		
		}
		else{
			span.append(`<a id="next_link" class="btn btn-primary" href="/hotel/?name=${nextname_url}&start=${nextstart_url}&end=${nextend_url}&type=${nexttype_url}&minprice=${nextmin_url}&maxprice=${nextmax_url}&page=${data['next_page']}">next</a>`);
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
		opens: 'right',
		startDate: moment(),
		endDate: moment().add(1,'days'),
		minDate: moment(),
		dateFormat: 'dd-mm-yyyy',
	}, function (start, end, label) {
		fromdate=start.format('YYYY-MM-DD');
		todate=end.format('YYYY-MM-DD');
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
				let clicked = [];
				$('.filter1').each(function(i,d){
					if ($(this).is(':checked')) {
						clicked.push($(this).val());
					}
				})

				$('#results').html('');
				nexturl="/hotel/"+"?name="+name_url+"&start="+start_url+"&end="+end_url+"&type="+clicked.join('|')+"&minprice="+min_url+"&maxprice="+max_url
				history.pushState({}, null, nexturl);
				priceRefresh(clicked);
				//psedoRefresh(nexturl)
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
			url:`/api/maxroomprice/?name=${name_url}&type=${type_to_use}`,
			cache: false,
			success: function(data){
				max_price=data.price
				$.ajax({
					url:`/api/minroomprice/?name=${name_url}&type=${type_to_use}`,
					cache: false,
					success: function(data){
						min_price=data.price
						if(!(max_url=='null' || max_url=='undefined') && (min_url=='null' || min_url=='undefined')){
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
								nexturl="/hotel/"+"?name="+name_url+"&start="+start_url+"&end="+end_url+"&type="+type_to_use+"&minprice="+ui.values[ 0 ]+"&maxprice="+ui.values[ 1 ]
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
	
	//dates
	var fromdate=moment().format('YYYY-MM-DD');
	var todate=moment().add(1,'days').format('YYYY-MM-DD');
	


	var result;

	//to append results in the body in bootstrap card format
	function putResults(d){
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
		window.location.href="/hotel/"+"?name="+cityVal+"&start="+fromdate+"&end="+todate+"&type="+clicked.join('|')+"&minprice="+min_price+"&maxprice="+max_price
	});

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
	if(start_url!=null & end_url!=null & name_url!=null){
		$.ajax({
            url: "/api/search/?name="+name_url+"&start="+start_url+"&end="+end_url+"&type="+type_url+"&minprice="+min_url+"&maxprice="+max_url+"&page="+page_url,
            cache: false,
            success: function(data){
				$('#typeahead').val(name_url)
				$('input[name="daterange"]').daterangepicker({
					opens: 'right',
					startDate: moment(start_url), 
					endDate: moment(end_url),
					minDate: moment(),
					dateFormat: 'dd-mm-yyyy',
				}, function (start, end, label) {
					fromdate=start.format('YYYY-MM-DD');
					todate=end.format('YYYY-MM-DD');
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
				

				fromdate=moment(start_url).format('YYYY-MM-DD')
				todate=moment(end_url).format('YYYY-MM-DD')
				result=data;
				//$('#results').html('');

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
