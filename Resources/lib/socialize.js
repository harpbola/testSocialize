socialize.API = function(_args) {

    if (!_args) {
        _args = {};
    }

    var api = {

        AUTH_TOKEN: null,
        AUTH_TOKEN_SECRET: null,
        OAUTH_KEY: null,
        OAUTH_SECRET: null,
        url: 'http://api.getsocialize.com/v1/',

        /* create the oauth request */
        create_request: function(_args) {

            var request = {
                action: _args.url,
                method: _args.method,
                parameters: _args.payload
            };

            if(request.method == 'POST') {
                request.parameters = {
                    "payload" : JSON.stringify(request.parameters)
                }
            } else if (request.method == 'PUT') {
                request.parameters = {};
                request.action = url +'?payload=' + JSON.stringify(request.parameters);
            }

            var accessor = {
                token: this.getToken(),
                tokenSecret: this.getTokenSecret(),
                consumerKey : this.OAUTH_KEY,
                consumerSecret: this.OAUTH_SECRET
            };

            if(request.action.indexOf('/authenticate/') > 0) {
                accessor.token = '';
                accessor.tokenSecret = '';
            }

            OAuth.completeRequest(request, accessor);
            OAuth.SignatureMethod.sign(request, accessor);
            return request
        },
        execute_request : function(request) {
            var headers = '';
            var parameters = request.parameters
            var oauth_headers = {}
            // for https request, send the oauth through the request body
            if(request.action.indexOf('https') == 0) {

            } else {
                for (var key in parameters) {
                    value = parameters[key]
                    if(key.indexOf('oauth_') == -1)
                        continue
                    if(headers != '') {
                        headers += ', ';
                    }
                    headers += key +'="'+ value +'"';
                    parameters[key] = undefined
                }
                oauth_headers = {
                    'Authorization' : 'OAuth ' + headers
                }

                // If it is an authenticate request, we want to have a user-agent
                if(request.action.indexOf('/authenticate/') > 0) {
                    oauth_headers['User-Agent'] = 'Android-10/HTCIncredible SocializeSDK/v1.0.0; en_US'
                }
            }

            // make the request over http
            //echo("Updated parameters: ")
            //echo(parameters);
            var xhr = Titanium.Network.createHTTPClient();
            xhr.setTimeout(10000);
            xhr.open(request.method, request.action, false);
            xhr.setRequestHeader('Authorization', 'OAuth ' + headers)
            xhr.setRequestHeader('Accent', 'application/json')
            //xhr.send({"payload" : '[{"help" : "hi""}]'});
            if(request.method == 'POST') {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
                xhr.send({
                    "payload" : request.parameters.payload
                })
            } else {
                xhr.send()
            }

            if (xhr.status < 300) {
                var response = JSON.parse(xhr.responseText);
                return response
            } else {
                this.print_xhr(xhr)
                return false;
            }
        },
        setTokens: function(_args) {
            Ti.App.Properties.setString('oauth_token_secret', _args.oauth_token_secret);
            Ti.App.Properties.setString('oauth_token', _args.oauth_token);
        },
        print_xhr : function(xhr) {
            var text = 'status ' + xhr.status + '\n';
            text += 'connected ' + xhr.connected + '\n';
            text += 'readyState ' + xhr.readyState + '\n';
            text += 'responseText ' + xhr.responseText + '\n';
            text += 'responseData ' + xhr.responseData + '\n';
            text += 'connectionType ' + xhr.connectionType + '\n';
            text += 'location ' + xhr.location + '\n';
            echo(text);
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
        autenticate: function() {
            var payload = {};
            payload.udid = Titanium.Platform.id;
            var accessor = {
                tokenSecret: null,
                consumerSecret: this.OAUTH_SECRET
            };
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
            this.print_xhr(xhr);
            if (xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                this.setTokens({
                    oauth_token:response.oauth_token,
                    oauth_token_secret:response.oauth_token_secret
                });

            } else {
                this.clearTokens();
            }

            return;
        },
        setEntity: function(_args) {
            var payload = _args;
            var accessor = {
                tokenSecret: this.getTokenSecret(),
                consumerSecret: this.OAUTH_SECRET
            };
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

            } else {
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
        
        
        anonymousAuthentication : function(_args) {
            var http_request = this.create_request({
                'payload': _args,
                'url' : this.url+'authenticate/',
                'method' : 'POST'
            });
            response_json = this.execute_request(http_request)
            if(!response_json)
                return;
            this.setTokens({
                oauth_token: response_json.oauth_token,
                oauth_token_secret: response_json.oauth_token_secret
            });
        },
        
        activity: function(_args) {
            var http_request = this.create_request({
                'payload': _args,
                'url' : this.url+'activity/',
                'method' : 'GET'
            });
            return this.execute_request(http_request)
        },
        
        createEntity: function(_args) {

            var http_request = this.create_request({
                'payload': _args,
                'url' : this.url+'entity/',
                'method' : 'POST'
            });
            response_json = this.execute_request(http_request)
            return response_json
        },
        
        init: function(_parms) {
            this.OAUTH_KEY = _parms.oauth_key;
            this.OAUTH_SECRET = _parms.oauth_secret;
            if (_parms.auth_token) {
                this.AUTH_TOKEN = _parms.auth_token;
                this.AUTH_TOKEN_SECRET = _parms.auth_token_secret;
                this.setTokens({
                    oauth_token: this.AUTH_TOKEN,
                    oauth_token_secret: this.AUTH_TOKEN_SECRET
                });
            };
        },
    };

    api.init(_args);

    return api;

}