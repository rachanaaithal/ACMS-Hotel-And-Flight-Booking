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
        details.append(`<p><b> Airline: </b>${data.airline}</p>`); 
        details.append(`<p><i class="fas fa-map-marked fa-2x"></i><b> Source: </b>${data.source}</p>`); 
        details.append(`<p><i class="fas fa-map-marked fa-2x"></i><b> Destination: </b>${data.destination}</p>`); 
        details.append(`<p><b>Seat Type:  </b>${data.category}</p>`);
        details.append(`<p><b> Seat Number: </b>${data.seat}</p>`);

        const landing_time  = data.landing_time;
        const takeoff_time = data.takeoff_time;
        let date = JSON.stringify(data.on_date);
        date = date.slice(1,11);
        
        details.append(`<p><b>TakeoffTime: </b>${date} ${moment(takeoff_time, "HH:mm").format('hh:mm A')}</p>`);
        details.append(`<p><b>LandingTime: </b>${date} ${moment(landing_time, "HH:mm").format('hh:mm A')}</p>`);
        
        if(data.status=='bk'){
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
            
            today= moment();
            if(moment(data.on_date)>today){
                var tr=$('<tr/>')
                tr.append(`<td><button id="cancel" class="btn btn-danger" data-toggle="modal" data-target="#cancellation">Cancel Booking</button></td><td><button id="download" class="btn btn-primary" style="display">Download</button></td>`)
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
                    url:`/api/seat_availability/${transaction_id}/`,
                    data:{'status':'dd'},
                    headers:{"X-CSRFToken": csrftoken},
                    success:function(newdata){
                        window.location.href=`/flight/bookingdetails/${transaction_id}`
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
        url:`/api/seat_availability/?id=${transaction_id}`,
        cache: false,
        success: function(data){
            putAboutData(data[0])
        },

    });
}