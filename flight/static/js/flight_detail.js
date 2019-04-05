function initPage(id){
    console.log(id);
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
        tr.append(`<th scope="col">SeatType</th><th scope="col">Price</th><th></th>`)
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
//    var csrftoken = $('[name="csrftoken"]').attr('value');
    console.log(csrftoken)
    function putPricesData(d){
        
        $.ajax({
            url: `/api/seattype/${d.category}`,
            cache: false,
            success: function( data){
                seattype=data.name;
                var tr=$('<tr/>')
                tr.append(`<th scope="row">${data.name}</td>`)
                tr.append(`<td>${d.price}</td><td><button id="category-${d.category}" class="btn btn-primary process">Book</button></td>`)
                tr.appendTo('#prices-tab-bod')
                console.log(fromdate)
                $(`#category-${d.category}`).click(function(e){
                    $.ajax({
                        url: `/api/cflightstatus/?flightid=${id}&category=${d.category}&start=${fromdate}&source=${source}&destination=${dest}`,
                        cache: false,
                        success: function(data){
                            console.log(data.id);
                            console.log(fromdate,source, dest);
                            if(data.val){
                                $.ajax({
                                    type: "POST",
                                    url: `/api/seat_availability/`,
                                    data:{'on_date': fromdate ,'seat':data.id, 'status': 'pr'},
                                    headers:{"X-CSRFToken": csrftoken},
                                    success:function(newdata){
                                        console.log(newdata);
                                        window.location.href=`/flight/`+id+`/${d.category}/?id=${newdata.id}`;
                                    }
                                });
                            
    
                            }
                        },
                        error: function(error){
                            console.log(error);
                        }
                    });



                    return false;
                });

            }
        });
        

    }

    

    var id;
    $.ajax({
        url: `/api/flights/${id}`,
        cache: false,
        success: function(data){
            console.log(data);
            id=`${data.id}`;
            putAboutData(data);
        },
        error: function(error){
            console.log(error);
        }
    });
    $.ajax({
        url: `/api/flight_seats/?flight=${id}`,
        cache: false,
        success: function(data){
            console.log(data);
            putTable();
            data.map(function (d){
                putPricesData(d);
            });
            
        },
        error: function(error){
            console.log(error);
        }
    });

}