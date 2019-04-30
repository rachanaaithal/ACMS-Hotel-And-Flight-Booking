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

function initPage(hotel_id, category){

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
        var tr=$('<tr/>')
        tr.append(`<td><button id="cancel" class="btn btn-danger">Cancel</button></td><td><button id="pay" class="btn btn-primary">Pay</button></td>`)
        tr.appendTo('#finalprices')  

        clicked=["AC", "Non-AC", ""]
        function redirect(){
        window.location.href = "/hotel/"
        }
        setTimeout(redirect, 60000); 

        var csrftoken = readCookie('csrftoken');
        $('#pay').click(function(e){
            $.ajax({
                type: "PATCH",
                url:`/api/roomavailability/${transaction_id}/`,
                data:{'status':'bk'},
                headers:{"X-CSRFToken": csrftoken},
                success:function(newdata){
                    $.ajax({
                        url:`/api/mail_confirmation/?id=${transaction_id}&total=${tot.toFixed(2)}`,
                        cache: false,
                        success: function(data){
                            window.location.href=`/hotel/${hotel_id}/${category}/booked/${transaction_id}`
                        },
                        error: function(error){
                        }
                    })
                    //window.location.href=`/hotel/${hotel_id}/${category}/booked/${transaction_id}`
                }
            });

        });

        $('#cancel').click(function(e){
            $.ajax({
                type: "PATCH",
                url:`/api/roomavailability/${transaction_id}/`,
                data:{'status':'dd'},
                headers:{"X-CSRFToken": csrftoken},
                success:function(newdata){
                    window.location.href=`/hotel/${hotel_id}/${category}/canceled`
                }
            });

        });
    }


    $.ajax({
        url: `/api/roomavailability/?id=${transaction_id}`,
        cache: false,
        success: function(data){
            if(data[0].status=='pr'){
                putAboutData(data[0]);
            }
            else if(data[0].status=='bk'){
                window.location.href=`/hotel/${hotel_id}/${category}/booked/${data[0].id}`;
            }
            else if(data[0].status=='dd'){
                window.location.href=`/hotel/${hotel_id}/${category}/canceled`;
            }
        },
        error: function(error){
        }
    });

}