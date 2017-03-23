$(document).ready(function(){
	
	var url = decodeURI(window.location.href);
	dwr.engine.setAsync(false);
	var wordname = url.split("?")[1];
	var bid = wordname.split("=")[1];
	console.log(bid);
	
	BlogManager.getBlogText(bid,function(blog){
		console.log(blog.bid);
		$("#show-blog-logo").text(blog.author);
		$("h2").text(blog.title);
		var author = "作者："+blog.author;
		$("#author").text(author);
		$("#blog-text-show").html(blog.texts);
//		var t = '<a  id="cblog-'+blog.bid+'" class="category" style="float:left;font-size:15px;"></a>'+
//		'<div id="comment-'+blog.bid+'" style="float:left;font-size:15px;"></div><br>';
//		var b = '<a  id="rblog-'+blog.bid+'" class="category" style="float:left;font-size:15px;"></a><span style="float:left;font-size:15px;">回复</span>'+
//		'<a id="rhblog-'+blog.bid+'" class="category" style="float:left;font-size:15px;"></a>'+
//		'<div id="reply-'+blog.bid+'" style="float:left;font-size:15px;"></div><br>';
//		$("#blog-comment").append(t);
//		$("#blog-reply").append(b);
		
		
		CommentManager.getBybid(blog.bid,function(com){
			console.log(com);
			
		//	UserManager.checkSession(function(username){
			//	var name = username.split("*")[1];
			if(com!=null){
				for(var i=0;i<com.length;i++){
//					$("#comment-"+blog.bid).text(com[i].user.author+":"+com[i].ptext+"。");
//					$("#reply-"+blog.bid).text(blog.author+":"+com[i].reply);
					var comment = '<p id="blog-comment-'+i+'"></p>';
					var reply1 = '<p id="blog-reply-'+i+'"></p>';
					$("#blog-reply-comment").append(comment);
					$("#blog-reply-comment").append(reply1);
					var t = '<a  id="cblog-'+blog.bid+'" class="category" style="float:left;font-size:15px;">'+com[i].user.author+':</a>'+
					'<div id="comment-'+i+'" style="float:left;font-size:15px;">'+com[i].ptext+'</div><a id="yaoreply-'+i+'"  class="huifu">回复</a><span style="float:left;font-size:15px; color:red" id="tishi-huifu-'+i+'"></span><br><div id="zdreply-'+i+'"></div>';
					var b = '<a  id="rblog-'+blog.bid+'" class="category" style="float:left;font-size:15px;">'+com[i].b.author+'</a><span style="float:left;font-size:15px;">回复</span>'+
					'<a id="rhblog-'+blog.bid+'" class="category" style="float:left;font-size:15px;">'+com[i].user.author+':</a>'+
					'<div id="reply-'+blog.bid+'" style="float:left;font-size:15px;">'+com[i].reply+'</div><br>';
					if(com[i].ptext!=null){
						$("#comment-"+i).text(com[i].ptext);
						$("#blog-comment-"+i).append(t);
					}
					if(com[i].reply!=""){
						$("#blog-reply-"+i).append(b);
					}
				}
			}
			
			//评论
			$("#b-comment").click(function(){
				var a = $("#message").val();
				console.log(a);
				UserManager.checkSession(function(username){
					if(username!="wobushi-user"&&username!=null){
						if(a!=""){
							var name = username.split("*")[0];
							UserManager.getUserByName(name,function(user){
								console.log(user);
								//插入评论
								CommentManager.insertcom(blog.bid,user.id,a,function(){
									BlogManager.zjcom(blog.bid,function(){
										
									});
									var a = $("#message").val("");
									location.href="showBlog.html?bid="+blog.bid;
								});
							});
						}
					}else{
						$("#qxdl").text("请先登录。")
					}
				});
			});
			
			//回复
			$(".huifu").click(function(){
				var d = $(this).attr("id").split("-")[1];
				console.log(d);
				var text = '<textarea id="huifu-text"  class="form-control" rows="3" placeholder="回复内容...."></textarea>'+
				'<button id="huifu-btll" type="button" style="float:left;font-size:15px;" class="btn btn-info">提交</button><br>';
				UserManager.checkSession(function(username){
					var name = username.split("*")[1];
					if(username!="wobushi-user"&&username!=null){
						if(name==com[d].b.author){
						$("#zdreply-"+d).html(text);
						$("#huifu-btll").click(function(){
								var hftext = $("#huifu-text").val();
								if(hftext!=""){	
									CommentManager.updatecomment(com[d].pid,hftext,function(){
										location.href="showBlog.html?bid="+blog.bid;
									});
							}
						
				});
						}else{
							$("#tishi-huifu-"+d).text("您不是博主，没有权限评论。");
						}
			}else{
				$("#tishi-huifu-"+d).text("请先登录。");
			}
		});
	});
			
			
		});
		});
	//});
	
});