module.exports = [
		{
			logo : 'swr2',
			stream : 'http://dg-swr-http-fra-dtag-cdn.cast.addradio.de/swr/swr2/live/mp3/256/stream.mp3',
			name : "SWR 2",
			color : '#00BAE5',
			meta : {
				type : "HTML",
				radiotext : true,
				live : 'https://www.swr.de/cache/onair/swr2webradio.json'
			}
		},
		{
			logo : 'swr4',
			stream : 'http://swr-swr4-fr.cast.addradio.de/swr/swr4/fr/mp3/128/stream.mp3',
			name : "SWR 4",
			color : '#00BAE5',

		},
		{
			logo : 'ndr1radiomv',
			stream : 'https://ndr-ndr1radiomv-schwerin.sslcast.addradio.de/ndr/ndr1radiomv/schwerin/mp3/128/stream.mp3',
			name : "NDR1 Radio MV",
			color : '#00BAE5',
			meta : {
				playlist : 'https://www.ndr.de/public/radioplaylists/ndr1radiomv.json'
			}

		},
		{
			logo : 'ndr1niedersachsen',
			stream : 'https://ndr-ndr1niedersachsen-hannover.sslcast.addradio.de/ndr/ndr1niedersachsen/hannover/mp3/128/stream.mp3',
			name : "NDR1 Radio Niedersachsen",
			color : '#163F87	',
			meta : {
				playlist : 'https://www.ndr.de/public/radioplaylists/ndr1niedersachsen.json'
			}

		},
		{
			logo : 'wdr3',
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
			logo : 'wdr5',
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
			logo : 'wdreinslive',
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
			logo : 'orfoe1',
			name : "Österreich 1",
			stream : 'http://mp3stream3.apasf.apa.at:8000',
			color : '#B73924',
			meta : {
				type : 'OE',
				radiotext : true,
				highlights : 'https://audioapi.orf.at/oe1/api/json/current/highlights',
				current : 'https://audioapi.orf.at/oe1/api/json/current/live'
			}
		},
		{
			logo : 'srf2',
			name : 'Radio SRF 2 Kultur',
			charset : "LATIN-1",
			color : '#B42A69',
			stream : 'http://stream.srg-ssr.ch/m/drs2/mp3_128',
			charset : 'latin-1',
			meta : {
				type : 'SRF',
				radiotext : true,
				nowandnext : 'https://www.srf.ch/play/radio/now-and-next/c8537421-c9c5-4461-9c9c-c15816458b46'
			}
		},
		{
			logo : 'srf1',
			name : 'Radio SRF 1',
			charset : 'latin-1',
			color : '#FF7C00',
			stream : 'http://stream.srg-ssr.ch/m/drs1/mp3_128',
			meta : {
				radiotext : true,
				type : "SRF",
				webcam : 'https://www.srf.ch/webcams/radio-srf-1',
				nowandnext : 'https://www.srf.ch/play/radio/now-and-next/69e8ac16-4327-4af4-b873-fd5cd6e895a7'
			}
		},
		{
			logo : 'swissclassic',
			name : 'Radio Swiss Classic',
			stream : 'http://stream.srg-ssr.ch/m/rsc_de/mp3_128',
			color : '#00AEE0'
		},
		{
			logo : 'radioswissjazz',
			name : 'Radio Swiss Jazz',
			stream : 'http://stream.srg-ssr.ch/m/rsj/mp3_128',
			color : '#FABE2B'
		},
		{
			logo : 'sr2',
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
			logo : 'br2',
			name : 'BayernRundfunk II',
			stream : 'http://br-br2-nord.cast.addradio.de/br/br2/nord/mp3/128/stream.mp3',
			color : '#F17E02'

		},
		{
			logo : 'brklassik',
			name : 'BR Klassik',
			stream : 'https://br-brklassik-live.sslcast.addradio.de/br/brklassik/live/mp3/128/stream.mp3',
			color : '#EE2439',
			meta : {
				type : 'BR',
				live : 'https://www.br-klassik.de/programm/livestream/br-klassik-audio-livestream-100~radioplayer.json'
			}

		},
		{
			logo : 'ndrkultur',
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
			logo : 'ndr1903',
			name : "NDR 90.3",
			color : '#CC292E',
			stream : "http://ndr-ndr903-hamburg.cast.addradio.de/ndr/ndr903/hamburg/mp3/128/stream.mp3",
		},
		{
			logo : 'ndrinfo',
			name : "NDR Info",
			color : '#E6B54B',
			stream : "http://ndr-ndrinfo-niedersachsen.cast.addradio.de/ndr/ndrinfo/niedersachsen/mp3/128/stream.mp3",
			meta : {
				playlist : 'https://www.ndr.de/public/radioplaylists/ndrinfo.json',
				epg : 'https://www.ndr.de/radio/titelanzeige100-totalblank_station-ndrinfo.json'
			}
		},
		{
			logo : 'ndr1wellenord',
			name : "NDR1 Welle Nord",
			color : '#00A9D2',
			stream : "https://ndr-ndr1wellenord-norderstedt.sslcast.addradio.de/ndr/ndr1wellenord/norderstedt/mp3/128/stream.mp3",
			meta : {
				playlist : 'https://www.ndr.de/public/radioplaylists/ndr1wellenord.json'
			}
		},
		{
			logo : 'hr2',
			name : "hr2 Kultur",
			color : '#00BCF2',
			stream : 'http://hr-hr2-live.cast.addradio.de/hr/hr2/live/mp3/128/stream.mp3',
		},
		{
			logo : 'radiofip',
			name : "FIP radio",
			stream : 'http://chai5she.cdn.dvmr.fr/fip-midfi.mp3',
			color : '#EB2A86',
			meta : {
				type : 'FIP',
				current : 'https://www.fip.fr/sites/default/files/import_si/si_titre_antenne/FIP_player_current.json'
			}
		},
		{
			logo : 'fipjazz',
			name : "FIP autour du jazz",
			stream : 'http://direct.fipradio.fr/live/fip-webradio2.mp3',
			color : '#FCB632'
		},
		{
			logo : 'francemusiquejazz',
			name : "France Music Jazz",
			stream : 'http://direct.francemusique.fr/live/francemusiquelajazz-hifi.mp3',
			color : '#344694',
			meta : {
				type : 'FRANCE',
				live : 'https://www.francemusique.fr/livemeta/pull/402'
			}
		},
		{
			logo : 'francemusique',
			name : "France Music",
			stream : 'http://direct.franceculture.fr/live/franceculture-midfi.mp3',
			color : '#AF2A2D',
			meta : {
				type : 'FRANCE',
				live : 'https://www.francemusique.fr/livemeta/pull/407'
			}
		},
		{
			logo : 'franceculture',
			name : "France Culture",
			stream : 'http://chai5she.cdn.dvmr.fr/franceculture-midfi.mp3',
			color : '#79278B',

		},
		{
			logo : 'dlr',
			color : '#FF6B00',
			stream : 'http://st02.dlf.de/dlf/02/128/mp3/stream.mp3',
			name : 'DeutschlandRadio Kultur',
			url : 'https://m.deutschlandfunkkultur.de/dkultur-startseite.1477.de.mhtml',
			meta : {
				type : "DLFXML",
				live : 'https://srv.deutschlandradio.de/aodpreviewdata.1915.de.rpc?drbm:station_id=3'
			}
		},
		{
			logo : 'dlf',
			stream : 'http://st01.dlf.de/dlf/01/128/mp3/stream.mp3',
			name : 'Deutschlandfunk Köln',
			color : '#0075BD',
			meta : {
				type : "DLFXML",
				live : 'https://srv.deutschlandradio.de/aodpreviewdata.1915.de.rpc?drbm:station_id=4'
			}
		},
		{
			logo : 'hlr',
			name : 'Hamburger Lokalradio',
			color : '#D5DCB7',
			stream : 'http://server1.cityedv.at:9036/192kbps'
		},
		{
			logo : 'mdrklassik',
			name : "MDR KLASSIK",
			color : '#E9314D',
			stream : 'http://mdr-284350-0.cast.mdr.de/mdr/284350/0/mp3/high/stream.mp3',
			meta : {
				type : 'MDR',
				titlelist : 'https://www.mdr.de/XML/titellisten/mdr_klassik_2.json'
			}
		},
		{
			logo : 'mdrkultur',
			name : "MDR Kultur",
			color : '#FCBC00',
			stream : 'http://mdr-284310-0.cast.mdr.de/mdr/284310/0/mp3/high/stream.mp3',
			meta : {
				type : 'MDR',
				titlelist : 'https://www.mdr.de/XML/titellisten/mdr_figaro_2.json'
			}
		},
		{
			logo : 'rbbkultur',
			stream : 'https://dg-rbb-https-dus-dtag-cdn.sslcast.addradio.de/rbb/kulturradio/live/mp3/128/stream.mp3',
			name : 'kulturradio rbb	',
			charset : 'latin-1',
			color : '#FE2D87'
		},
		{
			logo : 'bremen2',
			name : 'Bremen2',
			color : '#413474',
			stream : 'https://rb-bremenzwei-live.sslcast.addradio.de/rb/bremenzwei/live/mp3/128/stream.mp3',
			charset : 'latin-1'
		}
];
