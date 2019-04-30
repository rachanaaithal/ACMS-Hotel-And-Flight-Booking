function initPage(id){

    function putAboutData(data){
        var img=$('<div/>')
        img.append(`<img src=${data.image_link}>`);
        img.appendTo('#about');
        var details=$('<div/>');
        details.append(`<h5>${data.airline_name}</h5>`);
        details.append(`<p><i class="fas fa-map-marked fa-2x"></i>${data.source}</p>`); 
        details.append(`<p><i class="fas fa-map-marked fa-2x"></i>${data.destination}</p>`); 
        const landing_time  = data.landing_time;
        const takeoff_time = data.takeoff_time;

        details.append(`<p>TakeoffTime:${moment(takeoff_time, "HH:mm").format('hh:mm A')}</p>`);
        details.append(`<p>LandingTime:${moment(landing_time, "HH:mm").format('hh:mm A')}</p>`);
        details.appendTo('#about');
    }
    function putTable(){
        var table=$('<table/>')
        table.attr('id','pricestable')
        table.addClass('table table-hover')
        var thead=$('<thead/>')
        var tr=$('<tr/>')
        tr.append(`<th scope="col">SeatType</th><th scope="col">Category</th><th scope="col">Price</th><th></th>`)
        thead.append(tr)
        table.append(thead)
        var body=$('<tbody/>')
        body.attr('id','prices-tab-bod')
        table.append(body)
        table.appendTo("#prices")
    }

    
    var url = new URL(window.location.href);
    var fromdate = url.searchParams.get("startdate");
    var source = url.searchParams.get("source");
    var dest=url.searchParams.get("destination");

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
            url: `/api/seattype/${d[0].category}`,
            cache: false,
            success: function( data){
                seattype=data.name;
                d.map(function (da){
                    $.ajax({
                        url:`/api/flightcharges/?flightid=${id}&category=${da.category}&start=${fromdate}&source=${source}&destination=${dest}`,
                        cache: false,
                        success: function(price){
                            var tr=$('<tr/>')
                            if(da.seat_position=="a")
                                tr.append(`<th scope="row">Aisle</td>`)
                            if(da.seat_position=="m")
                                tr.append(`<th scope="row">Middle</td>`)
                            if(da.seat_position=="w")
                                tr.append(`<th scope="row">Window</td>`)
                            if(da.seat_position=="p")
                                tr.append(`<th scope="row">Private</td>`)
                            if(da.seat_position=="h")
                                tr.append(`<th scope="row">Hemmingway</td>`)
                            tr.append(`<th scope="row">${data.name}</td>`)

                            tr.append(`<td>${price.price}</td><td><button id="seatid-${da.id}" class="btn btn-primary process">Book</button></td>`)
                            tr.appendTo('#prices-tab-bod')
                            $(`#seatid-${da.id}`).click(function(e){
                                $.ajax({
                                    url: `/api/cflightstatus/?seat_id=${da.id}&flightid=${id}&category=${da.category}&start=${fromdate}&source=${source}&destination=${dest}`,
                                    cache: false,
                                    success: function(data){
                                        if(data.val){
                                            $.ajax({
                                                type: "POST",
                                                url: `/api/seat_availability/`,
                                                data:{'on_date': fromdate ,'seat':data.id, 'status': 'pr', 'price':price.price},
                                                headers:{"X-CSRFToken": csrftoken},
                                                success:function(newdata){
                                                    url=`/flight/`+id+`/${d[0].category}/?id=${newdata.id}`;
                                                    window.location.replace(url);
                                                    return (false);
                                                }
                                            });
                                        
                
                                        }
                                        else{
                                            var m=$('<tr/>');
                                            m.attr('id', 'alreadybooked');
                                            m.append(`This Seat has already been booked.`);
                                            if($("#prices-tab-bod").find("#alreadybooked").length==0){
                                                m.appendTo('#prices-tab-bod');
                                            }
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
                });
            }
        

        });
    }

  
    var id;
    $.ajax({
        url: `/api/flights/${id}`,
        cache: false,
        success: function(data){
            id=`${data.id}`;
            putAboutData(data);
        },
        error: function(error){
        }
    });
    $.ajax({
        url: `/api/flight_seats/?flight=${id}`,
        cache: false,
        success: function(data){
            putTable();
            putPricesData(data);
        },
        error: function(error){
        }
    });

}