function initPage(id){
    function putAboutData(data){
        
        var details=$('<div/>');
        $('#name').append(`<h2>${data.name}</h2>`);
        details.append(`<p><i class="fas fa-map-marked fa-2x"></i>${data.address}</p>`); 

        const checkIn  = data.checkintime;
        const cleaningTime = data.extratime;
        const checkOut = moment.utc(moment(checkIn,"HH:mm:ss").diff(moment(cleaningTime,"HH:mm:ss"))).format('hh:mm A');

        details.append(`<p>CheckinTime:${moment(checkIn, "HH:mm:ss").format('hh:mm A')}</p>`);
        details.append(`<p>CheckoutBefore:${checkOut}</p>`);
        details.appendTo('#data');
        
    }
    function putTable(){
        var table=$('<table/>')
        table.attr('id','pricestable')
        table.addClass('table table-hover')
        var thead=$('<thead/>')
        var tr=$('<tr/>')
        tr.append(`<th scope="col">RoomType</th><th scope="col">Price</th><th></th>`)
        thead.append(tr)
        table.append(thead)
        var body=$('<tbody/>')
        body.attr('id','prices-tab-bod')
        table.append(body)
        table.appendTo("#prices")
    }

    
    var url = new URL(window.location.href);
    var fromdate = url.searchParams.get("fromdate");
    var todate = url.searchParams.get("todate");


    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    
    var csrftoken = readCookie('csrftoken');
    function putPricesData(d){
        
        $.ajax({
            url: `/api/roomtype/${d.category}`,
            cache: false,
            success: function( data){
                roomtype=data.name;

                $.ajax({
                    url:`/api/prices/?name=${id}&category=${d.category}&start=${fromdate}&end=${todate}`,
                    cache: false,
                    success: function(price){




                        var tr=$('<tr/>')
                        tr.append(`<th scope="row">${data.name}</td>`)
                        tr.append(`<td>${price.price}</td><td><button id="category-${d.category}" class="btn btn-primary process">Book</button></td>`)
                        tr.appendTo('#prices-tab-bod')

                        $(`#category-${d.category}`).click(function(e){
                            

                            $.ajax({
                                url: `/api/check/?name=${id}&category=${d.category}&start=${fromdate}&end=${todate}`,
                                cache: false,
                                success: function(data){
                                    if(data.val){
                                        $.ajax({
                                            type: "POST",
                                            url: `/api/roomavailability/`,
                                            data:{'from_date': fromdate, 'to_date': todate, 'room':data.id, 'status': 'pr', 'price': price.price},
                                            headers:{"X-CSRFToken": csrftoken},
                                            success:function(newdata){
                                                window.location.href=`/hotel/`+id+`/${d.category}/?id=${newdata.id}`;
                                            }
                                        });
                                    
            
                                    }
                                },
                                error: function(error){
                                }
                            });



                            return false;
                        });


                    },
                    error: function(error){
                    }
                });







            }
        });
        

    }

    

    var id;
    $.ajax({
        url: `/api/hotels/${id}`,
        cache: false,
        success: function(data){
            id=`${data.id}`;
            putAboutData(data);


            var mymap = L.map('map').setView([12.894441,77.5685569], 13);
            L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
	            attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
	            minZoom: 1,
            	maxZoom: 19
            }).addTo(mymap);
            var marker = L.marker([data.latitude, data.longitude]).addTo(mymap);

        },
        error: function(error){
        }
    });
    $.ajax({
        url: `/api/hotelroom/?hotel=${id}`,
        cache: false,
        success: function(data){
            putTable();
            data.map(function (d){
                putPricesData(d);
            });
            
        },
        error: function(error){
        }
    });

    function putImage(d){
        $(`<li data-target="#carouselHotelIndicators" data-slide-to="${d.id-1}"></li>`).appendTo('.carousel-indicators')
        $(`<div class="carousel-item"><img class="d-block w-100" src="${d.image_link}" alt="${d.id-1}"></div>`).appendTo('.carousel-inner')
    }

    $.ajax({
        url:`/api/hotelphotos/?hotel=${id}`,
        cache: false,
        success: function(data){
            data.map(function(d){
                putImage(d);
            });
            $('.carousel-item').first().addClass('active');
            $('.carousel-indicators > li').first().addClass('active');
        },
        error: function(error){
        }
    })

}
