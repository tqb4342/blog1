$(document).ready(function(){

	showResourceTypes();
	
	//不同用户资源管理模块显示不同
	UserManager.checkSession(function(username){
		var user=username.split("*")[0];
		if(user=="admin"){
			$("#resource-manage").append("<li id='add-resourcetype' class='list-group-item'><a href='javascritp:void(0);'>目录新增</a></li>" +
			"<li id='delete-resourcetype' class='list-group-item'><a href='javascritp:void(0);'>目录删除</a></li>" +
			"<li id='delete-resources' class='list-group-item'><a href='javascritp:void(0);'>资源删除</a></li>");
			//目录新增
			$("#add-resourcetype").click(function(){
				var addText="<legend>目录新增</legend>" +
						"<div class='control-group'>" +
								"<label class='control-label' for='input01'>请输入你想添加的资源类型名：</label>" +
										"<div class='controls'>" +
												"<input type='text' class='input-xlarge' id='addrtname'>" +
														"<p class='help-block'>请输入简介明白的词语，方便其他人理解" +
										"</div>" +
						" </div>" +
						"<div class='form-actions'>" +
							"<button type='submit' class='btn btn-primary' id='do-add-resourcetype'>确认增加</button>" +
							"<button class='btn' id='cancel'>取消</button>" +
							"<label class='control-label' for='input01' id='addrtmsg'></label>" +
							"<button class='btn' id='return'>返回</button>" +
						" </div>";
				$("#show").html(addText);
				
				$("#cancel").click(function(){
					$("#addrtname").val("");
				});
				
				$("#return").click(function(){
					location.reload();
				});
				
				$("#do-add-resourcetype").click(function(){
					addResourceType();
				});
				
				
			});
			
			
			//目录删除
			$("#delete-resourcetype").click(function(){
				var deleteText="<legend>目录删除</legend>" +
				"请选择分类：" +
				"		<select id='choose-resourcetype'>" +
				"		</select>" +
				"		<label class='control-label' for='input01' id='upload-msg' style='color:red'></label><br/><br/><br/>" +
				"<button type='submit' class='btn btn-primary' id='do-delete-resourcetype'>确认删除</button></br><br/>" +
				
				"<button class='btn' id='return1'>返回</button>" +
				"<label class='control-label' for='input01' id='delrtmsg'></label>" +
				" </div>";
				ResourceTypeManager.getAll(function(resourceTypes){
					for(var i=0;i<resourceTypes.length;i++){
						$("#choose-resourcetype").append("<option value="+resourceTypes[i].rtname+">"+resourceTypes[i].rtname+"</option>");
						
					}
				});
				
				$("#show").html(deleteText);
				
	
				
				
				
				$("#do-delete-resourcetype").click(function(){
					deleteResourceType();
					ResourceTypeManager.getAll(function(resourceTypes){
						for(var i=0;i<resourceTypes.length;i++){
							$("#choose-resourcetype").append("<option value="+resourceTypes[i].rtname+">"+resourceTypes[i].rtname+"</option>");
						}
					});
					
					$("#show").html(deleteText);
					$("#return1").click(function(){
						
						location.reload();
					});
				});
				
				$("#return1").click(function(){
					
					location.reload();
				});
				
			});
			
			//资源删除
			$("#delete-resources").click(function(){
				$("#show").html(resourceText);
				$("#change").html("选择");
				ResourceManager.getAll(function(resources){
					for(var i=0;i<resources.length;i++){
						$("#resources").append("<tr><td>"
													+(i+1)+"</td><td>"
													+resources[i].rname+"</td><td>"
													+resources[i].uploader+"</td><td>"
													+resources[i].uploaddate+"</td><td>"+resources[i].resourcetype.rtname+"</td><td>" 
													+"<label class='demo--label'>" +
													"	<input class='demo--radio' type='checkbox' name='checkbox' value='"+resources[i].rname+"'>" +
													"	<span class='demo--checkbox demo--radioInput'></span>" +
													"</label></td></tr>");
						
					}
					});
				
				
				$("#show").append(buttonText);
				
				//全选
				$("#get-all-chooses").click(function(){
					$("input[name='checkbox']").prop('checked',true);
				});
				//取消
				$("#undo-all-chooses").click(function(){
					$("input[name='checkbox']").prop('checked',false);
				});
				
				//反选   
				$("#get-opposite-chooses").click(function(){   
					$("input[name='checkbox']").each(function(){
						$(this).prop("checked",!$(this).prop("checked"));
					})   
				});
				
				//删除选中的内容
				$("#get-selected-chooses").click(function(){//输出选中的值   
					$("input[name='checkbox']").each(function(){   
						if($(this).prop("checked")){
							
							var rname=$(this).val();
							ResourceManager.deleteResource($(this).val(),function(flag){
								if(flag){
									
									var urlString='RemoveFileServlet?rname='+rname;
							        $.ajax({

							            url : urlString,

							            type : 'GET',

							            //data : formData,
							            
							            async: true, 
							            
							            cache: false,

							            contentType : false, 

							            processData : false,

							            success : function(data) {
							            },

							            error : function(data) {
							            }

							        });
									$("#delete-msg").text("删除成功");
									$("#show").html(resourceText);
									ResourceManager.getAll(function(resources){
										for(var i=0;i<resources.length;i++){
											$("#resources").append("<tr><td>"
																		+(i+1)+"</td><td>"
																		+resources[i].rname+"</td><td>"
																		+resources[i].uploader+"</td><td>"
																		+resources[i].uploaddate+"</td><td>"+resources[i].resourcetype.rtname+"</td><td>" 
																		+"<label class='demo--label'>" +
																		"	<input class='demo--radio' type='checkbox' name='checkbox' value='"+resources[i].rname+"'>" +
																		"	<span class='demo--checkbox demo--radioInput'></span>" +
																		"</label></td></tr>");
											
										}
										});
									
									
									$("#show").append(buttonText);
								}
								else{
									$("#delete-msg").text("删除失败");
								}
							});
						}else{
						}
					}) 
				}) ;
				
				
			});
			
		}
	
	});
	
	

	
	//上传资源
	$("#upload-resource").click(function(){
		//表单中enctype="multipart/form-data"的意思，是设置表单的MIME编码。只有使用了multipart/form-data，才能完整的传递文件数据，进行下面的操作. 
		//enctype="multipart/form-data"是上传二进制数据; form里面的input的值以2进制的方式传过去。
		var uploadText="<form id='upload' method='post' enctype='multipart/form-data'>" +
				"	<legend>上传文件</legend>" +
				"		<div class='control-group' id='upload-box'>" +
					"		<div class='uploader blue'>" +
					"			<input type='text' class='filename' readonly='readonly'/>" +
					"			<input type='button'  class='button' value='浏览'/>" +
					"			<input type='file' name='file' size='50' id='upload-input' multipart/>" +
					"		</div>" +
				"		</div><br/>" +
				"请选择分类：" +
				"		<select id='choose-resourcetype'>" +
				"			<option value='0'>---请选择---</option>" +
				"		</select>" +
				"		<label class='control-label' for='input01' id='upload-msg' style='color:red'></label><br/><br/><br/>" +
				"		<div>" +
				"			<label id='upload-tip'>*上传文件大小不能超过300M</label>"+
				"			</br></br><button type='button' class='btn btn-warning' id='confirmUpload'>确认上传</button>" +
				"		</div>" +
				"<label class='control-label' for='input01' id='succ-or-failure'></label></br><br/>" +
				"<a href='resource.html'>返回</a>"+
				"</form>";
		
		$("#show").html(uploadText);
		
		//显示文件类型
		ResourceTypeManager.getAll(function(resourceTypes){
			for(var i=0;i<resourceTypes.length;i++){
				$("#choose-resourcetype").append("<option value="+resourceTypes[i].rtname+">"+resourceTypes[i].rtname+"</option>");
			}
		});
		
		$(function(){
			//将路径放到input type=text中
			$("input[type=file]").change(function(){$(this).parents(".uploader").find(".filename").val($(this).val());});
			$("input[type=file]").each(function(){
			if($(this).val()==""){$(this).parents(".uploader").find(".filename").val("请添加文件");}
			});
		});
		
		$('#confirmUpload').click(function(){
			//改上传者
			UserManager.checkSession(function(username){
			var user=username.split("*")[0];
			var uploader=user;
			var rname=$("#upload-input").val();
			var rname=new String(rname);
			rname=rname.substring(rname.lastIndexOf("\\")+1);
			rtname=$("#choose-resourcetype").val();
			
			if(rname==""){
				$("#upload-msg").text("请选择文件！！！");
				return;
			}else if(rtname=="0"){
				$("#upload-msg").text("请选择分类");
				return;
			}else{
				$("#confirmUpload").attr("disabled",true);
				$("#succ-or-failure").html("正在上传...");
				var urlString='UploadServlet?rname='+rname+'&uploader='+uploader+'&rtname='+rtname;
				var formData = new FormData($('#upload')[0]);
		        $.ajax({

		            url : urlString,

		            type : 'POST',

		            data : formData,
		            
		            async: true, 
		            
		            cache: false,

		            contentType : false, 

		            processData : false,

		            success : function(data) {
		            	$("#succ-or-failure").text(data);
		            },

		            error : function(data) {
		            	$("#succ-or-failure").text(data);
		            }

		        });
				
				
			}
	        
			});

		});
		
	});
	
	//搜索框
	var searchText="<div class='well form-search'>" +
						"请输入关键字：<br/>"+
						"<input type='text' class='input-medium search-query' id='keywords'>" +
						"<button type='button' class='btn' id='search-resource'>搜索</button>" +
					"</div>" +
					"<div id='search-results'></div>"
	$("#show").append(searchText);
	$("#search-resource").click(function(){
		showResourcesByName($("#keywords").val());
	});

	//搜索资源按钮
	
	$("#search-resource-btn").click(function(){
		$("#show").html(searchText);
		$("#search-resource").click(function(){
			showResourcesByName($("#keywords").val());
		});
		
	});
	
	//全部资源
	$("#all-resource").click(function(){
		
		showResources();
	});
	
	
	//我上传的资源
	$("#my-resource").click(function(){
		var user="";
		UserManager.checkSession(function(username){
		user=username.split("*")[0];
		
		$("#show").html(resourceText);
			ResourceManager.getResourcesByUploader(user,function(resources){
				for(var i=0;i<resources.length;i++){
					$("#resources").append("<tr><td>"+(i+1)+"</td><td><a href='#' class='download'>"
												+resources[i].rname+"</td><td>"
												+resources[i].uploader+"</td><td>"
												+resources[i].uploaddate+"</td><td>"+resources[i].resourcetype.rtname+"</td>" +
												"<td><button type='button' id='preview%"+resources[i].rname+"#"+resources[i].lunname+"' class='btn btn-success'>预览</button></td></tr>");
				}
				
				//实现预览
				$(".btn").click(function(){
					var rname="";
					var lunname="";
					var last = $(this).attr("id").split("#")[0];
					//for(var i=1;i<last.split("-").length;i++){
					//	rname += last.split("-")[i];
					//	rname += "-";
					//}
					rname = last.split("%")[1];
					
					var suffix = rname.split(".")[1].toLowerCase();
					
					if(suffix=="docx"||suffix=="doc"||suffix=="txt"||suffix=="ppt"||suffix=="pptx"||suffix=="pdf"||suffix=="xls"||suffix=="xlsx"){
						Preview(rname,lunname);
					}else{
						if(suffix=="jpg"||suffix=="png"||suffix=="gif"){
							var url = "showtupian.html?blogResources/"+rname;
							location.href=url;
						}else{
							alert("只能预览文字和图片文件！");
						}
					}
					
					
				})
				
				$(".download").click(function(){
					//location.href="DownloadServlet?filename=test.txt";
					var filename=$(this).html();
					url="DownloadServlet?filename="+filename;
					location.href=url;
				});
			});
			
			
		});
	});
	
	
	
	
});


