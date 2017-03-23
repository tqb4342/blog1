$(document).ready(function(){
	Jump();
	$("#user-submit").click(function(){
		$("#tishi").empty();
		var username = $("#user-input").val();		
		var password = $("#pass-input").val();
		if(username==""||password=="") {
			//alert("请输入用户名或密码！！");
			var d = $("<span>用户名或密码不能为空！</span>");
			$("#tishi").append(d);
		}else{		
			UserManager.login(username,password,function(flag){
				if(flag){
					location.href="blog.html";	
					$("#pass-input").val("");
				}else{
					var d = $("<span>用户名或密码不正确！</span>");
						$("#tishi").append(d);
					$("#pass-input").val("");
				}
			});
				
		}
	});
});
function Jump(){
	$("#submit-button").click(function(){
		$("#admin-login-modal").modal("show");	
	});
	$("#zuce-button").click(function(){
		location.href="zhuce.html";
	});
	$("#kankan-button").click(function(){
		$("#user-input").val("wobushi-user");
		$("#pass-input").val("wobushi-user");
		var username = $("#user-input").val();	
		var password = $("#pass-input").val();
		UserManager.login(username,password,function(flag){
			
		});
		$("#user-input").val("");
		$("#pass-input").val("");
		location.href="blog.html";
	});
 }


