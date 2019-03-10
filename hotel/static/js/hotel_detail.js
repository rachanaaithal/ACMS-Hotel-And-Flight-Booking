function initPage(id){
    console.log(id);
    function putAboutData(data){
        var img=$('<div/>')
        img.append(`<img src=${data.image_link}>`);
        img.appendTo('#about');
        var details=$('<div/>');
        details.append(`<h5>${data.name}</h5>`);
        details.append(`<p>Address:${data.address}</p>`);
        details.append(`<p>CheckinTime:${data.checkintime}</p>`);
        details.append(`<p>CheckoutBefore:${data.checkintime}-${data.extratime}</p>`);
        details.appendTo('#about');
        console.log(`${data.checkintime}-${data.extratime}`)
    }
    function putTable(){
        var table=$('<table/>')
        table.attr('id','pricestable')
        table.addClass('table table-hover')
        var thead=$('<thead/>')
        var tr=$('<tr/>')
        tr.append(`<th scope="col">RoomType</th><th scope="col">Price</th>`)
        thead.append(tr)
        table.append(thead)
        var body=$('<tbody/>')
        body.attr('id','prices-tab-bod')
        table.append(body)
        table.appendTo("#prices")
    }

    function putPricesData(d){
        var tr=$('<tr/>')
        tr.append(`<th scope="row">${d.category}</td><td>${d.price}</td>`)
        tr.appendTo('#prices-tab-bod')
    }

    $.ajax({
        url: `/api/hotels/${id}`,
        cache: false,
        success: function(data){
            console.log(data);
            putAboutData(data);
        },
        error: function(error){
            console.log(error);
        }
    });
    $.ajax({
        url: `/api/priceperroomtype/`,
        cache: false,
        success: function(data){
            console.log(data);
            putTable();
            data.map(function (d){
                putPricesData(d);
            });
            
        },
        error: function(error){
            console.log(error);
        }
    });
}
