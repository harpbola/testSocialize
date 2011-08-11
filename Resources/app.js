// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
var socialize = {};

var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});
win1.open();

Ti.include('lib/sha1.js');
Ti.include('lib/oauth.js');
Ti.include('lib/socialize.js');

sAPI = socialize.API({
	oauth_key:'b9824034-3696-4d77-a0ff-cda8e3c2501e',
	oauth_secret:'687c564f-79f0-437b-b6fa-6a010c482e79'
});

sAPI.clearTokens();

if(sAPI.getTokenSecret() == null || sAPI.getToken() == null){
	sAPI.autenticate();	
}
alert(sAPI.getTokenSecret());
alert(sAPI.getToken());

var entity = sAPI.setEntity({
	key:'http://www.coppede.org',
	name:'Coppede Site'
});
//sAPI.autenticate();