var resourceText=
	"<table class='table'>" +
	"	<thead>" +
	"		<tr>" +
	"			<th>序号</th>" +
	"			<th>资源名</th>" +
	"			<th>上传者</th>" +
	"			<th>上传日期</th>" +
	"			<th>分类</th>" +
	"			<th id='change'>预览</th>" +
	"		</tr>" +
	"	</thead>" +
	"	<tbody id='resources'>" +
	"	</tbody>" +
	"</table>";

var buttonText="<button class='btn btn-primary' id='get-all-chooses'>全选</button>&nbsp&nbsp&nbsp&nbsp"+
"<button class='btn btn-primary' id='undo-all-chooses'>取消</button>&nbsp&nbsp&nbsp&nbsp"+
"<button class='btn btn-primary' id='get-opposite-chooses'>反选</button>&nbsp&nbsp&nbsp&nbsp"+
"<button class='btn btn-primary' id='get-selected-chooses'>确认删除</button>" +
"<label class='control-label' for='input01' id='delete-msg'></label>";

//显示资源类型列表
function showResourceTypes(){
		ResourceTypeManager.getAll(function(resourceTypes){
		for(var i=0;i<resourceTypes.length;i++){
			$("#resource-types").append("<li class='list-group-item' onclick='showResourcesByType(this.innerText);'><a href='javascritp:void(0);'>"
					+resourceTypes[i].rtname+"</a></li>");
			
		}
		
		
	});
	
}

