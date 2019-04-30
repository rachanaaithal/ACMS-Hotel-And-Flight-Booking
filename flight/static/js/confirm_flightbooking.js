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

function initPage(flight_id, category){
    

    var url = new URL(window.location.href);
    var transaction_id = url.searchParams.get("id");
    var gst=5;

    function putAboutData(data){

    window.history.pushState(null, "", window.location.href);        
        window.onpopstate = function() {
            alert("Please do not press back button during transaction!");
            window.history.pushState(null, "", window.location.href);
        };

        var details=$('<div/>');
        details.append(`<h5>${data.airline}</h5>`);
        details.append(`<p>SeatType:${data.category}</p>`);
        details.append(`<p><i class="fas fa-map-marked fa-2x"></i>${data.source}</p>`); 
        details.append(`<p><i class="fas fa-map-marked fa-2x"></i>${data.destination}</p>`); 

        const landingtime  = data.landing_time;
        const takeofftime = data.takeoff_time;
        let date = JSON.stringify(data.on_date);
        date = date.slice(1,11);
        
        details.append(`<p>TakeoffTime: ${date} ${moment(takeofftime, "HH:mm").format('hh:mm A')}</p>`);
        details.append(`<p>LandingTime: ${date} ${moment(landingtime, "HH:mm").format('hh:mm A')}</p>`);
        
        details.appendTo('#details');
        const cost=data.price;
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
        var tr=$('<tr/>')
        tr.append(`<td><button id="cancel" class="btn btn-danger">Cancel</button></td><td><button id="pay" class="btn btn-primary">Pay</button></td>`)
        tr.appendTo('#finalprices')  

        clicked=["Economy", "Business", "First Class"]
        function redirect(){
        window.location.href = "/flight/"+"?source="+data.source+"&destination="+data.destination+"&start="+data.on_dat+"&type="+clicked.join('|')
        }

        setTimeout(redirect, 60000); 


        var csrftoken = readCookie('csrftoken');
        $('#pay').click(function(e){
            $.ajax({
                type: "PATCH",
                url:`/api/seat_availability/${transaction_id}/`,
                data:{'status':'bk'},
                headers:{"X-CSRFToken": csrftoken},
                success:function(newdata){
                    $.ajax({
                        url:`/api/flightmail_confirmations/?id=${transaction_id}&total=${tot.toFixed(2)}`,
                        cache: false,
                        success: function(data){
                            window.location.href=`/flight/${flight_id}/${category}/booked/${transaction_id}`
                        },
                        error: function(error){
                        }
                    })
                }
            });

        });

        $('#cancel').click(function(e){
            $.ajax({
                type: "PATCH",
                url:`/api/seat_availability/${transaction_id}/`,
                data:{'status':'dd'},
                headers:{"X-CSRFToken": csrftoken},
                success:function(newdata){
                    window.location.href=`/flight/${flight_id}/${category}/canceled`
                }
            });

        });
    }


    $.ajax({
        url: `/api/seat_availability/?id=${transaction_id}`,
        cache: false,
        success: function(data){
            if(data[0].status=='pr'){
                putAboutData(data[0]);
            }
            else if(data[0].status=='bk'){
                window.location.href=`/flights/${flight_id}/${category}/booked/${data[0].id}`;
            }
            else if(data[0].status=='dd'){
                window.location.href=`/flights/${flight_id}/${category}/canceled`;
            }
        },
        error: function(error){
        }
    });

}