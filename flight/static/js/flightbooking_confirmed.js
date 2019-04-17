function initPage(flight_id, category, transaction_id, gst){
    console.log(flight_id, category, transaction_id, gst);

//    var gst=5;

    function putAboutData(data){
        var details=$('<div/>');
        details.attr('id', 'content');
        details.append(`<p><b>Airline: ${data.airline}</b></p>`); 
        details.append(`<p><i class="fas fa-map-marked fa-2x"></i><b> Source: </b>${data.source}</p>`); 
        details.append(`<p><i class="fas fa-map-marked fa-2x"></i><b> Destination: </b>${data.destination}</p>`); 
        details.append(`<p><b>Seat Type: </b>${data.category}</p>`);
        details.append(`<p><b>Seat Number: ${data.seat}</b></p>`); 

        const landing_time  = data.landing_time;
        const takeoff_time = data.takeoff_time;
        let date = JSON.stringify(data.on_date);
        date = date.slice(1,11);
        
        details.append(`<p><b>TakeoffTime: </b>${date} ${moment(takeoff_time, "HH:mm").format('hh:mm A')}</p>`);
        details.append(`<p><b>LandingTime: </b>${date} ${moment(landing_time, "HH:mm").format('hh:mm A')}</p>`);
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
        var extra=$('<div/>')
        extra.attr('id', 'editor');
        extra.appendTo(body)
        var print=$('<div/>')
        print.append(`<td><button id="Ticket" class="btn btn-danger" style="display">Download Ticket</button>`)
        print.appendTo(body)

        $('#Ticket').click(function (e) {
            var pdf = new jsPDF('p','pt','a4');
            $("#Ticket").attr("style", "display:none");
            pdf.addHTML(document.body,function() {
            pdf.save('Flight-ticket.pdf');
            $("#Ticket").attr("style", "display");
            });
        });
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