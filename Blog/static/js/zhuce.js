$(document).ready(function(){
	$("#zhuce").click(function(){
		$("#zc-tishi").empty();
		var username = $("#zc-username").val();
		var author = $("#zc-author").val();
		var password = $("#inputPassword3").val();
		var comfrimPassword = $("#inputPassword4").val();
		if(username==""||password==""||comfrimPassword=="") {
			var d = $("<span>用户名或密码不能为空！</span>");
			$("#zc-tishi").append(d);
		}else{
			if(password != comfrimPassword){
				var d = $("<span>前后密码不一致！</span>");
				$("#zc-tishi").append(d);
				$("#inputPassword3").val("");
				$("#inputPassword4").val("");
			}else{
				UserManager.existUser(username,function(flag){
					if(flag){
						UserManager.insert(username,author,password,function(){
							location.href="index.html";
						})
					}else{
						var d = $("<span>该用户已存在，请重新输入！</span>");
						$("#zc-tishi").append(d);
					}
				});
			}
		}
	});
	
	
});



