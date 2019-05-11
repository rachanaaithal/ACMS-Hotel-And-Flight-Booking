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
	
	var sub = document.getElementById("btn");
	sub.addEventListener("click",function(){
	var phone = /^\d{10}$/;
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
	var flag =0 ;
	var url1 = "/api/hotels12"
	var get = new XMLHttpRequest();
	get.onreadystatechange = function(flag){
		var data = JSON.parse(this.responseText);
		flag=do2(data,name,add);
		console.log(flag);
		
	}
	get.open("GET",url1);
	get.send(null);
	var get = new XMLHttpRequest();
	get.onreadystatechange = function(){
		var data1 = JSON.parse(this.responseText);
		flag = do3(data1,email);
	}
	get.open("GET","/api/users");
	get.send(null);
	
	var get = new XMLHttpRequest();
	get.onreadystatechange = function(){
		var data1 = JSON.parse(this.responseText);
		flag = do4(data1,email);
	}
	get.open("GET","/api/newhotels");
	get.send(null);
	
	if(name=="" || city=="" || add=="" || ctime=="" || etime==""|| lat=="" || longi==""|| img1=="" || email=="" || phno=="" || img2=="" ||img3=="")
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
	else if (flag ==3){
		var er = document.getElementById("error")
		console.log(er.innerHTML)
		var htm = "<p>Hotel already registered</p>"
		er.innerHTML = htm;
	}
	else if(flag==1){
		var er = document.getElementById("error")
		console.log(er.innerHTML)
		var htm = "<p>Hotel already exits</p>"
		er.innerHTML = htm;
	}
	else if (flag ==2){
		var er = document.getElementById("error")
		console.log(er.innerHTML)
		var htm = "<p>Email already exits</p>"
		er.innerHTML = htm;
	}
	else{
		
		var url = "/api/oper_register?name="+name+"&city="+city+"&add="+add+"&ct="+ctime+"&et="+etime+"&img="+img+"&lat="+lat+"&long="+longi+"&email="+email+"&phno="+phno;
		//window.location.replace(url);
	}
});
	function do2(data,name,city){
		console.log("do 2");
		console.log(data);
		console.log(name);
		data.forEach(check_hotel);
		function check_hotel(item){
			if(name==item['name'] && city==item['city']){
				flag1 = 1;
			}
		}
		return flag1;
	}
	
	function do3(data1,email){
		console.log(data1);
		data1.forEach(check_username);
		function check_username(item){
			if(email == item['username']){
				flag=2;
			}
		}
		return flag;
	}
	function do4(data,name,city){
		console.log(data);
		console.log(name);
		data.forEach(check_hotel);
		function check_hotel(item){
			if(name==item['name'] && city==item['city']){
				flag1 = 1;
			}
		}
		return flag1;
	}
}