//按类型划分资源函数
function showResourcesByType(rtname){
	
		$("#show").html(resourceText);
		ResourceManager.getResourcesByType(rtname,function(resources){
			for(var i=0;i<resources.length;i++){
				$("#resources").append("<tr><td>"+(i+1)+"</td><td><a href='#' class='download'>"
											+resources[i].rname+"</a></td><td>"
											+resources[i].uploader+"</td><td>"
											+resources[i].uploaddate+"</td><td>"
											+resources[i].resourcetype.rtname+"</td>" +
											"<td><button type='button' id='preview%"+resources[i].rname+"#"+resources[i].lunname+"' class='btn btn-success'>预览</button></td></tr>");
				
			}
			
			//实现预览
			$(".btn").click(function(){
				var rname="";
				var lunname="";
				var last = $(this).attr("id").split("#")[0];
				//for(var i=1;i<last.split("-").length;i++){
				//	rname += last.split("-")[i];
				//	rname += "-";
				//}
				rname = last.split("%")[1];
			
				
				lunname = $(this).attr("id").split("#")[1];
				//alert(rname+rname);
				var suffix = rname.split(".")[1].toLowerCase();
			
				if(suffix=="docx"||suffix=="doc"||suffix=="txt"||suffix=="ppt"||suffix=="pptx"||suffix=="pdf"||suffix=="xls"||suffix=="xlsx"){
					Preview(rname,lunname);
				}else{
					if(suffix=="jpg"||suffix=="png"||suffix=="gif"){
						var url = "showtupian.html?blogResources/"+rname;
						location.href=url;
					}else{
						alert("只能预览文字和图片文件！");
					}
				}
				
				
			})
			
			$(".download").click(function(){
				//location.href="DownloadServlet?filename=test.txt";
				var filename=$(this).html();
				url="DownloadServlet?filename="+filename;
				location.href=url;
			});
			
		});
		
		
}


