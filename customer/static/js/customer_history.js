window.onload=function(){
    function putTable(id){
        var table=$('<table/>')
        table.append(`<caption>${id}</caption>`)
        table.attr('id',id)
        table.addClass('table table-hover')
        var thead=$('<thead/>')
        var tr=$('<tr/>')
        tr.append(`<th scope="col">Hotel</th><th scope="col">FromDate</th><th scope="col">ToDate</th><th scope="col">Price</th><th scope="col">Status</th>`)
        thead.append(tr)
        table.append(thead)
        var body=$('<tbody/>')
        table.append(body)
        table.appendTo(`#${id}`)
        $(`#${id}`).hide()
    }

    function putData(id,d){
        var tr=$('<tr/>')
        tr.append(`<th scope="row">${d.hotel}(${d.category})</td>`)
        tr.append(`<td>${d.from_date}</td><td>${d.to_date}</td><td>${d.price}</td>`)
        tr.append(`<td>${d.status_name}</td>`)
        tr.addClass('clickable-row')
        tr.attr('id',`${d.id}`);
        tr.appendTo(`#${id} >tbody`)
    }

    $.ajax({
        url:"/api/roomavailability/",
        cache: false,
        success: function(data){
            console.log(data);
            today= moment();
            console.log(today);
            putTable('future-bookings');
            putTable('past-bookings');
            
            //console.log($('#future-bookings >tbody >tr').length, $('#past-bookings >tbody >tr').length);
            data.map(function(d){
                if(moment(d.from_date)>today){
                    if($('#future-bookings >tbody >tr').length==0){
                        $('#future-bookings').show();
                    }
                    putData('future-bookings',d);
                    console.log(d.from_date);
                }
                else{
                    if($('#past-bookings >tbody >tr').length==0){
                        $('#past-bookings').show();
                    }
                    putData('past-bookings',d);
                    
                }
            });
            $(".clickable-row").click(function(e) {
                console.log(e.currentTarget.id);
                window.location.href=`/hotel/bookingdetails/${e.currentTarget.id}`;
            });
        },
        error: function(error){
            console.log(error);
        }
    });
}