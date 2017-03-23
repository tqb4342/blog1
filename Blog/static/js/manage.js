var teacherNumber = null;
var teacherId = null;
$(document).ready(function(){
	TeacherManager.checkSession(function(teacher){
		if(teacher!=null){
			var old = $("#manage-teachername-a").html();
			$("#manage-teachername-a").html(teacher.name+old);
			teacherNumber = teacher.number;
			teacherId = teacher.id
			$("#modifyteacher-name-input").val(teacher.name);
			$("#modifyteacher-password-input").val(teacher.password);
			loadExamlist();
		}else{
			location.href="sessionError.html";
		}
	});
	//增加试题
	$("#manage-addquestion-button").click(function(){
		$("#manage-questionlist-div").hide();
		$("#manage-addquestion-div").fadeIn();
	});
	//增加数量
	$("#addexam-titleno-minus").click(function(){
		var number =parseInt( $("#addexam-titleno-input").val());
		if(number==0){
			return;
		}
		$("#addexam-titleno-input").val(number-1);
	});
	//减少数量
	$("#addexam-titleno-plus").click(function(){
		var number = parseInt($("#addexam-titleno-input").val());
		$("#addexam-titleno-input").val(number+1);
	});

	// 增加考试的模态框
	$(".addexam-cancel").click(function(){
		$("#addexam-name-input").val("");
		$("#addexam-titleno-input").val("");
	});

	$("#addexam-ok-button").click(function(){
		var name = $("#addexam-name-input").val();
		var titleno = $("#addexam-titleno-input").val();
		if(name==""||titleno==""){
			if(name==""){
				$("#addexam-name-input").addClass("red-border");
			}
			if(titleno==""){
				 $("#addexam-titleno-input").addClass("red-border");
			}
			return;
		}
		ExamManager.add(name, parseInt(titleno), function(examid){
			loadExamlist();
			$("#addexam-name-input").val("");
			$("#addexam-titleno-input").val("");
			$("#addexam").modal('hide')
		});
	});
	//修改老师的模态框
	$("#modifyteacher-ok-button").click(function(){
		var name = $("#modifyteacher-name-input").val();
		var password = $("#modifyteacher-password-input").val();
		if(name==""||password==""){
			if(name==""){
				$("#modifyteacher-name-input").addClass("red-border");
			}
			if(password==""){
				$("#modifyteacher-password-input").addClass("red-border");
			}
		}else{
			TeacherManager.modify(teacherId, teacherNumber, name, password, function(examid){
				var list = $("#teacher-list");
				$("#manage-teachername-a").text(name);
				$("#manage-teachername-a").append(list);
				$("#modifyteacher").modal('hide');
				TeacherManager.removeUserSession();
				TeacherManager.registSession(teacherNumber);
			});
		}
	});
	$(".modifyteacher-cancel").click(function(){
		TeacherManager.get(teacherId, function(teacher){
			$("#modifyteacher-name-input").val(teacher.name);
			$("#modifyteacher-password-input").val(teacher.password);
		});
	});
	//返回到考试列表
	$("#manage-return-button").click(function(){
		loadExamlist();
		$("#exam-content").hide();
		$("#manage-examlist-div").fadeIn();
	});
	//返回到考生列表
	$("input[name='manage-returnexamer-input']").click(function(){
		$("#manage-examtitle-div").hide();
		$("#manage-addexamer-div").hide();
		$("#manage-examerlist-div").fadeIn();
	});
	//退出当前帐号
	$("#manage-logoff-a").click(function(){
		TeacherManager.removeUserSession(function(){
			location.href = "teacher.html";
		});
	});
});