//按资源名获取资源函数
function showResourcesByName(rname){
	$("#search-results").html("");
		$("#search-results").append(resourceText);
		ResourceManager.getResourcesByName(rname,function(resources){
			for(var i=0;i<resources.length;i++){
				$("#resources").append("<tr><td>"+(i+1)+"</td><td><a href='#' class='download'>"
											+resources[i].rname+"</td><td>"
											+resources[i].uploader+"</td><td>"
											+resources[i].uploaddate+"</td><td>"+resources[i].resourcetype.rtname+"</td>" +
											"<td><button type='button' id='preview-"+resources[i].rname+"#"+resources[i].lunname+"' class='btn btn-success'>预览</button></td></tr>");
			}
			
			//实现预览
			$(".btn").click(function(){
				var rname="";
				var lunname="";
				var last = $(this).attr("id").split("#")[0];
				//for(var i=1;i<last.split("-").length;i++){
				//	rname += last.split("-")[i];
				//	rname += "-";
				//}
				rname = last.split("%")[1];
				
				var suffix = rname.split(".")[1].toLowerCase();
				alert(suffix);
				if(suffix=="docx"||suffix=="doc"||suffix=="txt"||suffix=="ppt"||suffix=="pptx"||suffix=="pdf"||suffix=="xls"||suffix=="xlsx"){
					Preview(rname,lunname);
				}else{
					if(suffix=="jpg"||suffix=="png"||suffix=="gif"){
						var url = "showtupian.html?blogResources/"+rname;
						location.href=url;
					}else{
						alert("只能预览文字和图片文件！");
					}
				}
				
				
			})
			
			$(".download").click(function(){
				//location.href="DownloadServlet?filename=test.txt";
				var filename=$(this).html();
				url="DownloadServlet?filename="+filename;
				location.href=url;
			});
		});
}

