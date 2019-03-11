function initPage(id, category){
    console.log(id, category);

    function putAboutData(data){
        $.ajax({
            url: `/api/roomtype/${category}`,
            cache: false,
            success: function( d){
                var details=$('<div/>');
                details.append(`<h5>${data.name}</h5>`);
                details.append(`<p>Address: ${data.address}</p>`); 
                details.append(`<p>Room Type:${d.name}</p>`);

                const checkIn  = data.checkintime;
                const cleaningTime = data.extratime;
                const checkOut = moment.utc(moment(checkIn,"HH:mm:ss").diff(moment(cleaningTime,"HH:mm:ss"))).format('hh:mm A');

                details.append(`<p>CheckinTime: ${moment(checkIn, "HH:mm:ss").format('hh:mm A')}</p>`);
                details.append(`<p>CheckoutBefore: ${checkOut}</p>`);
                
                details.appendTo('#details');
                
                
            },
            error: function(error){
                console.log(error);
            }
        });
    }

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

    var gst=5;
    $.ajax({
        url: `/api/priceperroomtype/?hotel=${id}&category=${category}`,
        cache: false,
        success: function(data){
            const tax=data[0].price*gst/100;
            
            const tot=tax+parseFloat(data[0].price);
            var pay=$('<div/>');
            var table=$('<table/>')
            table.attr('id','pricestable')
            table.addClass('table')
            var body=$('<tbody/>')
            body.attr('id','finalprices')
            table.append(body)
            table.appendTo(pay)
            pay.appendTo('#details');
            var tr=$('<tr/>')
            tr.append(`<th scope="row">Base Price</td><td>${data[0].price}</td>`);
            tr.appendTo('#finalprices')
            var tr=$('<tr/>')
            tr.append(`<th scope="row">Tax</td><td>${tax.toFixed(2)}</td>`);
            tr.appendTo('#finalprices')
            var tr=$('<tr/>')
            tr.append(`<th scope="row">Total</td><td>${tot.toFixed(2)}</td>`);
            tr.appendTo('#finalprices')
            var tr=$('<tr/>')
            tr.append(`<td><a href='#' class="btn btn-danger">Cancel</a></td><td><a href='#' class="btn btn-primary">Pay</a></td>`)
            tr.appendTo('#finalprices')
        },
        error: function(error){
            console.log(error);
        }
    });

}