function initPage(id){
    console.log(id);
    function putAboutData(data){
        var img=$('<div/>')
        img.append(`<img src=${data.image_link}>`);
        img.appendTo('#about');
        var details=$('<div/>');
        details.append(`<h5>${data.name}</h5>`);
        details.append(`<p><i class="fas fa-map-marked fa-2x"></i>${data.address}</p>`); 

        const checkIn  = data.checkintime;
        const cleaningTime = data.extratime;
        const checkOut = moment.utc(moment(checkIn,"HH:mm:ss").diff(moment(cleaningTime,"HH:mm:ss"))).format('hh:mm A');

        details.append(`<p>CheckinTime:${moment(checkIn, "HH:mm:ss").format('hh:mm A')}</p>`);
        details.append(`<p>CheckoutBefore:${checkOut}</p>`);
        details.appendTo('#about');
        console.log(`${data.checkintime}-${data.extratime}`)
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

    function putPricesData(d){
        
        $.ajax({
            url: `/api/roomtype/${d.category}`,
            cache: false,
            success: function( data){
                roomtype=data.name;
                var tr=$('<tr/>')
                tr.append(`<th scope="row">${data.name}</td>`)
                tr.append(`<td>${d.price}</td><td><button id="category-${d.category}" class="btn btn-primary process">Book</button></td>`)
                tr.appendTo('#prices-tab-bod')

                $(`#category-${d.category}`).click(function(e){
                    console.log(fromdate,todate)

                    $.ajax({
                        url: `/api/check/?name=${id}&category=${d.category}&start=${fromdate}&end=${todate}`,
                        cache: false,
                        success: function(data){
                            if(data){
                                window.location.href=`/hotel/`+id+`/${d.category}/?fromdate=${fromdate}&todate=${todate}`;    
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
        url: `/api/hotels/${id}`,
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
        url: `/api/hotelroom/?hotel=${id}`,
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