//新增资源类型
function addResourceType(){
	var rtname=$("#addrtname").val();
	ResourceTypeManager.insertResourceType(rtname,function(flag){
		if(flag){
			$("#addrtmsg").text("插入成功");
		}
		else{
			$("#addrtmsg").text("插入失败");
		}
	});
	
}

//删除资源类型
function deleteResourceType(){
	var rtname=$("#choose-resourcetype").val();
	//移除该目录下的文件
	ResourceManager.getResourcesByType(rtname,function(resources){
		for(var i=0;i<resources.length;i++){
			
			var urlString='RemoveFileServlet?rname='+resources[i].rname;
	        $.ajax({

	            url : urlString,

	            type : 'GET',

	            //data : formData,
	            
	            async: true, 
	            
	            cache: false,

	            contentType : false, 

	            processData : false,

	            success : function(data) {
	            },

	            error : function(data) {
	            }

	        });
			
		}
		
		$(".download").click(function(){
			//location.href="DownloadServlet?filename=test.txt";
			var filename=$(this).html();
			url="DownloadServlet?filename="+filename;
			location.href=url;
		});
		
	});
	ResourceTypeManager.deleteResourceType(rtname,function(flag){
		if(flag){
			$("#delrtmsg").text("删除成功");
		}
		else{
			$("#delrtmsg").text("您输入的目录名不存在");
		}
	});
	
}



//显示资源列表resources
function showResources(){
		
		loadTable();
		loadFooter();
		pageButton();
		footerUpdata(pageCurrent);

}
var pageCurrent=1;
//分页
var fenye="<div id='show-page' class='table-foot'>" +
			"	<span id='prePage' class='pageNumber ye'>上一页</span>" +
			"	<div id='pageBox' style='display:inline-block'></div>" +
			"	<span id='nextPage' class='pageNumber ye'>下一页</span>" +
			"</div>";

