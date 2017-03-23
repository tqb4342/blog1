
$(document).ready(function(){
	BtypesManager.QueryAll(function(btype){
			$("#type-select").empty();
		for(var i=0;i<btype.length;i++){
			var op = '<option>'+btype[i].name+'</option>';
			$("#type-select").append(op);
		}
		
		$("#submit-blog").click(function(){
			var text = $("#addquestion-content-div").html();
			var title = $("#addquestion-title-input").val();
			var tid;
			if(text==""||title==""){
				$("#submit-tishi").text("博文内容和博文标题不能为空。");
			}else{
				var a = $("#type-select").val();
				for(var i=0;i<btype.length;i++){
					if(btype[i].name==a){
						tid = btype[i].tid;
					}
				}
				UserManager.checkSession(function(username){
					var author = username.split("*")[1];
					UserManager.getAuthor(author,function(uid){
						BlogManager.submit(uid,tid,text,title,author,function(){
							console.log(uid,text,title,author);
							UserManager.setSession(username);
							location.href="blog.html";
						});
					});
				});
			}
		
		});
	});
});