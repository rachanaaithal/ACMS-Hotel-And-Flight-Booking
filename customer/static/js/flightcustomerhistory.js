window.onload=function(){
    function putTable(id){
        var table=$('<table/>')
        table.append(`<caption>${id}</caption>`)
        table.attr('id',id)
        table.addClass('table table-hover')
        var thead=$('<thead/>')
        var tr=$('<tr/>')
        tr.append(`<th scope="col">Flight</th><th scope="col">Source</th><th scope="col">Destination</th><th scope="col">On Date</th><th scope="col">Price</th><th scope="col">Status</th>`)
        thead.append(tr)
        table.append(thead)
        var body=$('<tbody/>')
        table.append(body)
        table.appendTo(`#${id}`)
        $(`#${id}`).hide()
    }

    function putData(id,d){
        var tr=$('<tr/>')
        tr.append(`<th scope="row">${d.airline}(${d.category})</td>`)
        tr.append(`<td>${d.source}</td><td>${d.destination}</td><td>${d.on_date}</td><td>${d.price}</td>`)
        if(d.status=='pr')
            tr.append(`<td>Processing</td>`)
        else if (d.status=="bk")
            tr.append(`<td>Booked</td>`)
        else
            tr.append(`<td>Dead</td>`)
        tr.addClass('clickable-row')
        tr.attr('id',`${d.id}`);
        tr.appendTo(`#${id} >tbody`)
    }

    $.ajax({
        url:"/api/seat_availability/",
        cache: false,
        success: function(data){
            today= moment();
            putTable('future-bookings');
            putTable('past-bookings');
            data.map(function(d){
                if(moment(d.on_date)>today){
                    if($('#future-bookings >tbody >tr').length==0){
                        $('#future-bookings').show();
                    }
                    putData('future-bookings',d);
                }
                else{
                    if($('#past-bookings >tbody >tr').length==0){
                        $('#past-bookings').show();
                    }
                    putData('past-bookings',d);
                    
                }
            });
            $(".clickable-row").click(function(e) {
                window.location.href=`/flight/bookingdetails/${e.currentTarget.id}`;
            });
        },
        error: function(error){
        }
    });
}