//加载考试列表
function loadExamlist(){
	ExamManager.getByTeacher(function(examlist){
		$("#manage-examlist-div tbody").empty();
		for(var i=0;i<examlist.length;i++){
			var examId = examlist[i].id;
			var upload = examlist[i].upload.format("yyyy-MM-dd hh:mm:ss");
			var tr='<tr id="exam-'+examId+'">'+
                  '<td>'+upload+'</td>'+
                  '<td>'+examlist[i].name+'</td>'+
                  '<td>'+examlist[i].selected+'</td>'+
                  '<td>'+
                  		'<span id="read-'+examId+'" class="glyphicon glyphicon-align-left hand read" aria-hidden="true"></span>'+
                  '</td>'+
                  '<td>'+
                      '<span id="delexam-'+examId+'"class="glyphicon glyphicon-trash hand delexam" aria-hidden="true"></span>'+
                  '</td>'+
                  '<td id="switch-'+examId+'-td">'+
                      '<div class="switch"><input id="switch-'+examId+'" class="switch-input" type="checkbox"/></div>'+
                  '</td>'+
              '</tr>';
	        $("#manage-examlist-div tbody").append(tr);
	    	// 考试状态控制按钮
	        $(".switch-input").bootstrapSwitch();
			$(".switch div").addClass("bootstrap-switch-mini");
			if(examlist[i].enable){
//				 $("#switch-"+examId+"-div").bootstrapSwitch('toggleState');
				 $("#switch-"+examId).bootstrapSwitch("state", true);
			}else{
//				 $("#switch-"+examId+"-div").bootstrapSwitch('toggleState');
			     $("#switch-"+examId).bootstrapSwitch('state', false);
			}
			$('#switch-'+examId+'-td').on({
		        'switchChange.bootstrapSwitch': function(event, state) {
		        	var eid = $(this).attr("id").split("-")[1];
		            // 按钮状态发生改变
		        	ExamManager.enable(eid, state);
		        }
		    })
		}
		//删除考试
		$(".delexam").click(function(){
			var examId = $(this).attr("id").split("-")[1];
			modalComfirm("你确定要删除该场考试？", function(){
				ExamManager.remove(examId);
				$("#exam-"+examId).remove();
			});
		});
		// 显示考试的详细内容
		$(".read").click(function(){
			var eid = $(this).attr("id").split("-")[1];
			//下载考生
			$("#download-examer").unbind("click");
			$("#download-examer").click(function(){
				location.href="ExamServlet?task=download&eid="+eid;
				console.log(examId+" "+eid);
			});
			ExamManager.get(eid, function(exam){
				$("#manage-examname-input").val(exam.name);
				$("#manage-examtitle-input").val(exam.selected);
				ExamerManager.getExamerCount(eid,function(count){
					$("#manage-examercount-span").text(count);
				});
				QuestionManager.getCountByExam(eid,function(count){
					$("#manage-titlecount-span").text(count);
				});
				$("#manage-examlist-div").hide();
				$("#exam-content").fadeIn();
				showQuestion(eid);
				addQuestion(eid);
				showExamers(eid);
				//显示学生列表
				$("#manage-addexamer-input").unbind("click");
				$("#manage-addexamer-input").click(function(){
					$("#manage-stuhead-input").prop("checked",false);
					showStudents(eid);
					$("#manage-examerlist-div").hide();
					$("#manage-addexamer-div").fadeIn();
				});
				//修改考试基本信息
				$("#manage-updateinfo-button").unbind("click");
				$("#manage-updateinfo-button").click(function(){
					$(this).attr("disabled","true");
					if($("#manage-examname-input").attr("readonly")){
						$("#manage-examname-input").removeAttr("readonly");
						$("#manage-examtitle-input").removeAttr("readonly");
						$("#manage-examinfosubmit-button").removeAttr("disabled");
					}else{
						$("#manage-examname-input").attr("readonly","true");
						$("#manage-examtitle-input").attr("readonly","true");
						$("#manage-examinfosubmit-button").attr("disabled","true");
					}
				});
				$("#manage-examinfosubmit-button").unbind("click");
				$("#manage-examinfosubmit-button").click(function(){
					var newName = $("#manage-examname-input").val();
					var newTitleno = $("#manage-examtitle-input").val();
					if(newName==""||newTitleno==""){
						if(newName==""){
							$("#manage-examname-input").addClass("red-border");
						}
						if(newTitleno==""){
							$("#manage-examtitle-input").addClass("red-border");
						}
					}else{
						ExamManager.modify(eid, newName, newTitleno,function(){
							$("#manage-examname-input").attr("readonly","true");
							$("#manage-examtitle-input").attr("readonly","true");
							$("#manage-examinfosubmit-button").attr("disabled","true");
							$("#manage-updateinfo-button").removeAttr("disabled");
						});
						
					}
				});
			});
		});
	});
}



//显示考生列表
function showExamers(eid){
	$("#load-examer").empty();
	ExamerManager.getByExam(eid,function(examers){
		$("#manage-examerlist-div tbody").empty();
		for(var i=0;i<examers.length;i++){
			var state = null;
			if(examers[i].stat){
				state = "已登录";
			}else{
				state = "未登录";
			}
			var list = '<tr id="'+examers[i].erid+'">'+
	                        '<td>'+examers[i].number+'</td>'+
	                        '<td>'+examers[i].name+'</td>'+
	                        '<td>'+examers[i].password+'</td>'+
	                        '<td>'+examers[i].className+'</td>'+
	                        '<td>'+state+'</td>'+
	                        '<td>'+examers[i].mark+'</td>'+
	                        '<td>'+
	                            '<span id="answersheet-'+examers[i].erid+'" class="glyphicon glyphicon-list hand" aria-hidden="true"></span>'+
	                        '</td>'+
	                        '<td>'+
	                            '<span id="delexamer-'+examers[i].erid+'"class="glyphicon glyphicon-trash hand delexamer" aria-hidden="true"></span>'+
	                        '</td>'+
	                    '</tr>';
	        $("#manage-examerlist-div tbody").append(list);
	        //显示考生答卷
	        $("#answersheet-"+examers[i].erid).click(function(){
	        	var examerId = $(this).attr("id").split("-")[1];
	        	showExamerAnswer(examerId,eid);
	        	$("#manage-examerlist-div").hide();
				$("#manage-examtitle-div").fadeIn();
	        });
		}
		//删除考生
		$(".delexamer").click(function(){
			var examerId = $(this).attr("id").split("-")[1];
			modalComfirm("你确定要删除该考生？", function(){
				ExamerManager.remove(examerId);
				$("#"+examerId).remove();
			});
		});
	});
}



