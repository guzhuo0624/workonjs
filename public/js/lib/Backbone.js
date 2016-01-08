(function init() {
         
 var csrf_token;
     
$.get("/", function(res, status, xhr){
	csrf_token = xhr.getResponseHeader("X-CSRF-Token");
});

var CSRF_HEADER = 'X-CSRF-Token';

  jQuery.ajaxPrefilter(function(options, _, xhr) {
  	
    if ( !xhr.crossDomain && options.type!=="get") 
        xhr.setRequestHeader(CSRF_HEADER, csrf_token);
  });
     


}());