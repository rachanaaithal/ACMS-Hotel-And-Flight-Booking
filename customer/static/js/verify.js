window.onload=function(){
	
	var get = new XMLHttpRequest();
	get.onreadystatechange = function(){
	var data = JSON.parse(this.responseText);
	do1(data);
	}
	get.open("GET","/api/newhotels");
	get.send(null);
	function do1(data){
		if(data.length>0){
			var div = document.getElementById("new-hotels");
			$('#noresults').hide();
			var htm = "<table class='table table-hover'border='1px solid black'><tr><th scope='col'>Hotel</th><th>Address</th><th>City</th><th>Check-In Time</th><th>Extra Time</th><th></th></tr>"
			
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
				extrat = data[id]['extratime'];
				hr = extrat[0]+extrat[1];
				min = extrat[3]+extrat[4];
				sec = extrat[6]+extrat[7];
				//alert(et);
				var url = "/api/add_oper?id="+data[id]['id']
				window.location.replace(url);
			}
			function new_func(item,index){
				//here
				htm+="<tr><td>"+item['name']+"</td><td>"+item['address']+"</td><td>"+item['city']+"</td><td>"+item['checkintime']+"</td><td>"+item['extratime']+"</td><td><button class='btn btn-success'id = 'btn"+index+"'>Add</button></td></th>";
			}
		}
	}
}