//显示学生
function showStudents(eid){
	StudentManager.getAll(function(students){
		$("#manage-addexamer-div tbody").empty();
		for (var i = 0; i < students.length; i++) {
			var list = '<tr id=""'+students[i].id+'>'+
		                    '<td><input id="student-'+students[i].id+'" class="addOrdelete" type="checkbox"/></td>'+
		                    '<td>'+students[i].number+'</td>'+
		                    '<td>'+students[i].name+'</td>'+
		                    '<td>'+students[i].classname+'</td>'+
		                '</tr>';
	    	$("#manage-addexamer-div tbody").append(list);
		}
		//取消按钮
		$("#addexamer-ok-input").unbind("click");
		$("#addexamer-cancel-input").click(function(){
			$("#manage-addexamer-div").hide();
			$("#manage-examerlist-div").fadeIn();
		});
		//确认按钮
		$("#addexamer-ok-input").unbind("click");
		$("#addexamer-ok-input").click(function(){
			loading();
			var addExamer=new Array();
			for(var j = 0; j<$(".addOrdelete").length; j++){
				var idName = $(".addOrdelete").eq(j).attr("id");
    			if($("#"+idName+":checked").val()){
    				addExamer.push(idName.split("-")[1]);
    			}
			}
			ExamerManager.addExamers(addExamer, eid, function(list){
				showExamers(eid);
				$("#manage-addexamer-div").hide();
				$("#manage-examerlist-div").fadeIn();
				$("#loadingModal").modal("hide");
			});
		});
		//学生列表全选反选按钮
		$("#manage-stuhead-input").click(function(){
			var checked = $("#manage-stuhead-input:checked").val();
			if(!checked){
				for(var i = 0; i<$(".addOrdelete").length; i++){
					var idName = $(".addOrdelete").eq(i).attr("id");
					$("#"+idName).prop("checked",false);
				}
			}else{
				for(var i = 0; i<$(".addOrdelete").length; i++){
					var idName = $(".addOrdelete").eq(i).attr("id");
					$("#"+idName).prop("checked",true);
				}
			}
		});
		//单个学生是否选中
		$(".addOrdelete").click(function(){
    		var flag = true;
    		for(var j = 0; j<$(".addOrdelete").length; j++){
    			var idName = $(".addOrdelete").eq(j).attr("id");
    			if(!$("#"+idName+":checked").val()){
    				flag = false;
    				break;
    			}
    		}
    		if(flag){
    			$("#manage-stuhead-input").prop("checked",true);
    		}else{
    			$("#manage-stuhead-input").prop("checked",false);
    		}
    	});
	});
	//搜索学生
	$("#search-button").click(function(){
		var keyword = $("#search-input").val();
		StudentManager.search(keyword, function(students){
			$("#manage-addexamer-div tbody").empty();
			for (var i = 0; i < students.length; i++) {
				var list = '<tr id=""'+students[i].id+'>'+
			                    '<td><input id="student-'+students[i].id+'" class="addOrdelete" type="checkbox"/></td>'+
			                    '<td>'+students[i].number+'</td>'+
			                    '<td>'+students[i].name+'</td>'+
			                    '<td>'+students[i].classname+'</td>'+
			                '</tr>';
		    	$("#manage-addexamer-div tbody").append(list);
			}
		});
	});
}



