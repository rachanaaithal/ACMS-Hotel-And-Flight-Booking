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


function initPage(transaction_id, gst, cancellation_charges){

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
        
        
        if(data.status=='bk'){
            const cost=data.price
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
            
            today= moment();
            if(moment(data.from_date)>today){
                var tr=$('<tr/>')
                tr.append(`<td><button id="cancel" class="btn btn-danger" data-toggle="modal" data-target="#cancellation">Cancel Booking</button></td><td><button id="download" class="btn btn-primary">Download</button></td>`)
                tr.appendTo('#finalprices')
            }

            cancellation_cost=cancellation_charges*tot/100;
            var modal=$('<div/>')
            modal.addClass('modal fade')
            modal.attr('id', 'cancellation')
            modal.attr('role', 'dialog')
            modal.append(`<div class="modal-dialog"><div class="modal-content"><div class="modal-header">
                <h4 class="modal-title"><p>Booking Cancellation</p></h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">Cancellation charges: ${cancellation_cost}</div>
                <div class="modal-footer"><button type="button" class="btn btn-danger" id="confirm_cancel" data-dismiss="modal">Confirm</button></div>
                </div></div>`)
            modal.appendTo('#price')

            var csrftoken = readCookie('csrftoken');
            $('#confirm_cancel').click(function(e){
                $.ajax({
                    type: "PATCH",
                    url:`/api/roomavailability/${transaction_id}/`,
                    data:{'status':'dd'},
                    headers:{"X-CSRFToken": csrftoken},
                    success:function(newdata){
                        window.location.href=`/hotel/bookingdetails/${transaction_id}`
                    }
                });
            });
             $('#download').click(function (e) {
            var pdf = new jsPDF('p','pt','a4');
            $("#download").attr("style", "display:none");
            $("#cancel").attr("style", "display:none");
            pdf.addHTML(document.body,function() {
                pdf.save('Flight-ticket.pdf');
                $("#download").attr("style", "display");
                $("#cancel").attr("style", "display");
            });
        });

        }
        else if(data.status=='dd'){
            details.append(`<p>Booking was cancelled.<\p>`)
        }
        details.appendTo('#details');
    }


    $.ajax({
        url:`/api/roomavailability/?id=${transaction_id}`,
        cache: false,
        success: function(data){
            putAboutData(data[0])
        },

    });
}