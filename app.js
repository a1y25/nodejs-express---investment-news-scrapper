var express = require('express');
var exphbs = require('express-handlebars');
var request = require('request');
var cheerio = require('cheerio');

var app = express();
var hbs = exphbs.create({});

//register engine
app.engine('handlebars', hbs.engine);
//set view engine
app.set('view engine', 'handlebars');

function checkOffer(title){
	if(title.match(/(debenture|dividend|ipo|announcement|share|agm|आईपीओ|ऋणपत्र|सेयर|बोनस|शेयर|लाभांश|certificate|invest|notice|नाफा)/i)){
		title ='<span class="ipo">'+title+'</span>';
		return title;
	}
	return title;
}

var news = [];
function getBankNews() {
	//FOR NEPAL BANGLADESH BANK

	request('http://nbbl.com.np', function(err, res, body) {
		var $ = cheerio.load(body);

		var newscolxn = {
			source: "Nepal Bangladesh Bank",
			link: "http://nbbl.com.np",
			items: []
		};

		$('.blog-post').each(function(index, obj) {

			var title = $(obj).find('.titlecol').text();
			var link = $(obj).find('.titlecol').attr('href');
			var date = $(obj).find('.post-meta li').first().text();

			if(title.match(/(debenture|dividend|आईपीओ|ऋणपत्र)/i)){
				title ='<span class="ipo">'+title+'</span>';
			}

			var item = {
				title: title,
				link: link,
				date: date
			};
			newscolxn.items.push(item);
		});

		news.push(newscolxn);
	});

	//NAVIL INVEST
	request('http://www.nabilinvest.com.np/popup%20box.php', function(err, res, body) {
		var $ = cheerio.load(body);

		var newscolxn = {
			source: 'Nabil Investment Banking Ltd.',
			link: 'http://nabilinvest.com.np',
			items: []
		};

		$('.popup a').each(function(index, obj) {
			var title = $(obj).text();
			var link = $(obj).attr('href');

			if(title.match(/(debenture|dividend|आईपीओ|ऋणपत्र)/i)){
				title ='<span class="ipo">'+title+'</span>';
			}

			var item = {
				title: title,
				link: link,
				date: null
			};
			newscolxn.items.push(item);
		});

		news.push(newscolxn);

	});

	//ARTHIKNEWS
	request('http://www.aarthiknews.com/%E0%A4%AC%E0%A5%88%E0%A4%82%E0%A4%95-%E0%A4%B5%E0%A4%BF%E0%A4%A4%E0%A5%8D%E0%A4%A4/42', function(err, res, body) {
		var $ = cheerio.load(body);

		var newscolxn = {
			source: 'Arthik News',
			link: 'http://www.aarthiknews.com',
			items: []
		};

		$('.news-title').each(function(index, obj) {
			var title = $(obj).text();
			var link = $(obj).attr('href');
			var date = $(obj).parent().next().text();

			title = checkOffer(title);
			var item = {
				title: title,
				link: link,
				date: date
			};
			newscolxn.items.push(item);
		});

		request('http://www.aarthiknews.com/%E0%A4%AC%E0%A5%88%E0%A4%82%E0%A4%95-%E0%A4%B5%E0%A4%BF%E0%A4%A4%E0%A5%8D%E0%A4%A4/42/Page/2',function(err, res, body){
			var $ = cheerio.load(body);

			$('.news-title').each(function(index, obj) {
				var title = $(obj).text();
				var link = $(obj).attr('href');
				var date = $(obj).parent().next().text();

				title = checkOffer(title);
				var item = {
					title: title,
					link: link,
					date: date
				};
				newscolxn.items.push(item);
			});

		});

		news.push(newscolxn);
	});

	//MEGA BANK
	/*request('http://www.megabanknepal.com/', function(err, res, body) {
		var $ = cheerio.load(body);

		var newscolxn = {
			source: 'Mega Bank',
			link: 'http://www.megabanknepal.com/',
			items: []
		};

		//news is inside script
		var script = $('script').eq(9).html();
		var links = script.match(/<a.+?(a>)/g);

		links.forEach(function(obj){
			var title = $(obj).text();
			var link = 'http://www.megabanknepal.com/'+$(obj).attr('href');
			title = checkOffer(title);

			var item = {
				title: title,
				link: link,
				date: null
			};
			newscolxn.items.push(item);

		});

		news.push(newscolxn);
	});
*/

	//NEPAL SHARE MARKET
	request('http://www.nepalsharemarket.com/nepalsharemarket/nepse/docs/CompanyAnnouncement.aspx', function(err, res, body) {
		var $ = cheerio.load(body);

		var newscolxn = {
			source: 'nepalsharemarket.com',
			link: 'http://www.nepalsharemarket.com/nepalsharemarket/nepse/docs/CompanyAnnouncement.aspx',
			items: []
		};

		$('span[id*=grdAnnouncement]').each(function(i, obj){

			var title = $(obj).find('b').text();
			var link = 'http://www.nepalsharemarket.com/'+$(obj).find('a').attr('href');
			var date = $(obj).parent().parent().prev().text();
			title = checkOffer(title);

			var item = {
				title: title,
				link: link,
				date: date
			};
			newscolxn.items.push(item);

		});

		news.push(newscolxn);
	});

	//NMB Capital
	request('http://www.nmbcapital.com.np/', function(err, res, body) {
		var $ = cheerio.load(body);

		var newscolxn = {
			source: 'NMB Capital',
			link: 'http://www.nmbcapital.com.np/',
			items: []
		};

		$('marquee p a:last-child').each(function(i, obj){
			var title = $(obj).text();
			var link = 'http://www.nmbcapital.com.np/'+$(obj).attr('href');
			title = checkOffer(title);

			var item = {
				title: title,
				link: link,
				date: null
			};
			newscolxn.items.push(item);
		});
		news.push(newscolxn);
	});

	//NIBL Capital
	request('http://www.niblcapital.com/news-press-release/', function(err, res, body) {
		var $ = cheerio.load(body);

		var newscolxn = {
			source: 'NIBL Capital',
			link: 'http://www.niblcapital.com/news-press-release/',
			items: []
		};

		$('.ccm-page-list-title a').each(function(i, obj){
			var title = $(obj).text();
			var link = 'http://www.niblcapital.com'+$(obj).attr('href');
			title = checkOffer(title);

			var item = {
				title: title,
				link: link,
				date: null
			};
			newscolxn.items.push(item);
		});
		news.push(newscolxn);
	});

	//PRABHU, KIST
	request('http://www.prabhubank.com/content/category/news/',function(err, res, body){
		$ = cheerio.load(body);

		var newscolxn = {
			source: 'PRABHU BANK (KIST)',
			link: 'http://www.prabhubank.com/content/category/news/',
			items: []
		};

		$('.boxBody_2','.product').each(function(i,obj){

			var title = $(obj).find('a').text();
			var link = $(obj).find('a').attr('href');
			var date = $(obj).find('.date').text();
			title = checkOffer(title);

			var item = {
				title: title,
				link: link,
				date: date || null
			};
			newscolxn.items.push(item);
		});

		news.push(newscolxn);
	});


	//SIDDARTHA CAPITAL
	request('http://www.siddharthacapital.com/index.php?p1=blog&p2=2&mid=15',function(err, res, body){
		$ = cheerio.load(body);

		var newscolxn = {
			source: 'siddhartha capital',
			link: 'http://www.siddharthacapital.com/index.php?p1=blog&p2=2&mid=15',
			items: []
		};

		$('.post .content_full_size').each(function(i,obj){

			var title = $(obj).find('h3').text();
			var link = $(obj).find('a').attr('href');
			var date = $(obj).find('.post_detail').text();
			title = checkOffer(title);

			var item = {
				title: title,
				link: link,
				date: date || null
			};
			newscolxn.items.push(item);
		});

		news.push(newscolxn);
	});

	//mero lagani
	request('http://merolagani.com/handlers/webrequesthandler.ashx?type=get_news&newsID=0&newsCategoryID=0&symbol=&page=1&pageSize=32&popular=false&includeFeatured=true',function(err, res, body){

		var data = JSON.parse(body);

		var newscolxn = {
			source: 'mero lagani',
			link: 'http://merolagani.com/',
			items: []
		};

		data.forEach(function(obj){
			var title = obj.newsTitle;
			var link = 'http://merolagani.com/NewsDetail.aspx?newsID='+obj.newsID;
			var date = new Date(obj.newsDateAD).toDateString();
			title = checkOffer(title);

			var item = {
				title: title,
				link: link,
				date: date || null
			};
			newscolxn.items.push(item);
		});

		news.push(newscolxn);
	});

	//KUMARI BANK
	request('http://www.kumaribank.com/Information/news-update.html&newsId=5',function(err, res, body){

		var $ = cheerio.load(body);

		var newscolxn = {
			source: 'Kumari Bank',
			link: 'http://www.kumaribank.com/',
			items: []
		};

		$('.content_in li').each(function(i,obj){
			var title = $(obj).text();
			var link = $(obj).find('a').attr('href');
			title = checkOffer(title);

			var item = {
				title: title,
				link: link,
				date: null
			};
			newscolxn.items.push(item);
		});

		news.push(newscolxn);
	});

	//sharesansar.comn
	request('http://www.sharesansar.com/listnews.php', function(err,res,body){
		var $ = cheerio.load(body);

		var newscolxn = {
			source: 'Share Sansar',
			link: 'http://www.sharesansar.com/',
			items: []
		};

		$('.newstitlelist a').each(function(i,obj){
			var title = $(obj).text();
			var link = "http://www.sharesansar.com/" + $(obj).attr('href');
			title = checkOffer(title);

			var item = {
				title: title,
				link: link,
				date: null
			};

			newscolxn.items.push(item);
		});

		news.push(newscolxn);
	});

	//machhapuchre bank nepal
	request('http://www.machbank.com/content/category/news-updates.html', function(err,res,body){
		var $ = cheerio.load(body);

		var newscolxn = {
			source: 'Machhapuchre Bank',
			link: 'http://www.sharesansar.com/',
			items: []
		};

		$('.news_list').each(function(i,obj){
			var title = $(obj).find('a').text();
			var link = $(obj).find('a').attr('href');
			var date = $(obj).find('.rt').text();
			title = checkOffer(title);

			var item = {
				title: title,
				link: link,
				date: date || null
			};

			newscolxn.items.push(item);
		});

		news.push(newscolxn);
	});


	request('http://aranikobank.com/home/news', function(err,res,body){
		var $ = cheerio.load(body);

		var newscolxn = {
			source: 'Araniko Bank Dhulikhel',
			link: 'http://aranikobank.com/home/news',
			items: []
		};

		$('.news_page_text').each(function(i,obj){
			var title = $(obj).find('a').text();
			var link =  $(obj).find('a').attr('href');
			var date = $(obj).find('.news_page_date').text();
			title = checkOffer(title);

			var item = {
				title: title,
				link: link,
				date: date || null
			};
			newscolxn.items.push(item);
		});

		console.log(newscolxn);

		news.push(newscolxn);
	});

}
getBankNews();



app.get('/', function(req, res) {
	res.render('index', {
		news: news
	});
});

var server = app.listen(3300,function (req,res){

	 var host = server.address().address;
  	var port = server.address().port;

  	console.log('App listening at http://%s:%s', host, port);

});
//use nodemon server instead...