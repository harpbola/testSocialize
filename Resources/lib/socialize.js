socialize.API = function(_args){
	
	if (!_args) {
		_args = {};
	}
	
	var api = {
		
		AUTH_TOKEN: null,
		AUTH_TOKEN_SECRET: null,
		OAUTH_KEY: null,
		OAUTH_SECRET: null,
		authUrl: 'https://api.getsocialize.com/v1/authenticate/',	
		url: 'http://api.getsocialize.com/v1/',

		setTokens: function(_args) {
			Ti.App.Properties.setString('oauth_token_secret', _args.oauth_token_secret);
			Ti.App.Properties.setString('oauth_token', _args.oauth_token);
		},

		getToken: function() {
			return Ti.App.Properties.getString('oauth_token');
		},
		
		getTokenSecret: function() {
			return Ti.App.Properties.getString('oauth_token_secret');
		},
		
		clearTokens: function() {
			Ti.App.Properties.removeProperty('oauth_token_secret');
			Ti.App.Properties.removeProperty('oauth_token');
		},
		
		autenticate: function(){
			var payload = {};
				payload.udid = Titanium.Platform.id;
			var accessor = {tokenSecret: null,consumerSecret: this.OAUTH_SECRET};	
			var message = {
			        method: "POST",
			        action: this.authUrl,
			        parameters: [
			            ['oauth_signature_method', 'HMAC-SHA1'],
			            ['oauth_consumer_key', this.OAUTH_KEY],
			            ['oauth_version', '1.0'],
			        ]
			    };	
			    
			OAuth.setTimestampAndNonce(message);
    		OAuth.setParameter(message, "oauth_timestamp", OAuth.timestamp());
    		OAuth.setParameter(message, "payload", JSON.stringify(payload));
    		OAuth.SignatureMethod.sign(message, accessor);
    		
    		var postingUrl = OAuth.addToURL(message.action, message.parameters);
    		
    
    		var xhr = Titanium.Network.createHTTPClient();  		
    		xhr.setTimeout(10000);
		    xhr.open('POST', postingUrl,false);
		    xhr.send();
		    if (xhr.status == 200) {
		    	var response = JSON.parse(xhr.responseText);
		    	this.setTokens({
					oauth_token:response.oauth_token,
					oauth_token_secret:response.oauth_token_secret
				});

		    }else{
		    	this.clearTokens();
		    }	
		   
		    return;
		},
		
		setEntity: function(_args){
			var payload = _args;
			var accessor = {tokenSecret: this.getTokenSecret(), consumerSecret: this.OAUTH_SECRET};	
			var message = {
			        method: "POST",
			        action: this.url+'entity/',
			        parameters: [
			            ['oauth_signature_method', 'HMAC-SHA1'],
			            ['oauth_consumer_key', this.OAUTH_KEY],
			            ['oauth_version', '1.0'],
			        ]
			    };	
			    
			OAuth.setTimestampAndNonce(message);
    		OAuth.setParameter(message, "oauth_timestamp", OAuth.timestamp());
    		OAuth.setParameter(message, "payload", JSON.stringify(payload));
    		OAuth.SignatureMethod.sign(message, accessor);
    		
    		var postingUrl = OAuth.addToURL(message.action, message.parameters);
    		
    		alert(message);
    		var xhr = Titanium.Network.createHTTPClient();  		
    		xhr.setTimeout(10000);
		    xhr.open('POST', postingUrl,false);
		    xhr.send();
		    if (xhr.status == 200) {
		    	
		    	var text = 'status ' + xhr.status + '\n';
				text += 'connected ' + xhr.connected + '\n';
				text += 'readyState ' + xhr.readyState + '\n';
				text += 'responseText ' + xhr.responseText + '\n';
				text += 'responseData ' + xhr.responseData + '\n';
				text += 'connectionType ' + xhr.connectionType + '\n';
				text += 'location ' + xhr.location + '\n';
		    	alert(text);
		    	

		    }else{
		    	var text = 'status ' + xhr.status + '\n';
				text += 'connected ' + xhr.connected + '\n';
				text += 'readyState ' + xhr.readyState + '\n';
				text += 'responseText ' + xhr.responseText + '\n';
				text += 'responseData ' + xhr.responseData + '\n';
				text += 'connectionType ' + xhr.connectionType + '\n';
				text += 'location ' + xhr.location + '\n';
		    	alert(text);

		    }	
		   
		    return;
		},
		
		init: function(_parms) {
			
  			this.OAUTH_KEY = _parms.oauth_key;
  			this.OAUTH_SECRET = _parms.oauth_secret;
  		},
  		
  		
	};
	
	
	
	api.init(_args);
	
	return api;	
	
}
