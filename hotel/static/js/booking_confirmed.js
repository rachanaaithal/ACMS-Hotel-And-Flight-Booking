function initPage(hotel_id, category, transaction_id, gst){

//    var gst=5;

    function putAboutData(data){
        var details=$('<div/>');
        details.append(`<h5>${data.hotel}</h5>`);
        details.append(`<p>Address: ${data.address}</p>`); 
        details.append(`<p>Room Type:${data.category}</p>`);

        const checkIn  = data.checkintime;
        const cleaningTime = data.extratime;
        const checkOut = moment.utc(moment(checkIn,"HH:mm:ss").diff(moment(cleaningTime,"HH:mm:ss"))).format('hh:mm A');

        details.append(`<p>Checkin: ${moment(data.from_date).format('DD-MM-YYYY')} ${moment(checkIn, "HH:mm:ss").format('hh:mm A')}</p>`);
        details.append(`<p>CheckoutBefore: ${moment(data.to_date).format('DD-MM-YYYY')} ${checkOut}</p>`);
        
        details.appendTo('#details');

        const days= Math.max(moment(data.to_date).diff(moment(data.from_date), "days"),1);
        const cost=data.price*days;
        const tax=cost*gst/100;
            
        const tot=tax+parseFloat(cost);
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
        tr.append(`<th scope="row">Base Price</td><td>${cost}</td>`);
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
        url: `/api/roomavailability/?id=${transaction_id}`,
        cache: false,
        success: function(data){
            id=`${data.id}`;
            putAboutData(data[0]);
        },
        error: function(error){
        }
    });

}