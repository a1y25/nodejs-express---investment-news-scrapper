var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});


router.get('/products', function() {

});

router.get('/investments', function(req, res, next) {

	var count = 0;
	var response = res;
	var news = [];


	var newsCollectionInterval = setInterval(function (){

		console.log(count, "@count....");
		
		if(count === 13){
			clearInterval(newsCollectionInterval);
			response.render("invest", {news: news});
		}

	}, 100);

	function getBankNews() {

		nepalBangladeshBank();

		//FOR NEPAL BANGLADESH BANK
		function nepalBangladeshBank() {
			console.log("craling nepal Bangladesh bank");
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

					if (title.match(/(debenture|dividend|आईपीओ|ऋणपत्र)/i)) {
						title = '<span class="ipo">' + title + '</span>';
					}

					var item = {
						title: title,
						link: link,
						date: date
					};
					newscolxn.items.push(item);
				});

				news.push(newscolxn);
				count++; //1
			});
		}
		
		nabilInvest();
		//NAVIL INVEST
		function nabilInvest() {
			console.log("nabilinvest crawling");
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

					if (title.match(/(debenture|dividend|आईपीओ|ऋणपत्र)/i)) {
						title = '<span class="ipo">' + title + '</span>';
					}

					var item = {
						title: title,
						link: link,
						date: null
					};
					newscolxn.items.push(item);
				});

				news.push(newscolxn);
				count++; //2
			});
		}




		//ARTHIKNEWS
		arthikNews();
		function arthikNews() {
			console.log("crawling arthikNews....");
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

				request('http://www.aarthiknews.com/%E0%A4%AC%E0%A5%88%E0%A4%82%E0%A4%95-%E0%A4%B5%E0%A4%BF%E0%A4%A4%E0%A5%8D%E0%A4%A4/42/Page/2', function(err, res, body) {
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
				count++; //3
			});
		}

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
		nepalShareMarket();
		function nepalShareMarket() {
			console.log("crawling nepalShareMarket.....");
			//NEPAL SHARE MARKET
			request('http://www.nepalsharemarket.com/nepalsharemarket/nepse/docs/CompanyAnnouncement.aspx', function(err, res, body) {
				var $ = cheerio.load(body);

				var newscolxn = {
					source: 'nepalsharemarket.com',
					link: 'http://www.nepalsharemarket.com/nepalsharemarket/nepse/docs/CompanyAnnouncement.aspx',
					items: []
				};

				$('span[id*=grdAnnouncement]').each(function(i, obj) {

					var title = $(obj).find('b').text();
					var link = 'http://www.nepalsharemarket.com/' + $(obj).find('a').attr('href');
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
				count++; //4
			});
		}


		nmbCapital();
		function nmbCapital() {
			console.log("crawling nmb capital .....");
			//NMB Capital
			request('http://www.nmbcapital.com.np/', function(err, res, body) {
				var $ = cheerio.load(body);

				var newscolxn = {
					source: 'NMB Capital',
					link: 'http://www.nmbcapital.com.np/',
					items: []
				};

				$('marquee p a:last-child').each(function(i, obj) {
					var title = $(obj).text();
					var link = 'http://www.nmbcapital.com.np/' + $(obj).attr('href');
					title = checkOffer(title);

					var item = {
						title: title,
						link: link,
						date: null
					};
					newscolxn.items.push(item);
				});
				news.push(newscolxn);
				count++; //5
			});
		}
		
		niblCapital();
		function niblCapital() {
			console.log("crawling nibl .....");

			//NIBL Capital
			request('http://www.niblcapital.com/news-press-release/', function(err, res, body) {
				var $ = cheerio.load(body);

				var newscolxn = {
					source: 'NIBL Capital',
					link: 'http://www.niblcapital.com/news-press-release/',
					items: []
				};

				$('.ccm-page-list-title a').each(function(i, obj) {
					var title = $(obj).text();
					var link = 'http://www.niblcapital.com' + $(obj).attr('href');
					title = checkOffer(title);

					var item = {
						title: title,
						link: link,
						date: null
					};
					newscolxn.items.push(item);
				});
				news.push(newscolxn);
				count++;  //6
			});
		}



		prabhuKist();
		function prabhuKist() {
			console.log("crawling prabhukist .....");

			//PRABHU, KIST
			request('http://www.prabhubank.com/content/category/news/', function(err, res, body) {
				$ = cheerio.load(body);

				var newscolxn = {
					source: 'PRABHU BANK (KIST)',
					link: 'http://www.prabhubank.com/content/category/news/',
					items: []
				};

				$('.boxBody_2', '.product').each(function(i, obj) {

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
				count++; //7
			});
		}


		siddarthaBank();
		function siddarthaBank() {
			console.log("crawling sidhartha .....");

			//SIDDARTHA CAPITAL
			request('http://www.siddharthacapital.com/index.php?p1=blog&p2=2&mid=15', function(err, res, body) {
				$ = cheerio.load(body);

				var newscolxn = {
					source: 'siddhartha capital',
					link: 'http://www.siddharthacapital.com/index.php?p1=blog&p2=2&mid=15',
					items: []
				};

				$('.post .content_full_size').each(function(i, obj) {

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
				count++; //8
			});
		}
		
		meroLagani();
		function meroLagani() {

			console.log("crawling meroLagani .....");

			//mero lagani
			request('http://merolagani.com/handlers/webrequesthandler.ashx?type=get_news&newsID=0&newsCategoryID=0&symbol=&page=1&pageSize=32&popular=false&includeFeatured=true', function(err, res, body) {

				var data = JSON.parse(body);

				var newscolxn = {
					source: 'mero lagani',
					link: 'http://merolagani.com/',
					items: []
				};

				data.forEach(function(obj) {
					var title = obj.newsTitle;
					var link = 'http://merolagani.com/NewsDetail.aspx?newsID=' + obj.newsID;
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
				count++; //9
				
			});
		}


		kumariBank();
		function kumariBank() {
			console.log("crawling kumaribank .....");

			//KUMARI BANK
			request('http://www.kumaribank.com/Information/news-update.html&newsId=5', function(err, res, body) {

				var $ = cheerio.load(body);

				var newscolxn = {
					source: 'Kumari Bank',
					link: 'http://www.kumaribank.com/',
					items: []
				};

				$('.content_in li').each(function(i, obj) {
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
				count++; //10
			});

		}

		shareSansar();
		function shareSansar() {

			console.log("crawling shareSansar .....");

			//sharesansar.comn
			request('http://www.sharesansar.com/listnews.php', function(err, res, body) {
				var $ = cheerio.load(body);

				var newscolxn = {
					source: 'Share Sansar',
					link: 'http://www.sharesansar.com/',
					items: []
				};

				$('.newstitlelist a').each(function(i, obj) {
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
				count++; //11
			});

		}

		machhapuchhreBank();
		function machhapuchhreBank() {

			console.log("crawling machhapuchhre .....");

			//machhapuchre bank nepal
			request('http://www.machbank.com/content/category/news-updates.html', function(err, res, body) {
				var $ = cheerio.load(body);

				var newscolxn = {
					source: 'Machhapuchre Bank',
					link: 'http://www.sharesansar.com/',
					items: []
				};

				$('.news_list').each(function(i, obj) {
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
				count++; //12
			});
		}


		aranikoBank();
		function aranikoBank() {

			console.log("crawling araniko .....");

			//araniko bank
			request('http://aranikobank.com/home/news', function(err, res, body) {
				var $ = cheerio.load(body);

				var newscolxn = {
					source: 'Araniko Bank Dhulikhel',
					link: 'http://aranikobank.com/home/news',
					items: []
				};

				$('.news_page_text').each(function(i, obj) {
					var title = $(obj).find('a').text();
					var link = $(obj).find('a').attr('href');
					var date = $(obj).find('.news_page_date').text();
					title = checkOffer(title);

					var item = {
						title: title,
						link: link,
						date: date || null
					};
					newscolxn.items.push(item);
				});

				news.push(newscolxn);
				count++; //13

			});
		}

	}
	getBankNews();

	//investment offer bold html checker
	function checkOffer(title) {
		if (title.match(/(debenture|dividend|ipo|announcement|share|agm|आईपीओ|ऋणपत्र|सेयर|बोनस|शेयर|लाभांश|certificate|invest|notice|नाफा)/i)) {
			title = '<span class="ipo">' + title + '</span>';
			return title;
		}
		return title;
	}
});



module.exports = router;