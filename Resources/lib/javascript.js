var accessor = {
	  token: getValue('oauth_token'),
	  tokenSecret: getValue('oauth_token_secret'),
	  consumerKey : getValue('consumer_key'),
	  consumerSecret: getValue('consumer_secret')
	};
	
	if(url.indexOf('/authenticate/') > 0)
	{
		accessor.token = '';
		accessor.tokenSecret = '';
	}
	
	var request = {
	  action: url,
	  method: getValue('http_method'),
	  parameters: JSON.parse( getValue('payload') )
	};
	if(request.method == 'POST')
	{
		request.parameters = {"payload" : getValue('payload')}
		//request.parameters = {"payload" : '{"udid": "0123456789abcdef"}' }
		//request.parameters = {"payload":"{\"udid\":\"0123456789abcdef\"}"}
	}
	else if (request.method == 'PUT')
	{
		request.parameters = {};
		request.action = url +'?payload=' + getValue('payload');
	}
	OAuth.completeRequest(request, accessor);        
	OAuth.SignatureMethod.sign(request, accessor);