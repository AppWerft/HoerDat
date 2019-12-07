module.exports = [
		{
			station : 'radioermitage',
			stream : 'http://91.190.117.131:8000/live',
			name : "Радио Эрмитаж",
			color : '#F1352F',
			textcolor: "white",
			meta : {
				
			}
		},
		{
			station : 'classicpraha',
			stream : 'http://icecast8.play.cz/classic128.mp3',
			name : "Classic Praha",
			color : '#ffffff',
			meta : {
				
			}
		},
		
		{
			station : 'ceskyrozhlas',
			stream : 'http://icecast1.play.cz/crojazz128.mp3',
			name : "Český rozhlas",
			color : '#3F91AB',
			textcolor: '#fff',
			meta : {
				
			}
		},
		
		{
			station : 'swr2',
			stream : 'http://swr-swr2-live.cast.addradio.de/swr/swr2/live/mp3/256/stream.mp3',
			name : "SWR 2",
			color : '#00BAE5',
			meta : {
				type : "HTML",
				radiotext : true,
				live : 'https://www.swr.de/cache/onair/swr2webradio.json'
			}
		},
		{
			station : 'swr4',
			stream : 'http://swr-swr4-fr.cast.addradio.de/swr/swr4/fr/mp3/128/stream.mp3',
			name : "SWR 4",
			color : '#00BAE5',

		},
		{
			station : 'ndr1radiomv',
			stream : 'https://ndr-ndr1radiomv-schwerin.sslcast.addradio.de/ndr/ndr1radiomv/schwerin/mp3/128/stream.mp3',
			name : "NDR1 Radio MV",
			color : '#00BAE5',
			meta : {
				playlist : 'https://www.ndr.de/public/radioplaylists/ndr1radiomv.json'
			}

		},
		{
			station : 'ndr1niedersachsen',
			stream : 'https://ndr-ndr1niedersachsen-hannover.sslcast.addradio.de/ndr/ndr1niedersachsen/hannover/mp3/128/stream.mp3',
			name : "NDR1 Radio Niedersachsen",
			color : '#163F87',
			meta : {
				playlist : 'https://www.ndr.de/public/radioplaylists/ndr1niedersachsen.json'
			}

		},
		{
			station : 'wdr3',
			stream : 'http://wdr-wdr3-live.icecast.wdr.de/wdr/wdr3/live/mp3/256/stream.mp3?ar-distributor=ffa1',
			name : "Westdeutscher Rundfunk 3",
			color : '#D5D000',
			charset : 'latin-1',
			meta : {
				type : 'PLAIN',
				radiotext : true,
				live : 'https://www.wdr.de/radio/radiotext/streamtitle_wdr3.txt'
			}
		},
		{
			station : 'wdr5',
			name : "WDR 5",
			stream : 'http://wdr-wdr5-live.icecast.wdr.de/wdr/wdr5/live/mp3/128/stream.mp3?ar-distributor=ffa1',
			charset : 'latin-1',
			color : '#7FBA42',
			meta : {
				type : 'PLAIN',
				radiotext : true,
				live : 'https://www.wdr.de/radio/radiotext/streamtitle_wdr5.txt'
			}
		},
		{
			station : 'wdreinslive',
			name : "1Live radio",
			stream : 'http://wdr-wdr5-live.icecast.wdr.de/wdr/wdr5/live/mp3/128/stream.mp3?ar-distributor=ffa1',
			charset : 'latin-1',
			color : '#7FBA42',
			meta : {
				type : 'PLAIN',
				radiotext : true,
				live : 'https://www.wdr.de/radio/radiotext/streamtitle_1live.txt'
			}
		},
		{
			station : 'orfoe1',
			name : "Radio Österreich 1",
			stream : 'http://mp3stream3.apasf.apa.at:8000',
			color : '#B73924',
			textcolor: '#ffffff',
			meta : {
				type : 'OE',
				radiotext : true,
				highlights : 'https://audioapi.orf.at/oe1/api/json/current/highlights',
				current : 'https://audioapi.orf.at/oe1/api/json/current/live'
			}
		},
		{
			station : 'srf2',
			name : 'Radio SRF 2 Kultur',
			charset : "LATIN-1",
			color : '#B42A69',
			textcolor: '#ffffff',
			stream : 'http://stream.srg-ssr.ch/m/drs2/mp3_128',
			charset : 'latin-1',
			meta : {
				type : 'SRF',
				radiotext : true,
				nowandnext : 'https://www.srf.ch/play/radio/now-and-next/c8537421-c9c5-4461-9c9c-c15816458b46'
			}
		},
		{
			station : 'srf1',
			name : 'Radio SRF 1',
			charset : 'latin-1',
			color : '#FF7C00',
			textcolor: '#ffffff',
			stream : 'http://stream.srg-ssr.ch/m/drs1/mp3_128',
			meta : {
				radiotext : true,
				type : "SRF",
				webcam : 'https://www.srf.ch/webcams/radio-srf-1',
				nowandnext : 'https://www.srf.ch/play/radio/now-and-next/69e8ac16-4327-4af4-b873-fd5cd6e895a7'
			}
		},
		{
			station : 'swissclassic',
			name : 'Radio Swiss Classic',
			textcolor: '#ffffff',
			stream : 'http://stream.srg-ssr.ch/m/rsc_de/mp3_128',
			color : '#00AEE0'
		},
		{
			station : 'radioswissjazz',
			name : 'Radio Swiss Jazz',
			textcolor: '#ffffff',
			stream : 'http://stream.srg-ssr.ch/m/rsj/mp3_128',
			color : '#FABE2B'
		},
		{
			station : 'sr2',
			name : 'Saarländischer Rundfunk 2',
			stream : 'http://sr.audiostream.io/sr/1010/mp3/128/sr2',
			charset : 'latin-1',
			color : '#FFCB0B',
			meta : {
				radiotext : true,
				type : "SR",
				live : 'https://www.sr-mediathek.de/json/mc_sr2_audio_live.php'
			}
		},
		{
			station : 'br2',
			name : 'BayernRundfunk II',
			stream : 'http://br-br2-nord.cast.addradio.de/br/br2/nord/mp3/128/stream.mp3',
			color : '#F17E02'

		},
		{
			station : 'brklassik',
			name : 'BR Klassik',
			stream : 'https://br-brklassik-live.sslcast.addradio.de/br/brklassik/live/mp3/128/stream.mp3',
			color : '#EE2439',
			meta : {
				type : 'BR',
				live : 'https://www.br-klassik.de/programm/livestream/br-klassik-audio-livestream-100~radioplayer.json'
			}

		},
		{
			station : 'ndrkultur',
			name : "NDR Kultur",
			color : '#9C341D',
			stream : "http://ndr-ndrkultur-live.cast.addradio.de/ndr/ndrkultur/live/mp3/128/stream.mp3",
			meta : {
				type : 'NDR',
				radiotext : true,
				list : 'https://www.ndr.de/public/radioplaylists/ndrkultur.json'
			}
		},
		{
			station : 'ndr1903',
			name : "NDR 90.3",
			color : '#CC292E',
			stream : "http://ndr-ndr903-hamburg.cast.addradio.de/ndr/ndr903/hamburg/mp3/128/stream.mp3",
		},
		{
			station : 'ndrinfo',
			name : "NDR Info",
			color : '#E6B54B',
			stream : "http://ndr-ndrinfo-niedersachsen.cast.addradio.de/ndr/ndrinfo/niedersachsen/mp3/128/stream.mp3",
			meta : {
				playlist : 'https://www.ndr.de/public/radioplaylists/ndrinfo.json',
				epg : 'https://www.ndr.de/radio/titelanzeige100-totalblank_station-ndrinfo.json'
			}
		},
		{
			station : 'ndr1wellenord',
			name : "NDR1 Welle Nord",
			color : '#00A9D2',
			stream : "https://ndr-ndr1wellenord-norderstedt.sslcast.addradio.de/ndr/ndr1wellenord/norderstedt/mp3/128/stream.mp3",
			meta : {
				playlist : 'https://www.ndr.de/public/radioplaylists/ndr1wellenord.json'
			}
		},
		{
			station : 'hr2',
			name : "hr2 Kultur",
			color : '#00BCF2',
			stream : 'http://hr-hr2-live.cast.addradio.de/hr/hr2/live/mp3/128/stream.mp3',
		},
		{
			station : 'radiofip',
			name : "FIP radio",
			stream : 'http://icecast.radiofrance.fr/fip-midfi.mp3',
			color : '#EB2A86',
			meta : {
				type : 'FIP',
				current : 'https://www.fip.fr/sites/default/files/import_si/si_titre_antenne/FIP_player_current.json'
			}
		},
		{
			station : 'fipjazz',
			name : "FIP autour du jazz",
			textcolor: '#ffffff',
			stream : 'http://direct.fipradio.fr/live/fip-webradio2.mp3',
			color : '#FCB632'
		},
		{
			station : 'francemusiquejazz',
			name : "France Music Jazz",
			textcolor: '#ffffff',
			stream : 'http://direct.francemusique.fr/live/francemusiquelajazz-hifi.mp3',
			color : '#344694',
			meta : {
				type : 'FRANCE',
				live : 'https://www.francemusique.fr/livemeta/pull/402'
			}
		},
		{
			station : 'francemusique',
			name : "France Music",
			textcolor: '#ffffff',
			stream : 'http://icecast.radiofrance.fr/francemusique-midfi.mp3',
			color : '#AF2A2D',
			meta : {
				type : 'FRANCE',
				live : 'https://www.francemusique.fr/livemeta/pull/407'
			}
		},
		{
			station : 'franceculture',
			name : "France Culture",
			stream : 'http://icecast.radiofrance.fr/franceculture-midfi.mp3',
			color : '#79278B',
		},
		{
			station : 'dlr',
			color : '#FF6B00',
			textcolor: '#ffffff',
			stream : 'http://dradio-edge-1093.dus-dtag.cdn.addradio.net/dradio/kultur/live/mp3/128/stream.mp3',
			name : 'DeutschlandRadio Kultur',
			url : 'https://m.deutschlandfunkkultur.de/dkultur-startseite.1477.de.mhtml',
			meta : {
				type : "DLFXML",
				live : 'https://srv.deutschlandradio.de/aodpreviewdata.1915.de.rpc?drbm:station_id=3'
			}
		},
		{
			station : 'dlf',
			stream : 'http://st01.dlf.de/dlf/01/128/mp3/stream.mp3',
			name : 'Deutschlandfunk Köln',
			color : '#0075BD',
			textcolor: '#ffffff',
			meta : {
				type : "DLFXML",
				live : 'https://srv.deutschlandradio.de/aodpreviewdata.1915.de.rpc?drbm:station_id=4'
			}
		},
		{
			station : 'hlr',
			name : 'Hamburger Lokalradio',
			color : '#D5DCB7',
			stream : 'http://server1.cityedv.at:9036/192kbps'
		},
		{
			station : 'mdrklassik',
			name : "MDR KLASSIK",
			textcolor: '#ffffff',
			color : '#E9314D',
			stream : 'http://mdr-284350-0.cast.mdr.de/mdr/284350/0/mp3/high/stream.mp3',
			meta : {
				type : 'MDR',
				titlelist : 'https://www.mdr.de/XML/titellisten/mdr_klassik_2.json'
			}
		},
		{
			station : 'mdrkultur',
			name : "MDR Kultur",
			color : '#FCBC00',
			stream : 'http://mdr-284310-0.cast.mdr.de/mdr/284310/0/mp3/high/stream.mp3',
			meta : {
				type : 'MDR',
				titlelist : 'https://www.mdr.de/XML/titellisten/mdr_figaro_2.json'
			}
		},
		{
			station : 'rbbkultur',
			stream : 'https://dg-rbb-https-dus-dtag-cdn.sslcast.addradio.de/rbb/kulturradio/live/mp3/128/stream.mp3',
			name : 'kulturradio rbb	',
			charset : 'latin-1',
			color : '#FE2D87'
		},
		{
			station : 'bremen2',
			name : 'Bremen2',
			color : '#413474',
			stream : 'https://rb-bremenzwei-live.sslcast.addradio.de/rb/bremenzwei/live/mp3/128/stream.mp3',
			charset : 'latin-1'
		},
		{
			station : 'lr3',
			name : 'Latvijas Radio3',
			color : '#C29A00',
			textcolor: '#ffffff',
			stream : 'http://lr3mp0.latvijasradio.lv:8004/',
			
		},{
			station : 'srfvirus',
			stream : 'http://stream.srg-ssr.ch/m/drsvirus/mp3_128',
			name : "Radio SRF Virus",
			color : '#C5F761',
			textcolor: '#000000',
			meta : {
			}
		},
		{station : 'dlfdebatten',
			stream : 'http://dradio-edge-2091.dus-lg.cdn.addradio.net/dradio/dokdeb/live/mp3/128/stream.mp3',
			name : "DLF Dokumente und Debatten",
			color : '#777777',
			textcolor: '#ffffff',
			meta : {
			}
			
			
		}
];
