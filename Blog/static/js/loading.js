var loadModal='<div class="modal " id="loadingModal" tabindex="-1">'+
								'<div class="modal-dialog">'+
									'<div class="modal-content">'+
										'<div class="modal-header ">'+
											'<h4 class="modal-title">加载中</h4>'+
										'</div>'+
										'<div class="modal-body">'+
											'<center><img src="./static/images/loading.gif"></center>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';
function loading(){
	$("body").append(loadModal);
	$("#loadingModal").modal("show");
}