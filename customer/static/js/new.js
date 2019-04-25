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
		var htm = "<select id='cty'>";
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
			var inner = "<b>Image Url "+img_count+":</b> <br><input id='img"+img_count+"' type='url' name='img"+img_count+"'placeholder='Provide public url of image'><br><br><br>"
			//new_div.innerHTML = innerHTML;
			new_div.setAttribute("id",id);
			div.appendChild(new_div);
			var d = document.getElementById(id);
			d.innerHTML = inner;
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
			imgs = new Array();
			var i;
			for(var i=4;i<=img_count;i++){
				var j ="img"+i;
				console.log("blah2");
				if(document.getElementById(j)){
					console.log("blah1");
					im = document.getElementById(j).value;
					console.log(im);
					if(im==""){
						var er = document.getElementById("error")
						console.log(er.innerHTML)
						var htm = "<p>Fields cannot be empty </p>"
						er.innerHTML = htm;
					}
					else{
						imgs[i]=im;
					}
				}
				console.log("ll");
				console.log(imgs[i]);
			}
			for(i=4;i<=img_count;i++){
				console.log(imgs[i]);
			}
			function check_hotel(data,name,city){
				var flag=0;
				n=data.length;
				var i=0;
				for(i=0;i<n;i=i+1){
					console.log(data[i]['name']);
					if (data[i]['name']==name && data[i]['city']==city){
						flag=1;
					}
				}
				return flag;
			}
			var flag = check_hotel(data,name,city);
			console.log(flag);
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
							do4(data2,name,city);
						}
						get.open("GET","/api/newhotels");
						get.send(null);
						function do4(data1,name,city){
							function check_hotel(data1,name,city){
								var f=0;
								n=data1.length;
								var i=0;
								for(i=0;i<n;i=i+1){									
									if (data1[i]['name']==name && data1[i]['city']==city){
										f=1;
									}
								}
								console.log(f);
								return f;
							}
							var flag3= check_hotel(data1,name,city);	
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
								url =url +imag;
								if(sum<1){
									window.location.replace(url);
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