//显示页体 
function loadTable(){
	$("#show").html(resourceText);
	
	ResourceManager.getResourcesByPage(parseInt(pageCurrent),function(resources){
		for(var i=0;i<resources.length;i++){
			$("#resources").append("<tr><td>"+(i+1)+"</td><td><a href='#' class='download'>"
										+resources[i].rname+"</td><td>"
										+resources[i].uploader+"</td><td>"
										+resources[i].uploaddate+"</td><td>"+resources[i].resourcetype.rtname+"</td>" +
										"<td><button type='button' id='preview-"+resources[i].rname+"#"+resources[i].lunname+"' class='btn btn-success'>预览</button></td></tr>");
		}
		
		//实现预览
		$(".btn").click(function(){
			var rname="";
			var lunname="";
			var last = $(this).attr("id").split("#")[0];
			//for(var i=1;i<last.split("-").length;i++){
			//	rname += last.split("-")[i];
			//	rname += "-";
			//}
			rname = last.split("%")[1];
			lunname = $(this).attr("id").split("#")[1];
			
			var suffix = rname.split(".")[1].toLowerCase();
			
			if(suffix=="docx"||suffix=="doc"||suffix=="txt"||suffix=="ppt"||suffix=="pptx"||suffix=="pdf"||suffix=="xls"||suffix=="xlsx"){
				Preview(rname,lunname);
			}else{
				if(suffix=="jpg"||suffix=="png"||suffix=="gif"){
					var url = "showtupian.html?blogResources/"+rname;
					location.href=url;
				}else{
					alert("只能预览文字和图片文件！");
				}
			}
			
			
		})
		
		
		$(".download").click(function(){
			//location.href="DownloadServlet?filename=test.txt";
			var filename=$(this).html();
			url="DownloadServlet?filename="+filename;
			location.href=url;
		});
		
		
		
	});
	
	var totalCount="";
	
	ResourceManager.getResourcesCount(function(data){
		totalCount=data;
		ResourceManager.getPageCount(function(pageCount){
		$("#show").append("当前是第"+pageCurrent+"页，共"+pageCount+"页，共"+totalCount+"条记录。");
		});
	});
	
	
}


//预览文件
function Preview(rname,lunname){
	ResourceManager.Preview(rname,lunname,function(swfpath){
		var url = "documentView.jsp?swfpath="+swfpath;
		location.href=url;
	})
}



//显示页码数
function loadFooter(){
	$("#show").append(fenye);
	ResourceManager.getPageCount(function(data){
		var start = $('#pageBox');
		pageCount = data;
		if(data > 10){
			for( var i = 1; i <= 10; i++){
				start.append('<span class="pageNumber ye page">'+i+'</span>');
			}
		}else{
			for( var i = 1; i <= data; i++){
				start.append('<span class="pageNumber ye page">'+i+'</span>');
			}
		}

		$('.page').on('click', function(){
			pageCurrent = $(this).text();
			 showResources();
			
		});
	});
}

//页号按钮
function pageButton(){
	$('#prePage').on('click',function(){
		var pageNum = parseInt(pageCurrent);
		if(pageNum === 1){
			alert("当前为第一页");
		}else{
			pageNum--;
			pageCurrent = pageNum;
			 showResources();
		}

	});
	$('#nextPage').on('click',function(){
		var pageNum = parseInt(pageCurrent);
		if(pageNum === pageCount){
			alert("当前为最后一页");
		}else{
			pageNum++;
			pageCurrent = pageNum;
			 showResources();
		}
	});
}

 function footerUpdata(page){
//	console.log(result.table.pageCount);
//	console.log(page-result.table.pageCount);
	if(parseInt(pageCurrent) > 10 && page >= 7){
		if(parseInt(pageCurrent) >= (parseInt(page)+4)){
			var len = page-5;
			for(var i = 0;i < 10; i++){
				$('.page').eq(i).text(len);
				$('.page').eq(i).addClass('pageNumber').removeClass('currentPage');
				len++;
			}
			$('.page').eq(5).addClass('currentPage').removeClass('pageNumber');
		}else{
			for(var i = 0;i < 10; i++){
				$('.page').eq(i).addClass('pageNumber').removeClass('currentPage');
			}
			$('.page').eq(page-parseInt(pageCurrent)).addClass('currentPage').removeClass('pageNumber');
		}
	}else{
		for(var i = 0;i < 10; i++){
			$('.page').eq(i).text(i+1);
			$('.page').eq(i).addClass('pageNumber').removeClass('currentPage');
		}
		$('.page').eq(page-1).addClass('currentPage').removeClass('pageNumber');
	}
}