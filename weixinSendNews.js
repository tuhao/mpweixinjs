phantom.injectJs('./bin/bootstrap.js');

var casper = require('casper').create({
	pageSettings:{
		loadImages:false,
		loadPlugins:false,
		userAgent: 'Mozilla/5.0 (Windows NT 6.1; rv:17.0) Gecko/20100101 Firefox/17.0'
	}
});

casper.options.viewportSize = {width:100,height:100};
var url = 'https://mp.weixin.qq.com';
var edit_url = url + '/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=10&isMul=0&isNew=1';

casper.start(url);
casper.waitForSelector("div[class='login-panel']",
	function success(){
		this.fillSelectors('form[id="login-form"]',{
		'input[id="account"]' : "user",
		'input[id="password"]' : "passwd"
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
		edit_url = edit_url + this.getCurrentUrl().substring(index);
		this.open(edit_url);
		//this.echo(edit_url);
	},
	function fail(){
		this.echo('menu not found');
	},2000);

casper.waitForSelector("div[class='col_main']",

	function success(){
		this.fillSelectors('div[class="appmsg_editor"]',{
		'input[class="frm_input js_title"]' : "美食",
		'input[class="frm_input js_author"]' : "网络"
	},false);
		this.echo("fill title and source");
		this.capture('mpweixin3.png');
	},

	function fail(){
		this.echo('edit page not found');
	},2000);

casper.run(function(){
	this.echo(this.getCurrentUrl());
	this.echo('message sent').exit();
});