window.onload = function(){
	var url = "/api/users"
	var post = new XMLHttpRequest();
	post.onreadystatechange = function(user,flag){
		var json = JSON.parse(this.responseText);
		do2(json);
	};
	post.open("GET",url);
	post.send(null);
	
	function do2(data){
		var sub = document.getElementById("btn");
		n = data.length;
		var u = new  Array();
		data.forEach(function(item){
			u.push(item['username'])
		});
		
		sub.addEventListener("click",function(){
			var phone = /^\d{10}$/;
			var passw = /^[A-Za-z0-9]\w{7,14}$/;
			var user = document.getElementById("username").value;
			var pass = document.getElementById("password").value;
			var fname = document.getElementById("fname").value;
			var lname = document.getElementById("lname").value;
			var email = document.getElementById("email").value;
			var phno = document.getElementById("phno").value;
			var cpass = document.getElementById("cpassword").value;
			if(user=="" || pass=="" || fname=="" || lname=="" || email=="" || phno=="" || cpass=="")
			{
				var er = document.getElementById("error")
				var htm = "<p>Fields cannot be empty </p>"
				er.innerHTML = htm;
			}
			else if((u.indexOf(user)>-1)){
				var er = document.getElementById("error")
				var htm = "<p>User already exits </p>"
				er.innerHTML = htm;
			}
			else if(!(pass.match(passw))){
				var er = document.getElementById("error")
				var htm = "<p>Password should have 8 characters </p>"
				er.innerHTML = htm;
			}
			else if(!(pass==cpass))
			{
				var er = document.getElementById("error")
				var htm = "<p>Passwords fields didn't match</p>"
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
			else{
				var url = "/api/register?username="+user+"&password="+pass+"&fname="+fname+"&lname="+lname+"&email="+email+"&phno="+phno;
				window.location.replace(url);
			}
			
		
		});
	}
}