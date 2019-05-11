window.onload = function(){
	var url = "api/citylist"
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
		var city = document.getElementById("city");
		var htm = "<select class='form-control' id='cty'>";
		var htm1 = "";
		data.forEach(new_fun)
		htm +=htm1;
		htm+="</select >";
		city.innerHTML = htm;
		function new_fun(item){
			htm1 += "<option value='"+item['name']+"'>"+item['name']+"</option>"
			//return htm1
		}
	}
	type =1;
	roomtypes = new Array();
	var get_roomtype = new XMLHttpRequest();
	get_roomtype.onreadystatechange = function(){
		var data = JSON.parse(this.responseText);
		add_type(data);
	}
	get_roomtype.open("GET","/api/roomtype");
	get_roomtype.send(null);
	function add_type(data){
		console.log(data);
		var rt = document.getElementById("rt"+type);
		var htm = "<select class='form-control' id='type"+type+"'>";
		var htm1 = "";
		data.forEach(new_fun)
		htm +=htm1;
		htm+="</select >";
		rt.innerHTML = htm;
		function new_fun(item){
			if(roomtypes.indexOf(item['name'],0)<0){
				htm1 += "<option value='"+item['name']+"'>"+item['name']+"</option>"
			}//return htm1
		}
	} 
	var sum = 0
	var url1 = "/api/hotels12"
	var get = new XMLHttpRequest();
	get.onreadystatechange = function(){
		var data = JSON.parse(this.responseText);
		do2(data);
	}
	get.open("GET",url1);
	get.send(null);
	function do2(data){
		console.log(data);
		var img_count =3
		var add = document.getElementById("add_img");
		add.addEventListener("click",function(){
			img_count = img_count+1;
			var id = "next_img"+img_count;
			console.log(id);
			var div = document.getElementById("next_img");
			var new_div = document.createElement("div");
			var inner = "<b>Image Url "+img_count+":</b> <br><input class='form-control' id='img"+img_count+"' type='url' name='img"+img_count+"'placeholder='Provide public url of image'><br><br><br>"
			//new_div.innerHTML = innerHTML;
			new_div.setAttribute("id",id);
			div.appendChild(new_div);
			var d = document.getElementById(id);
			d.innerHTML = inner;
		});
		var roomurl1="";
		var roomurl2="";
		var roomurl3="";
		var type_add = document.getElementById("newtype");
		type_add.addEventListener("click",function(){
			roomtype = document.getElementById("type"+type).value;
			roomtypes[type] = roomtype;
			capacity = document.getElementById("capacity"+type).value;
			description = document.getElementById("description"+type).value;
			price =  document.getElementById("price"+type).value;
			no_rooms =document.getElementById("no_rooms"+type).value;
			console.log(roomtype);
			if( roomtype=""||capacity=="" || description==""||price==""||no_rooms==""){
				fillthis = document.getElementById("fillthis");
				var rm ="rd";
				if (type==1)
				{
					rm = "st";
				}
				else if(type==2)
				{
					rm="nd"
				}
				h = "<p>Fill the details of "+ type +rm+ " room</p>";
				fillthis.innerHTML = h;
				console.log(h);
			}
			else if(type<3){
				type=type+1;
				var div = document.getElementById("new_types");
				var new_div = document.createElement("div");
				var id = "roomtype"+type;
				var inner = "<b>Room Type:</b><br><div id='rt"+type+"'></div><br><br><b>Capacity :</b><br><input class='form-control' id='capacity"+type+"' type = 'number' name = 'capacity' max ='5' min='1'>";
				inner=inner+"</input><br><br><br><b>Description :<b><br><textarea class='form-control' id='description"+type+"' rows='4' cols='50'></textarea><br><br><br>"
				inner=inner+"<b>Base Price :</b><br><input class='form-control' id='bprice"+type+"' type='number' min = '0.00'/><br><br><br>"
				inner=inner+"<b>Max Price :</b><br><input class='form-control' id='mprice"+type+"' type='number' min = '0.00'/><br><br><br>"
				inner = inner+"<b>Number of Rooms :</b><br><input class='form-control' id='no_rooms"+type+"' type='number' name='no_rooms'/><br><br><br>"
				new_div.setAttribute("id",id);
				div.appendChild(new_div);
				var d = document.getElementById(id);
				d.innerHTML = inner;
				var get_roomtype = new XMLHttpRequest();
				get_roomtype.onreadystatechange = function(){
					var data = JSON.parse(this.responseText);
					add_type(data);
				}
				get_roomtype.open("GET","/api/roomtype");
				get_roomtype.send(null);
			}
		});
		var sub = document.getElementById("btn");
		sub.addEventListener("click",function(){
			event.stopPropagation();
			var phone = /^\d{10}$/;
			function isValidURL(string) {
				  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
				  if (res == null)
					return false;
				  else
					return true;
			};
			var name = document.getElementById("name").value;
			var city = document.getElementById("cty").value;
			var add = document.getElementById("add").value;
			var email = document.getElementById("email").value;
			var phno = document.getElementById("phno").value;
			var ctime = document.getElementById("ctime").value;
			var etime = document.getElementById("etime").value;
			var lat = document.getElementById("lat").value;
			var longi = document.getElementById("long").value;
			var img1 = document.getElementById("img1").value;
			var img2 = document.getElementById("img2").value;
			var img3 = document.getElementById("img3").value;
			var i;
			var roomurl="&room_count="+type;
			console.log(roomurl);
			imgs = new Array();
			for(var i=4;i<=img_count;i++){
				var j ="img"+i;
				//console.log("blah2");
				if(document.getElementById(j)){
					//console.log("blah1");
					im = document.getElementById(j).value;
					//console.log(im);
					if(im==""){
						var er = document.getElementById("error")
						//console.log(er.innerHTML)
						var htm = "<p>Fields cannot be empty </p>"
						er.innerHTML = htm;
					}
					else{
						imgs[i]=im;
					}
				}
			}
			roomsurl = new Array();
			for(var i=1;i<=type;i++){
				roomtype = document.getElementById("type"+i).value;
				roomtypes[type] = roomtype;
				capacity = document.getElementById("capacity"+i).value;
				description = document.getElementById("description"+i).value;
				bprice =  document.getElementById("bprice"+i).value;
				mprice =  document.getElementById("mprice"+i).value
				no_rooms =document.getElementById("no_rooms"+i).value;
				if(roomtype=""||capacity=="" || description==""||bprice==""||mprice==""||no_rooms==""){
					var er = document.getElementById("error")
					var htm = "<p>Fields cannot be empty </p>"
					er.innerHTML = htm;
				}
				else{
					if(capacity>5){
						capacity=5;
					}
					if(capacity<1){
						capacity=1;
					}
					console.log(roomtype);
					var str = "&roomtype"+i+"="+roomtypes[i]+"&capacity"+i+"="+capacity+"&description"+i+"="+description+"&bprice"+i+"="+bprice+"&mprice"+i+"="+mprice+"&no_rooms"+i+"="+no_rooms;
					roomsurl[i] = str;
				}
			}			
			function check_hotel(data,name,city){
				var flag=0;
				n=data.length;
				var i=0;
				for(i=0;i<n;i=i+1){
					//console.log(data[i]['name']);
					if (data[i]['name']==name && data[i]['city']==city){
						flag=1;
					}
				}
				return flag;
			}
			var flag = check_hotel(data,name,city);
			//console.log(flag);
			if(name=="" || city=="" || add=="" || ctime=="" || etime==""|| lat=="" || longi==""|| email=="" || phno=="" || img1=="" ||img2==""||img3=="")
			{
				var er = document.getElementById("error")
				console.log(er.innerHTML)
				var htm = "<p>Fields cannot be empty </p>"
				console.log (flag);
				er.innerHTML = htm;
			}
			else if(email.indexOf("@",0)< 0 || email.indexOf(".",0) < 0 )
			{
				var er = document.getElementById("error")
				console.log(er.innerHTML)
				var htm = "<p>Please enter a vaild E-mail ID </p>"
				er.innerHTML = htm;
			}
			else if(!(phno.match(phone)))
			{
				var er = document.getElementById("error")
				console.log(er.innerHTML)
				var htm = "<p>Please enter a vaild Phone Number </p>"
				er.innerHTML = htm;
			}
			else if("true"==isValidURL(img1) && "true"==isValidURL(img2) && "true"==isValidURL(img3))
			{
				var er = document.getElementById("error")
				console.log(er.innerHTML)
				var htm = "<p>Please enter a vaild URL </p>"
				er.innerHTML = htm;
			}
			else if(flag==1){
				var er = document.getElementById("error")
				console.log(er.innerHTML)
				var htm = "<p>Hotel already exits</p>"
				er.innerHTML = htm;
			}
			else{
				var get = new XMLHttpRequest();
				get.onreadystatechange = function(){
					var data1 = JSON.parse(this.responseText);
					do3(data1,email);
				}
				get.open("GET","/api/users");
				get.send(null);
				function do3(data1,email){
					console.log(email);
					function check_user(data,email){
						var flag=0;
						n=data.length;
						var i=0;
						for(i=0;i<n;i=i+1){
							if (data[i]['username']==email){
								flag=1;
							}
						}
						return flag;
					}
					var flag= check_user(data1,email);
					if(flag ==1){
						var er = document.getElementById("error")
						console.log(er.innerHTML)
						var htm = "<p>Email already exits</p>"
						er.innerHTML = htm;
					}
					else {
						var get = new XMLHttpRequest();
						get.onreadystatechange = function(){
							var data2 = JSON.parse(this.responseText);
							do4(data2,name,city,email);
						}
						get.open("GET","/api/newhotels");
						get.send(null);
						function do4(data1,name,city,email){
							function check_hotel(data1,name,city,email){
								var f=0;
								n=data1.length;
								var i=0;
								
								for(i=0;i<n;i=i+1){	
									//console.log(data1[i]['email']);
									//console.log(email);
									if(data1[i]['email']==email){
										f=1;
									}
									if (data1[i]['name']==name && data1[i]['city']==city){
										f=1;
									}
								}
								console.log(f);
								return f;
							}
							var flag3= check_hotel(data1,name,city,email);	
							console.log(flag3);
							if(flag3==1){
								var er = document.getElementById("error")
								console.log(er.innerHTML)
								var htm = "<p>Hotel already registered</p>"
								er.innerHTML = htm;
							}
							else{
								var imag="&count="+img_count+"&img1="+img1+"&img2="+img2+"&img3="+img3;
								for(i=4;i<=img_count;i++){
									imag = imag+"&img"+i+"="+imgs[i];
								}
								console.log(imag);
								var url = "/api/oper_register?name="+name+"&city="+city+"&add="+add+"&ct="+ctime+"&et="+etime+"&lat="+lat+"&long="+longi+"&email="+email+"&phno="+phno;
								url =url +imag+roomurl;
								for (i=1;i<=type;i++){
									url=url+roomsurl[i];
								}
								console.log(roomurl);
								console.log(roomsurl);
								if(sum<1){
									console.log(url);
									url1 = url.replace("#",'No');
									//alert(url1);
									window.location.replace(url1);
									sum = 1;
								}	
							}
						}
					}
				}
			}
		});
	}
}