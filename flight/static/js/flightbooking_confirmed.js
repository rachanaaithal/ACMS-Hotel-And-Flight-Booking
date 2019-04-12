function initPage(flight_id, category, transaction_id, gst){
    console.log(flight_id, category, transaction_id, gst);

//    var gst=5;

    function putAboutData(data){
        var details=$('<div/>');
        details.append(`<p>${data.airline}</p>`); 

        details.append(`<p><i class="fas fa-map-marked fa-2x"></i>${data.source}</p>`); 
        details.append(`<p><i class="fas fa-map-marked fa-2x"></i>${data.destination}</p>`); 
        details.append(`<p>Seat Type:${data.category}</p>`);

        const landing_time  = data.landing_time;
        const takeoff_time = data.takeoff_time;
        let date = JSON.stringify(data.on_date);
        date = date.slice(1,11);
        
        details.append(`<p>TakeoffTime: ${date} ${moment(takeoff_time, "HH:mm").format('hh:mm A')}</p>`);
        details.append(`<p>LandingTime: ${date} ${moment(landing_time, "HH:mm").format('hh:mm A')}</p>`);
        details.appendTo('#details');

        const tax=data.price*gst/100;
            
        const tot=tax+parseFloat(data.price);
        var pay=$('<div/>');
        var table=$('<table/>')
        table.attr('id','pricestable')
        table.addClass('table')
        var body=$('<tbody/>')
        body.attr('id','finalprices')
        table.append(body)
        table.appendTo(pay)
        pay.appendTo('#price');
        var tr=$('<tr/>')
        tr.append(`<th scope="row">Base Price</td><td>${data.price}</td>`);
        tr.appendTo('#finalprices')
        var tr=$('<tr/>')
        tr.append(`<th scope="row">Tax</td><td>${tax.toFixed(2)}</td>`);
        tr.appendTo('#finalprices')
        var tr=$('<tr/>')
        tr.append(`<th scope="row">Total</td><td>${tot.toFixed(2)}</td>`);
        tr.appendTo('#finalprices')

    }


    $.ajax({
        url: `/api/seat_availability/?id=${transaction_id}`,
        cache: false,
        success: function(data){
            console.log(data);
            id=`${data.id}`;
            putAboutData(data[0]);
        },
        error: function(error){
            console.log(error);
        }
    });

}