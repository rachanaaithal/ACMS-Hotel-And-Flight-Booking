window.onload = function(){
	console.log("heyya")
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
	var fname = document.getElementById("fname");
	fname.value = data[0]['first_name'];
	var lname = document.getElementById("lname");
	lname.value = data[0]['last_name'];
	var email = document.getElementById("email");
	email.value = data[0]['email'];
}

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
	//console.log(data[0]['first_name']);
	//var p1 = document.getElementById("profile1")
	//var str = "<p><b>First Name:	</b>"+data[0]['first_name']+"</p><p><b>Last Name:	</b>"+data[0]['last_name']+"</p><p><b>E-mail:	</b>"+data[0]["email"]+"</p>"
	//p1.innerHTML=str
	var phno = document.getElementById("phno");
	phno.value = data[0]['phone_number'];
	
}

var sub = document.getElementById("btn");
sub.addEventListener("click",function(){
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

});
}