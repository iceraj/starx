define( function() {
	return {
		configure: function(config) {
			var html = "<iframe src='http://star.mit.edu/media/uploads/star/html/orf/app.html' style='width:800px;height:800px; border:0px;overflow:none'></iframe>";
			$('#'+config.element_id).html( html ) ;
		}
	}
});