window.onload=function(){
    checkdate=moment().format('YYYY-MM-DD');
    $(function() {
        $('input[name="date"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            opens: 'right',
    		startDate: moment(),
        }, 
        function(start, end, label) {
            checkdate=start.format('YYYY-MM-DD');
        });
    });


    function putResults(d){
        var div = $('<div/>');
        div.addClass('card');
        var body = $('<div/>');
        body.addClass('card-body');
        body.attr('id',`${d.category}`)
        body.append(`<h4 class="card-title" display="inline">${d.category}</h4><p>${d.booked.length}/${d.total}</p>`)
        if(d.booked.length>0){
            var table=$('<table/>')
            table.attr('id','category')
            table.addClass('table table-hover')
            var thead=$('<thead/>')
            var tr=$('<tr/>')
            tr.append(`<th scope="col">Name</th><th scope="col">From Date</th><th scope="col">To Date</th><th>Price</th>`)
            thead.append(tr)
            table.append(thead)
            var tbody=$('<tbody/>')
            tbody.attr('id',`${d.category}-bod`)
            table.append(tbody)
            table.appendTo(body)
            d.booked.map(function(row){
                var tr=$('<tr/>')
                tr.append(`<th scope="row">${row.booked_by__first_name}</td>`)
                tr.append(`<td>${row.from_date}</td><td>${row.to_date}</td><td>${row.price}</td>`)
                tr.appendTo(tbody)
            });
        }
        body.appendTo(div);
        div.appendTo("#bookings")
    }

    $("#check-button").click(function(e){
        $.ajax({
            url:`/api/customer/bookings/?date=${checkdate}`,
            cache: false,
            success: function(data){
                $(`#bookings`).html('');
                console.log(data);
                data.map(function(d){
                    putResults(d);
                });
            },
            error: function(error){
                console.log(error);
            }
        })
    });
}