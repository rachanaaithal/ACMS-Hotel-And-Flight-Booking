window.onload = function(){
	var get = new XMLHttpRequest();
	get.onreadystatechange = function(){
	var data = JSON.parse(this.responseText);
	do1(data);
}
get.open("GET","/api/profile1");
get.send(null);
function do1(data)
{
	console.log(data);
	console.log(data[0]['first_name']);
	//var p1 = document.getElementById("profile1")
	//var str = "<p><b>First Name:	</b>"+data[0]['first_name']+"</p><p><b>Last Name:	</b>"+data[0]['last_name']+"</p><p><b>E-mail:	</b>"+data[0]["email"]+"</p>"
	//p1.innerHTML=str
	if((data[0]['first_name']=="")){
		$('#names').hide();
		//$('#lname').hide();
		var email = document.getElementById("email");
		email.value = data[0]['email'];
	}
	else{
		var fname = document.getElementById("fname");
		fname.value = data[0]['first_name'];
		var lname = document.getElementById("lname");
		lname.value = data[0]['last_name'];
		var email = document.getElementById("email");
		email.value = data[0]['email'];
	}
}

var role="";
var get1 = new XMLHttpRequest();
get1.onreadystatechange = function(){
	var data = JSON.parse(this.responseText);
	do2(data);
}
get1.open("GET","/api/profile2");
get1.send(null);

function do2(data)
{
	console.log(data);
	if(!(data=='')){
	role="user";
	var phno = document.getElementById("phno");
	phno.value = data[0]['phone_number'];
	}
	
}

var get2 = new XMLHttpRequest();
get2.onreadystatechange = function(){
	var data = JSON.parse(this.responseText);
	do3(data);
}
get2.open("GET","/api/hotelprofile");
get2.send(null);

function do3(data)
{
	console.log(data);
	if(!(data=='')){
	role="hotel";
	var phno = document.getElementById("phno");
	phno.value = data[0]['phone_number'];
	}
	
}

var get3 = new XMLHttpRequest();
get3.onreadystatechange = function(){
	var data = JSON.parse(this.responseText);
	do4(data);
}
get3.open("GET","/api/flightprofile");
get3.send(null);

function do4(data)
{
	console.log(data);
	if(!(data=='')){
	role="flight";
	console.log(data[0]['phone_number']);
	var phno = document.getElementById("phno");
	phno.value = data[0]['phone_number'];
	}
	
}

var sub = document.getElementById("btn");
sub.addEventListener("click",function(){
	console.log(role);
	if(role=='user'){
		var phone = /^\d{10}$/;
		var fname = document.getElementById("fname").value;
		var lname = document.getElementById("lname").value;
		var email = document.getElementById("email").value;
		var phno = document.getElementById("phno").value;
		//var next = document.getElementById("next");
		//console.log(next);
		if(fname=="" || lname=="" || email=="" || phno=="" )
		{
			console.log("hi");
			var er = document.getElementById("error")
			console.log(er.innerHTML)
			var htm = "<p>Fields cannot be empty </p>"
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
		else{
			alert("success");
			var url = "/api/edit?fname="+fname+"&lname="+lname+"&email="+email+"&phno="+phno;
			window.location.replace(url);
		}
	}
	else if(role=='hotel'){
		var email = document.getElementById("email").value;
		var phno = document.getElementById("phno").value;
		//var next = document.getElementById("next");
		//console.log(next);
		if( email=="" || phno=="" )
		{
			console.log("hi");
			var er = document.getElementById("error")
			console.log(er.innerHTML)
			var htm = "<p>Fields cannot be empty </p>"
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
		else{
			alert("success");
			var url = "/api/hoteledit?email="+email+"&phno="+phno;
			window.location.replace(url);
		}
	}
	else{
		var email = document.getElementById("email").value;
		var phno = document.getElementById("phno").value;
		//var next = document.getElementById("next");
		//console.log(next);
		if(fname=="" || lname=="" || email=="" || phno=="" )
		{
			console.log("hi");
			var er = document.getElementById("error")
			console.log(er.innerHTML)
			var htm = "<p>Fields cannot be empty </p>"
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
		else{
			alert("success");
			var url = "/api/flightedit?email="+email+"&phno="+phno;
			window.location.replace(url);
		}
	}
});
}
	/*

});*/
