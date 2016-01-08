var eatz = eatz || {};

eatz.utils = {
    loadTemplates: function (views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (eatz[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    eatz[view].prototype.template = _.template(data);
                }));
            } else {
                console.log(view + " not found");
            }
        });
				
        $.when.apply(null, deferreds).done(callback);
    },

		showValidationError: function(InputId, ErrMsg) {
		
						var controlGroup = $('input[name='+InputId+']');
						controlGroup.parent().find('.help-inline').text(ErrMsg);
		},
				
		clearValidationError: function(InputId) {
						var controlGroup = $('input[name='+InputId+']');
						controlGroup.parent().find('.help-inline').text('');
		},
		uploadFile : function (fr,  callback) {
			console.log (fr);
			
			var fd = new FormData();    
			fd.append( 'files', fr );

			$.ajax({
			  url: '/dishes/image',
			  data: fd,
			  processData: false,
			  contentType: false,
			  type: 'POST',
			  success: function(data){
				console.log (data);

				eatz.pubSub.trigger('updateview', data);
			  }
			});
		},
		showNotice: function(type, msg){
		$("#notification-bar").addClass('alert-message '+type);
		$("#notification-bar p").text(msg);
		$('#notification-bar').show();
			},
		hideNotice: function(){
		$("#notification-bar").removeAttr('class');
		$("#notification-bar").attr('class', '');
		$('#notification-bar')[0].className = '';
		$('#notification-bar').hide();
		}	


}
