$(document).ready(function(){

	UserManager.checkSession(function(username){
		//console.log(username);
		if(username!="wobushi-user"&&username!=null){
			var s = $("#manage-username-a").html();
			//console.log(s);
			var author = username.split("*")[1];
			var name = username.split("*")[0];
		//	console.log(author);
			$("#manage-username-a").html(author+s);
			$("#write-blog").click(function(){
				location.href="write.html";
			});
			
			//查看我的博客
			$("#my-blog").click(function(){
				//console.log(name);
			
				UserManager.findblog(name,function(userblog){
					//console.log(userblog);
					var blog = userblog.blog;
					blog_show(blog);
					
				});
			});
			
			$("#download").click(function(){
				location.href="resource.html";
			});
			
			//修改自己的信息
			manager_mess(name);
			
		}else{
			$("#manage-username-a").text("登 录");
			$("#manage-username-a").click(function(){
				$("#admin-login-modal").modal("show");	
			});
			$("#write-blog").click(function(){
				//location.href="#";
				$("#gridSystemModalLabel").text("请先登录");
				$("#admin-login-modal").modal("show");	
			});
			$("#download").click(function(){
				//location.href="#";
				$("#gridSystemModalLabel").text("请先登录");
				$("#admin-login-modal").modal("show");	
			});
		}
	});
	
	//显示所有的博客
	showblog();
	//显示分类博客
	type();
	//搜索
	search();
	
	
	search_aa();

	
	
	
	$("#blog-home").click(function(){
		showblog();
	});
	
	$("#blog-tuijian").click(function(){
		$("#fenye-blog").show();
		tuijian();
	});
	
	$(".menu li").click(function() {
		$(".menu li").each(function() {
			$(this).removeClass("active");
		});
		$(this).addClass("active");
	})
});

function showblog(){
	$("#fenye-blog").show();
	BlogManager.getBlogLength(function(length){
		var n;
		if(length%8==0){
			n=length/8;
		}else{
			n = length/8+1;
		}
		n=n|0;
		console.log(n);
		var up = '<li>'+
      '<a id="up-page" href="#" aria-label="Previous">'+
        '<span aria-hidden="true">上一页</span> </a></li>';
	
     var down = '<li><a id="down-page" href="#" aria-label="Next">'+
         '<span aria-hidden="true">下一页</span></a></li>';
         
		$("#blog-page").empty();
		$("#shangyiye").html(up);
		$("#xiayige").html(down);
		$("#current-page").text("当前为第1页，总共"+n+"页");
		for(var i=1;i<=n;i++){
			$("#blog-page").append('<li><a id=page-'+i+' class="get-page" href="#">'+i+'</a></li>');
		}
		var pageId=1;
		BlogManager.getADataByPage(pageId,function(blog){
			console.log(blog);
			blog_show(blog);
		});
		
		$(".get-page").click(function(){
			$("#blog-text").empty();
			pageId= $(this).attr("id").split("-")[1];
			console.log(pageId);
			$("#current-page").text("当前为第"+pageId+"页，总共"+n+"页");
			BlogManager.getADataByPage(pageId,function(blog){
				blog_show(blog);
			});
			
		});
		
		$("#up-page").click(function(){
			
			console.log(pageId);
			if(pageId>1){
				pageId = pageId-1;
			}
			$("#current-page").text("当前为第"+pageId+"页，总共"+n+"页");
				$("#blog-text").empty();
				BlogManager.getADataByPage(pageId,function(blog){
					blog_show(blog);
				});
			
			
		});
		$("#down-page").click(function(){
			
			console.log(pageId);
			if(pageId<n){
				pageId = pageId+1;
			}
			$("#current-page").text("当前为第"+pageId+"页，总共"+n+"页");
				$("#blog-text").empty();
				BlogManager.getADataByPage(pageId,function(blog){
					blog_show(blog);
				});
			
		});
		
	
	//	$("#current-page").text("当前为第"+pageId+"页，总共"+n+"页");
		
	});
	
	
}