//显示题目
function showQuestion(eid){
	ExamManager.get(eid,function(exam){
		$("#question-examname-span").text(exam.name+"的题库");
	});
	$("#question-nav").empty();
	$("#questions").empty();
	QuestionManager.getByExam(eid,function(questions){
		for(var i=0; i<questions.length;i++){
			var li ='<li>'+ '<a  href="#question-'+questions[i].qid+'">'+questions[i].title+'</a>'+ '</li>';
			var question = '<div id="question-'+questions[i].qid+'" class="panel panel-default tab-pane in">'+
					            '<div class="panel-heading">'+
					                '<div id="question-'+i+'" class="bs-example tooltip-demo">'+
					                    '<p class="bs-example-tooltips">'+questions[i].title+'</p>'+
					                '</div>'+
					                '<div class="panel-body">'+
					                    '<p>'+questions[i].content+'</p>'+
					                '</div>'+
					                '<div class="tooltip-demo panel-foot"> '+                         
					                    '<div class="row">'+
					                        '<input id="del-'+questions[i].qid+'" class="btn btn-danger col-sm-12 delquestion" type="button" value="删除题目">'+
					                    '</div>'+
					                '</div>'+
					            '</div>'+
					        '</div>';
			$("#questions").append(question);
			$("#question-nav").append(li);
			var p ='<p class="no">第'+(i+1)+'题</p>';
			$("#question-"+i).append(p);
		}
		$(".delquestion").click(function(){
			var id =  $(this).attr("id").split("-")[1];
			modalComfirm("你确定要删除该题目？", function(){
				QuestionManager.remove(id);
				$("#question-"+id).remove();
			});
		});
	});
}

//增加考试题目
function addQuestion(eid){
	$("#addquestion-clear-input").click(function(){
		showQuestion(eid);
		$("#manage-questionlist-div").fadeIn();
		$("#manage-addquestion-div").hide();
		$("#addquestion-title-input").val("");
		$("#addquestion-content-div").html("");
	});
	$("#addquestion-ok-input").unbind("click");
	$("#addquestion-ok-input").click(function(event){
		var title = $("#addquestion-title-input").val();
		var content = $("#addquestion-content-div").html();
		QuestionManager.add(title,content,eid,function(){
			showQuestion(eid);
			$("#manage-questionlist-div").fadeIn();
			$("#manage-addquestion-div").hide();
			$("#addquestion-title-input").val("");
			$("#addquestion-content-div").html("");
		});
		event.stopPropagation();
	});
}
//显示考生答卷
function showExamerAnswer(examerId, examId){
	ExamerManager.get(examerId, function(examer){
		$("#Examer-answer-name").text(examer.name+"的答卷");
	});
	AnswerManager.findAnswerByExamerId(examerId, function(answers){
		$("#examer-answers").empty();
		$("#answer-nav").empty();
		for(var i=0;i<answers.length;i++){
			var answerId = answers[i].id;
			var description = answers[i].description;
			var mark = answers[i].mark;
			dwr.engine.setAsync(false);
			QuestionManager.get(answers[i].qid, function(question){
				var li ='<li>'+ '<a  href="#answer-'+answerId+'">'+question.title+'</a>'+ '</li>';
				var state = answers[i].answerstate;
				var answer = '<div id="answer-'+answerId+'"class="panel panel-default tab-pane in">'+
							            '<div class="panel-heading">'+
						                '<div id="answer-'+i+'" class="bs-example tooltip-demo">'+
						                    '<p class="">'+question.content+'</p>'+
						                '</div>'+
						            '</div>'+
						                '<div class="panel-body">'+
						                    '<p>'+description+'</p>'+
						                '</div>'+
						                '<div class="tooltip-demo panel-foot"> '+                     
						                    '<div class="row">'+
						                    	'<input id="downloadanswer-'+answerId+'" class="btn btn-success col-sm-2 load-answer" type="button" value="下载文件">'+
						                    	'<span class="col-sm-5"></span>'+
						                        '<input  id="markok-'+answerId+'" class="btn btn-primary col-sm-2 givemark" type="button" value="确认评分">'+
						                        '<div class="input-group col-sm-3">'+
						                            '<span class="input-group-addon glyphicon glyphicon-plus hand upmove1" ></span>'+
						                            '<input id="mark-'+answerId+'" type="text" class="form-control" placeholder="'+mark+'"/>'+
						                           ' <span class="input-group-addon glyphicon glyphicon-minus hand upmove1" ></span>'+
						                        '</div>'+
						                    '</div>'+
						                '</div>'+
						            '</div>'+
						        '</div>';
				$("#examer-answers").append(answer);
				$("#answer-nav").append(li);
				var p ='<p class="no">第'+(i+1)+'题</p>';
				$("#answer-"+i).append(p);
				$("#markok-"+answerId).click(function(event){
					var ansId =  $(this).attr("id").split("-")[1];
					var mark = $("#mark-"+ansId).val();
					AnswerManager.giveMark(ansId, mark,  function(){
						ExamerManager.jiSuanMark(examerId);
						alert("评分成功！");
						showExamers(examId);
					});
				});
				if(state==1){
					$("#downloadanswer-"+answerId).replaceWith('<P style="text-align:center; color:red; font-weight:bold;">该考生没有上传文件！</p>');				
				}else{
					$("#downloadanswer-"+answerId).click(function(){
						var ansId =  $(this).attr("id").split("-")[1];
						location.href="AnswerServlet?task=download&eid="+examId+"&erid="+examerId+"&aid="+ansId;
					});
				}
			});
			dwr.engine.setAsync(true);
		}
	});
}


