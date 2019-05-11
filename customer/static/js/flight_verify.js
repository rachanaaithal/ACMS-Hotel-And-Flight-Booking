window.onload=function(){
	
	var get = new XMLHttpRequest();
	get.onreadystatechange = function(){
	var data = JSON.parse(this.responseText);
	do1(data);
	}
	get.open("GET","/api/newflights");
	get.send(null);
	function do1(data){
		console.log(data.length);
		if(!(data.length<1)){
			$('#noresults').hide();
			var div = document.getElementById("new-flights");
			var htm = "<table class='table table-hover' border='1px solid black'><tr><th scope='col'>Flight Number</th><th>Airline</th><th>Source</th><th>Destiantion</th><th>TakeOff Time</th><th>Landing Time</th><th></th></tr>"
			data.forEach(new_func)
			htm+="</table>"
			div.innerHTML = htm;
			var i;
			for(i=0;i<data.length;i++){
				var btn = "btn"+i;
				var but = document.getElementById(btn);
				but.addEventListener('click',add_oper);
			}
			function add_oper(e){
				id=e.target.id;
				id =id[3];
				console.log(data[id]['name']);
				//alert(et);
				var url = "/api/flight_add_oper?id="+data[id]['id']
				window.location.replace(url);
			}
			function new_func(item,index){
				htm+="<tr><td>"+item['flightnumber']+"</td><td>"+item['airline_name']+"</td><td>"+item['source']+"</td><td>"+item['destination']+"</td><td>"+item['takeoff_time']+"</td><td>"+item['landing_time']+"</td><td><button class='btn btn-primary' id = 'btn"+index+"'>Add</button></td></th>";
				console.log(index);
			}
		}
	}
}