/*
 * 修改信息
 * 
 */
function manager_mess(name){
	$("#blog-message").click(function(){
		UserManager.getUserByName(name,function(user){
			location.href="reset.html";
		});
	});
}
	

function type(){
	BtypesManager.QueryAll(function(btype){
		//console.log(btype);
		$("#blog-type").empty();
		var h1 = '<li  class=""><a href="#"  class="mobile" >全部分类</a></li>';
		$("#blog-type").append(h1);
		for(var i=0;i<btype.length;i++){
			var h2 =  '<li class=""><a href="#" id="blog-type-'+btype[i].tid+'" class="blog-web"></a></li>';
			$("#blog-type").append(h2);
			$("#blog-type-"+btype[i].tid).text(btype[i].name);
		}
		
		$(".blog-web").click(function(){
			$("#fenye-blog").css("display","none");
			var tid = $(this).attr("id").split("-")[2];
			BtypesManager.getById(tid,function(btype){
				var blog = btype.myblog;
					blog_show(blog);
			});
			
		});
		
		
		
	});
	
} 


function blog_show(blog){
	$("#blog-text").empty();
	for(var i=0;i<blog.length;i++){
		var bid = blog[i].bid;
	//	console.log(blog.length);
		//设置日期显示格式
		var upload = blog[i].releasedate;
		var datetime = new Date();
	    datetime.setTime(upload);
	    var year = datetime.getFullYear();
	    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	    var day = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	    var date = year+"-"+month+"-"+day;
	    
	    var tr='<h1>'+
	    '<a href="#" id="blog-type1-'+bid+'" class="category" style="float:left;"></a>'+
	    '<a id="blog-title-'+bid+'" href="showBlog.html?bid='+bid+'" class="blog-title" style="float:left;"></a>'+
	    ' </h1>'+
	    ' <dl><dd id="maincontent-blog-'+bid+'" style=" float:left; font-size: 13px;line-height: 27px;widows: auto; text-align:justify;text-justify:inter-ideograph; width:68%"></dd></dl>'+
	    '<div class="about_info">'+
        '<span class="fl">'+
            '<a href="#" target="_blank" class="user_name"></a>'+
            '<span id="blog-author-'+bid+'"  class="time"></span>'+
            '<span id="blog-time-'+bid+'"  class="time"></span>'+
           ' <a href="showBlog.html?bid='+bid+'"  class="view" id=read-'+bid+'></a>'+
            '<a href="showBlog.html?bid='+bid+'" class="comment" id=comment-'+bid+'></a>'+
        '</span></div><br>';
	    $("#blog-text").append(tr);
	    $('#blog-title-'+bid).text(blog[i].title);
		//$('#maincontent-blog-'+bid).text(blog[i].maincontent);
	    $('#maincontent-blog-'+bid).html(blog[i].maincontent);
		//console.log(blog[i].maincontent);
		$('#blog-time-'+bid).text(date);
		$('#blog-author-'+bid).text("作者："+blog[i].author);
		$('#blog-type1-'+bid).text("["+blog[i].btypes.name+"]");
		$('#read-'+bid).text("阅读("+blog[i].viewed+")");
		$('#comment-'+bid).text("评论("+blog[i].commentcounts+")");
	//	console.log(blog[i].viewed);
		
	}
	
	
//	//判断是哪一个超链接被按下
//	$(".blog-title").click(function(){
//		
//		var examerId = $(this).attr("id").split("-")[2];
//		//alert(examerId);
//		location.href="showBlog.html"
//		 BlogManager.registSession(examerId,function(){
//			//  console.log(bid);
//		  });
//	});
//	
//	//判断是哪一个超链接被按下
//	$(".view").click(function(){
//		
//		var examerId = $(this).attr("id").split("-")[1];
//		//alert(examerId);
//		location.href="showBlog.html"
//		 BlogManager.registSession(examerId,function(){
//			//  console.log(bid);
//		  });
//	});
//	
//	$(".comment").click(function(){
//		
//		var d = $(this).attr("id").split("-")[1];
//		//alert(examerId);
//		location.href="showBlog.html"
//		 BlogManager.registSession(d,function(){
//			//  console.log(bid);
//		  });
//	});
	
}

