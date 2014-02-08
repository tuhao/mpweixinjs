phantom.injectJs('./bin/bootstrap.js');
var content = phantom.args[0];

var casper = require('casper').create({
	pageSettings:{
		loadImages:false,
		loadPlugins:false,
		userAgent: 'Mozilla/5.0 (Windows NT 6.1; rv:17.0) Gecko/20100101 Firefox/17.0'
	}
});

casper.options.viewportSize = {width:100,height:100};
var url = 'https://mp.weixin.qq.com';
var send_url = url + '/cgi-bin/masssendpage?t=mass/send';


casper.start(url);
casper.waitForSelector("div[class='login-panel']",
	function success(){
		this.fillSelectors('form[id="login-form"]',{
		'input[id="account"]' : "yourusername",
		'input[id="password"]' : "yourpassword"
	},false);
		this.echo("fill account and passwd");
		this.click("a[id='login_button']");
		this.capture('mpweixin1.png');
	},

	function fail(){
		this.echo("can't find login form");
	},
	2000);


casper.waitForSelector("div[id='menuBar']",
	function success(){
		this.capture('mpweixin2.png');
		var index = this.getCurrentUrl().indexOf('&');
		send_url = send_url + this.getCurrentUrl().substring(index);
		this.open(send_url);
		//this.echo(edit_url);
	},
	function fail(){
		this.echo('menu not found');
	},2000);

casper.waitForSelector("div[class='col_main']",

	function success(){
		this.echo("fill content and send...");
		this.capture('mpweixin3.png');
	},

	function fail(){
		this.echo('send text page not found');
	},2000);

casper.run(function(){
	this.echo(this.getCurrentUrl());
	this.echo('message sent').exit();
});