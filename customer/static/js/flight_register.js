window.onload = function(){
	var get = new XMLHttpRequest();
	get.onreadystatechange = function(){
		var data = JSON.parse(this.responseText);
		do1(data);
	}
	get.open("GET","/api/citylist");
	get.send(null);
	function do1(data)
	{
		console.log(data);
		var src = document.getElementById("source");
		var desti = document.getElementById("destination");
		var htm_src = "<select class='form-control' id='src'>";
		var htm_desti = "<select class='form-control' id='des'>";
		var htm1 = "";
		data.forEach(new_fun)
		htm_src +=htm1;
		htm_src+="</select >";
		htm_desti +=htm1;
		htm_desti+="</select >";
		src.innerHTML = htm_src;
		desti.innerHTML = htm_desti;
		function new_fun(item){
			if(!(item['name']=="")){
				htm1 += "<option value='"+item['name']+"'>"+item['name']+"</option>"
			}
		}
	}
	sum=0;
	var get = new XMLHttpRequest();
	get.onreadystatechange = function(){
		var data = JSON.parse(this.responseText);
		do2(data);
	}
	get.open("GET","/api/seattype1");
	get.send(null);
	function do2(data){
		var src = document.getElementById("rt1");
		var htm_src = "<select class='form-control' id='category'>";
		var htm1 = "";
		data.forEach(new_fun)
		htm_src +=htm1;
		htm_src+="</select >";
		src.innerHTML = htm_src;
		function new_fun(item){
			htm1 += "<option value='"+item['name']+"'>"+item['name']+"</option>"
		}
	}
	var get = new XMLHttpRequest();
	get.onreadystatechange = function(){
		var data = JSON.parse(this.responseText);
		do3(data);
	}
	get.open("GET","/api/flights1");
	get.send(null);
	function do3(data){
	var add_seats = document.getElementById("add_seat");
	add_seats.addEventListener("click",function(){
		var flight_no = document.getElementById("flight_no").value;
		var name = document.getElementById("name").value;
		var email = document.getElementById("email").value;
		var phno = document.getElementById("phno").value;
		var date = document.getElementById("date").value;
		var takeoff = document.getElementById("takeoff").value;
		var land = document.getElementById("land").value;
		var src = document.getElementById("src").value;
		var des = document.getElementById("des").value;
		var img = document.getElementById("img").value;
		var tail_id = document.getElementById("tail_id").value;
		var category = document.getElementById("category").value;
		takeoff = takeoff+":00";
		land = land+":00";
		var phone = /^\d{10}$/;
		function isValidURL(string) {
		  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
		  if (res == null)
			return false;
		  else
			return true;
		};
		function check_flight(data,flight_no,takeoff,src,des){
			var flag=0;
			n=data.length;
			for(var i=0;i<n;i++){
				console.log(data[i]['takeoff_time']==takeoff)
				console.log(data[i]['source']==src)
				console.log(data[i]['flightnumber']==flight_no)
				console.log(data[i]['destination']==des)
				console.log(takeoff)
				if(data[i]['flightnumber']==flight_no && data[i]['takeoff_time']==takeoff && data[i]['source']==src && data[i]['destination']==des){
					flag=1;
				}
			}
			return flag;
		}
		var flag = check_flight(data,flight_no,takeoff,src,des);
		if(flight_no==""|| name==""|| email==""|| phno==""|| date==""|| takeoff==""|| land==""|| src==""|| des==""|| img==""|| tail_id==""|| category=="")
		{
			var er = document.getElementById("error")
			var htm = "<p>Fields cannot be empty </p>"
			er.innerHTML = htm;
		}
		else if(src == des){
			var er = document.getElementById("error")
			var htm = "<p>Source and Destination cannot be same</p>"
			er.innerHTML = htm;
		}
		else if(takeoff == land){
			var er = document.getElementById("error")
			var htm = "<p>Takeoff and Landing time cannot be same</p>"
			er.innerHTML = htm;
		}
		else if(email.indexOf("@",0)< 0 || email.indexOf(".",0) < 0 )
		{
			var er = document.getElementById("error")
			var htm = "<p>Please enter a vaild E-mail ID </p>"
			er.innerHTML = htm;
		}
		else if(!(phno.match(phone)))
		{
			var er = document.getElementById("error")
			var htm = "<p>Please enter a vaild Phone Number </p>"
			er.innerHTML = htm;
		}
		else if("true"==isValidURL(img))
		{
			var er = document.getElementById("error")
			var htm = "<p>Please enter a vaild URL </p>"
			er.innerHTML = htm;
		}
		else if(flag==1){
			var er = document.getElementById("error")
			var htm = "<p>Flight details already exits </p>"
			er.innerHTML = htm;
		}
		else{
			var get = new XMLHttpRequest();
			get.onreadystatechange = function(){
				var data = JSON.parse(this.responseText);
				do4(data);
			}
			get.open("GET","/api/newflights");
			get.send(null);
			function do4(data){	
				function check_newflight(data,flight_no,takeoff,src,des,email){
					var flag=0;
					n=data.length;
					for(var i=0;i<n;i++){
						if(data[i]['email']==email){
							flag=1;
						}
						if(data[i]['flightnumber']==flight_no && data[i]['takeoff_time']==takeoff && data[i]['source']==src && data[i]['destination']==des){
							flag=1;
						}
					}
					return flag;
				}
				var flag = check_newflight(data,flight_no,takeoff,src,des,email);
				if(flag==1){
					var er = document.getElementById("error")
					var htm = "<p>Flight details already registered </p>"
					er.innerHTML = htm;
				}
				else{
					var get = new XMLHttpRequest();
					get.onreadystatechange = function(){
						var data = JSON.parse(this.responseText);
						do5(data);
					}
					get.open("GET","/api/users");
					get.send(null);
					function do5(data){	
						function check_user(data,email){
							var flag=0;
							n=data.length;
							for(var i=0;i<n;i++){
								if(data[i]['email']==email){
									flag=1;
								}
							}
							return flag;
						}
						var flag = check_user(data,email);
						if(flag==1){
							var er = document.getElementById("error")
							var htm = "<p>Email alreday exits </p>"
							er.innerHTML = htm;
						}
						else{
							//date ="2019-4-"+date
							var url1 = "flight_no="+flight_no+"&name="+name+"&email="+email+"&phno="+phno+"&date="+"2019-4-"+date+"&take="+takeoff+"&land="+land+"&src="+src+"&des="+des+"&img="+img+"&category="+category+"&tailId="+tail_id;
							if(category=="Economy"){
								var inside_of_seats = "";
								inside_of_seats = inside_of_seats+"<div id = 'fillthis'></div>";
								inside_of_seats=inside_of_seats+"<b>Number of Aisle Seats:</b><br><input class='form-control' id='no_a' type='number'/><br><br><br>";
								inside_of_seats=inside_of_seats+"<b>Base Price for Aisle Seat:</b><br><input  class='form-control' id='bprice_a' type='number'/><br><br><br>";
								inside_of_seats=inside_of_seats+"<b>Max Price for Aisle Seat:</b><br><input  class='form-control' id='mprice_a' type='number'/><br><br><br>";
								inside_of_seats=inside_of_seats+"<b>Number of Middle Seats:</b><br><input class='form-control' id='no_m' type='number'/><br><br><br>";
								inside_of_seats=inside_of_seats+"<b>Base Price for Middle Seat:</b><br><input class='form-control' id='bprice_m' type='number'/><br><br><br>";
								inside_of_seats=inside_of_seats+"<b>Max Price for Middle Seat:</b><br><input class='form-control' id='mprice_m' type='number'/><br><br><br>";
								inside_of_seats=inside_of_seats+"<b>Number of Window Seats:</b><br><input class='form-control' id='no_w' type='number'/><br><br><br>";
								inside_of_seats=inside_of_seats+"<b>Base Price for Window Seat:</b><br><input class='form-control' id='bprice_w' type='number'/><br><br><br>";
								inside_of_seats=inside_of_seats+"<b>Max Price for Window Seat:</b><br><input class='form-control' id='mprice_w' type='number'/><br><br><br>";
								inside_of_seats=inside_of_seats+"<input class='btn btn-primary' id='btn' type='button' value='Register'>";
								var div = document.getElementById("seats");
								div.innerHTML =inside_of_seats;
								var reg = document.getElementById("btn");
								reg.addEventListener("click",function(){
									var no_a = document.getElementById("no_a").value;
									var bprice_a = document.getElementById("bprice_a").value;
									var mprice_a = document.getElementById("mprice_a").value;
									var no_m = document.getElementById("no_m").value;
									var bprice_m = document.getElementById("bprice_m").value;
									var mprice_m = document.getElementById("mprice_m").value;
									var no_w = document.getElementById("no_w").value;
									var bprice_w = document.getElementById("bprice_w").value;
									var mprice_w = document.getElementById("mprice_w").value;
									if(no_a==""||bprice_a==""||mprice_a==""||no_m==""||bprice_m==""||mprice_m==""||no_w==""||bprice_w==""||mprice_w==""){
										var fillthis = document.getElementById("fillthis");
										htm="<p>Please fill in all details<p>";
										fillthis.innerHTML = htm;
									}
									else{
										console.log(url1);
										url2 = "&no_a="+no_a+"&bprice_a="+bprice_a+"&mprice_a="+mprice_a+"&no_m="+no_m+"&bprice_m="+bprice_m+"&mprice_m="+mprice_m+"&no_w="+no_w+"&bprice_w="+bprice_w+"&mprice_w="+mprice;
										console.log(url2);
										if(sum<1){
											console.log(window.location.href)
											var next_url = window.location.search;
											next_url=next_url.replace('?','');
											//alert(next_url);
											window.location.replace('/api/flightregister?'+url1+url2+"&"+next_url);
											sum++;
										}
									}
								});
								
							}
							else{
								var inside_of_seats = "";
								inside_of_seats = inside_of_seats+"<div id = 'fillthis'></div>";
								inside_of_seats=inside_of_seats+"<b>Number of Seats:</b><br><input class='form-control' id='no' type='number'/><br><br><br>";
								inside_of_seats=inside_of_seats+"<b>Base Price:</b><br><input class='form-control' id='bprice' type='number'/><br><br><br>";
								inside_of_seats=inside_of_seats+"<b>Max Price:</b><br><input class='form-control' id='mprice' type='number'/><br><br><br>";
								inside_of_seats=inside_of_seats+"<input class='btn btn-primary' id='btn' type='button' value='Register'>";
								var div = document.getElementById("seats");
								div.innerHTML =inside_of_seats;
								var reg = document.getElementById("btn");
								reg.addEventListener("click",function(){
									var no = document.getElementById("no").value;
									var bprice = document.getElementById("bprice").value;
									var mprice = document.getElementById("mprice").value;
									if(no==""||mprice=="" || bprice==""){
										var fillthis = document.getElementById("fillthis");
										htm="<p>Please fill in all details<p>";
										fillthis.innerHTML = htm;
									}
									else{
										console.log(url1);
										url2 = "&no="+no+"&bprice="+bprice+"&mprice="+mprice;
										console.log(url2);
										if(sum<1){
										console.log(window.location.href)
										var next_url = window.location.search;
										next_url=next_url.replace('?','');
 										//alert(next_url);
										window.location.replace('/api/flightregister?'+url1+url2+"&"+next_url);
										sum++;
										}
									}
								});
							}
						}
					}
				}
			}
		}
	});
}
}