//热门推荐
function tuijian(){
	BlogManager.QueryAll(function(blog){
		var n;
		if(blog.length%8==0){
			n=blog.length/8;
		}else{
			n = blog.length/8+1;
		}
		n=n|0;
		console.log(n);
		var up = '<li>'+
	      '<a id="up-page" href="#" aria-label="Previous">'+
	        '<span aria-hidden="true">上一页</span> </a></li>';
	     var down = '<li><a id="down-page" href="#" aria-label="Next">'+
	         '<span aria-hidden="true">下一页</span></a></li>';
	         
			$("#blog-page").empty();
			$("#shangyiye").html(up);
			$("#xiayige").html(down);
			$("#current-page").text("当前为第1页，总共"+n+"页");
		for(var i=1;i<=n;i++){
			$("#blog-page").append('<li><a id=page-'+i+' class="get-page" href="#">'+i+'</a></li>');
		}
		var pageId=1;
		BlogManager.paixu(pageId,function(blog){
			console.log(blog);
			blog_show(blog);
		});
		
		$(".get-page").click(function(){
			$("#blog-text").empty();
			pageId= $(this).attr("id").split("-")[1];
			console.log(pageId);
			$("#current-page").text("当前为第"+pageId+"页，总共"+n+"页");
			BlogManager.paixu(pageId,function(blog){
				blog_show(blog);
			});
			
		});
		
		$("#up-page").click(function(){
			//$("#blog-text").empty();
			console.log(pageId);
			if(pageId>1){
				pageId = pageId-1;
			}
			$("#current-page").text("当前为第"+pageId+"页，总共"+n+"页");
				$("#blog-text").empty();
				BlogManager.paixu(pageId,function(blog){
					blog_show(blog);
				});
			
		});
		$("#down-page").click(function(){
			$("#blog-text").empty();
			if(pageId<n){
				pageId = pageId+1;
			}
			$("#current-page").text("当前为第"+pageId+"页，总共"+n+"页");
			BlogManager.paixu(pageId,function(blog){
				blog_show(blog);
			});
		});
		//blog_show(blog);
	});
}



//搜索
function search(){
	$("#button-blog").click(function(){
		var sea = $("#Search-blog").val();
		if(sea!=""){
			$("#fenye-blog").css("display","none");
			UserManager.fbByname(sea,function(userblog){
				if(userblog!=null){
					var blog = userblog.blog;
					blog_show(blog);
				}
			});
			BtypesManager.findtype(sea,function(btype){
				if(btype!=null){
					var blog = btype.myblog;
					blog_show(blog);
				}
			});
			
			BlogManager.findTitle(sea,function(allBlog){
				blog_show(allBlog);
			});
		}
	});
	
}

function search_aa(){

	
	var sea = $("#Search-blog").val();
	BlogManager.findTitle(sea,function(allBlog){
		console.log(allBlog);
    //     Workaround for bug in mouse item selection
        $.fn.typeahead.Constructor.prototype.blur = function () {
            var that = this;
            setTimeout(function () { that.hide() }, 250);
        };


        $('#Search-blog').typeahead({
            source: function (query, process) {
                var results = _.map(allBlog, function (Blog) {
                    return Blog.title;
                });
                process(results);
            },

            highlighter: function (item) {
                return item;
            },

            updater: function (item) {
                console.log("'" + item + "' selected.");
                return item;
            }
       
    });

	});


//blog_show(allBlog);
	
}

