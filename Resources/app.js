// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
var socialize = {};
var echo = Titanium.API.debug
var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});
win1.open();
var window = win1

Ti.include('lib/jquery/jquery-1.5-vsdoc.js');
Ti.include('lib/sha1.js');
Ti.include('lib/oauth.js');
Ti.include('lib/socialize.js');

sAPI = socialize.API({
	oauth_key:'747a34c9-a482-48a2-b946-4363cf9c8759',
	oauth_secret:'46d212f7-17f4-464c-a9b1-679db3bc5d25',
});

//sAPI.clearTokens();

if(sAPI.getTokenSecret() == null || sAPI.getToken() == null){
	//sAPI.autenticate();
    sAPI.anonymousAuthentication({udid: 'HarpsAwesomeID'})
    alert(sAPI.getTokenSecret());	
}
//alert(sAPI.getToken());

if(!true)
{
    var entity = sAPI.activity();
}

if(true)
{
    var entity = sAPI.createEntity([{
        key:"http://www.coppede.org",
        name:"Coppede Site"
    }]);
    echo(entity)
    alert(entity)
}

if (!true) {
    var entity = sAPI.setEntity([{
    	key:'http://www.coppede.org',
    	name:'Coppede Site'
    }]);
};
