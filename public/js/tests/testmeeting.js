$(function()
{

	var z = 0;
	var page = null;
	var sub = [];
	var ajaxData = [
		{   // 0 meetings    2 meetings with data=all
			'data' :  [{"id":"f81a4a19-5e82-4b64-b5a6-00edff1f346c","venue":"Addington Raceway NZ","date":"2016-03-22","type":"GR","disabled":false,"code":"Addington Raceway NZ","trackid":"258e06ae-e16b-4f99-a873-b6b6b20c330a","rail":null,"rating":null,"weather":null,"require_colours":false,"web_enabled":false,"racecount":"12","timezone":"NZ","runnercount":"116","state":"NZ","status":[{"id":"3acfd5c0-9ea4-4af2-9642-64d1fa2ca0e6","loadid":"Addington Raceway NZ2016-03-22GR","type":"runner","time":"2016-03-21 12:47:02.968414","status":"loaded","loadcount":null,"message":""},{"id":"449e2b2c-5891-4b9b-bc99-b6f80d0a0cd5","loadid":"Addington Raceway NZ2016-03-22GR","type":"race","time":"2016-03-21 12:47:02.973106","status":"update","loadcount":null,"message":"Raceheader"}],"betting":[]},{"id":"62e6516a-e549-403d-8175-3db41b5e15d6","venue":"TEST ","date":"2099-01-01","type":"HA","disabled":false,"code":"tes","trackid":"85e148f1-fe0d-41a5-bfc7-00c2f1c13b5b","rail":null,"rating":null,"weather":null,"require_colours":false,"web_enabled":false,"racecount":"8","timezone":"Australia/Brisbane","runnercount":"79","state":"QLD","status":[{"id":"8232b8f8-22eb-4e06-a653-a950195aa3c2","loadid":"Albion Park D2016-03-22HA","type":"runner","time":"2016-03-21 11:08:03.29005","status":"loaded","loadcount":null,"message":""},{"id":"edc90352-29eb-463f-8be5-9eefda2b6963","loadid":"Albion Park D2016-03-22HA","type":"race","time":"2016-03-21 11:08:03.29518","status":"loaded","loadcount":null,"message":""}],"betting":[]}]
		},
		{   // 1 races
			'data' :  [{"id":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","meetid":"6913dec6-6e3e-4329-a50c-8ec9cd82ae2d","number":1,"distance":1200,"racetime":"2099-01-01 13:10:00+11","name":"TAB Rewards Plate","name2":"test Race","class":null,"class2":null,"claims":"(Apprentices can claim)2-y-o.","prizemoney":"$85,000.00","first":"$48,750.00","second":"$16,750.00","third":"$8,350.00","fourth":"$4,150.00","fifth":"$2,000.00","meetingcode":"tes","gearchanges":null,"trackcondition":null,"rail":null},{"id":"de082e83-a040-44ba-9d53-2f5a70c801dd","meetid":"6913dec6-6e3e-4329-a50c-8ec9cd82ae2d","number":2,"distance":1200,"racetime":"2099-01-01 13:45:00+11","name":"Hyland Race Colours (Bm72)","name2":null,"class":null,"class2":null,"claims":"(Apprentices can claim)3-y-o.","prizemoney":"$85,000.00","first":"$48,750.00","second":"$16,750.00","third":"$8,350.00","fourth":"$4,150.00","fifth":"$2,000.00","meetingcode":"tes","gearchanges":null,"trackcondition":null,"rail":null},{"id":"d9c6520a-40d7-412f-a571-8c87aa2bef2a","meetid":"6913dec6-6e3e-4329-a50c-8ec9cd82ae2d","number":3,"distance":1250,"racetime":"2099-01-01 14:20:00+11","name":"TAB Place Multi (Bm79)","name2":null,"class":null,"class2":null,"claims":"(Apprentices can claim)3-y-o and up.","prizemoney":"$85,000.00","first":"$48,750.00","second":"$16,750.00","third":"$8,350.00","fourth":"$4,150.00","fifth":"$2,000.00","meetingcode":"tes","gearchanges":null,"trackcondition":null,"rail":null},{"id":"fd3f5407-7ce5-4d9b-a342-f1a4f3b3f970","meetid":"6913dec6-6e3e-4329-a50c-8ec9cd82ae2d","number":4,"distance":1550,"racetime":"2099-01-01 14:55:00+11","name":"Irresistible Pools & Spas-Bm80","name2":null,"class":null,"class2":null,"claims":"(Apprentices can claim)3-y-o and up  Fillies & Mares.","prizemoney":"$85,000.00","first":"$48,750.00","second":"$16,750.00","third":"$8,350.00","fourth":"$4,150.00","fifth":"$2,000.00","meetingcode":"tes","gearchanges":null,"trackcondition":null,"rail":null},{"id":"24483d9e-40b0-48c1-a3b5-551be6b99ee7","meetid":"6913dec6-6e3e-4329-a50c-8ec9cd82ae2d","number":5,"distance":1550,"racetime":"2099-01-01 15:35:00+11","name":"December Hcp","name2":null,"class":null,"class2":null,"claims":"(Apprentices can claim)3-y-o and up.","prizemoney":"$85,000.00","first":"$48,750.00","second":"$16,750.00","third":"$8,350.00","fourth":"$4,150.00","fifth":"$2,000.00","meetingcode":"tes","gearchanges":null,"trackcondition":null,"rail":null},{"id":"e8169682-c5ee-4ed0-8816-2cc0579830d2","meetid":"6913dec6-6e3e-4329-a50c-8ec9cd82ae2d","number":6,"distance":1200,"racetime":"2099-01-01 16:15:00+11","name":"Canterbury Classic","name2":null,"class":null,"class2":null,"claims":"(Apprentices cannot claim)3-y-o and up.","prizemoney":"$100,000.00","first":"$60,000.00","second":"$20,000.00","third":"$10,000.00","fourth":"$5,000.00","fifth":"$2,000.00","meetingcode":"tes","gearchanges":null,"trackcondition":null,"rail":null},{"id":"ff53d630-70bc-4866-8baf-eeda715a527c","meetid":"6913dec6-6e3e-4329-a50c-8ec9cd82ae2d","number":7,"distance":1100,"racetime":"2099-01-01 16:55:00+11","name":"TAB.Com.Au (Bm80)","name2":null,"class":null,"class2":null,"claims":"(Apprentices can claim)3-y-o and up.","prizemoney":"$85,000.00","first":"$48,750.00","second":"$16,750.00","third":"$8,350.00","fourth":"$4,150.00","fifth":"$2,000.00","meetingcode":"tes","gearchanges":null,"trackcondition":null,"rail":null},{"id":"8136ed20-025f-4972-857a-6d52a55f5eec","meetid":"6913dec6-6e3e-4329-a50c-8ec9cd82ae2d","number":8,"distance":1900,"racetime":"2099-01-01 17:35:00+11","name":"More Than Ready (Bm75)","name2":null,"class":null,"class2":null,"claims":"(Apprentices can claim)3-y-o and up.","prizemoney":"$85,000.00","first":"$48,750.00","second":"$16,750.00","third":"$8,350.00","fourth":"$4,150.00","fifth":"$2,000.00","meetingcode":"tes","gearchanges":null,"trackcondition":null,"rail":null}]
		},
		{   // 2 runner
			'data' :  [{"id":"7cf443e7-f825-4b24-b87b-c9b161a5dd3d","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Dane Slugger","jockey":"J A Martin","trainer":"Bjorn Baker","weight":"56","record":"4879","market":"8","number":1,"scratched":false,"emergency":null,"claim":null,"barrier":"(14)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"S","legend":"","rating":97,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"2ed699a0-c819-45d1-957b-be3858f2832f","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Mr Humphries","jockey":"","trainer":"D T O'Brien","weight":"56","record":"2","market":"15","number":2,"scratched":false,"emergency":null,"claim":null,"barrier":"(5)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"S","legend":"","rating":91,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"8e75d0ee-606c-4b91-9389-73951f597259","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Austrian","jockey":"Scratched","trainer":"C J Waller","weight":"56","record":"9","market":"21","number":3,"scratched":false,"emergency":null,"claim":null,"barrier":"(13)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"S","legend":"","rating":0,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"ea737a45-5fe8-4a92-be97-08bff70ea21f","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Marco Man","jockey":"T Angland","trainer":"David Pfieffer","weight":"56","record":"7","market":"51","number":4,"scratched":false,"emergency":null,"claim":null,"barrier":"(16)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"U","legend":"","rating":82,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"aa98b035-36b1-4f6d-806f-0926f9941fc9","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"I'm Not Sure","jockey":"Scratched","trainer":"P & P Snowden","weight":"56","record":"","market":"17","number":5,"scratched":false,"emergency":null,"claim":null,"barrier":"(10)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"F","legend":"","rating":0,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"70e76283-44fc-4581-a15c-b8284ca3f9bf","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Joyful Passion","jockey":"","trainer":"G W Moore","weight":"56","record":"","market":"26","number":6,"scratched":false,"emergency":null,"claim":null,"barrier":"(1)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"F","legend":"","rating":89,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"436534af-47cd-4473-9218-04fd502bc365","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Lushan","jockey":"Scratched","trainer":"C J Waller","weight":"56","record":"","market":"13","number":7,"scratched":false,"emergency":null,"claim":null,"barrier":"(11)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"F","legend":"","rating":0,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"d832b99c-d365-4e00-9f5d-1b2886d07e72","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Stravigo","jockey":"J A Cassidy","trainer":"P & P Snowden","weight":"56","record":"","market":"4.6","number":8,"scratched":false,"emergency":null,"claim":null,"barrier":"(8)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"F","legend":"","rating":89,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"d97fbb7f-48f6-4fa0-b7b3-1706876e17fa","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Racy","jockey":"","trainer":"G Portelli","weight":"54","record":"1","market":"9","number":9,"scratched":false,"emergency":null,"claim":null,"barrier":"(12)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"U","legend":"w","rating":98,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"4ccd25a6-b68e-438d-bb5d-88c60e95e228","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Perignon","jockey":"B Avdulla","trainer":"G A Ryan","weight":"54","record":"4","market":"5","number":10,"scratched":false,"emergency":null,"claim":null,"barrier":"(15)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"U","legend":"","rating":100,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"7813ac23-ef10-403a-be4f-e06ff16a7760","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Look To The Stars","jockey":"Tommy Berry","trainer":"C E Conners","weight":"54","record":"2","market":"21","number":11,"scratched":false,"emergency":null,"claim":null,"barrier":"(2)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"U","legend":"","rating":98,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"3da9668c-ff68-40db-a4f6-6656d0f9344d","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Ramla Bay","jockey":"","trainer":"J G Sargent","weight":"54","record":"8","market":"21","number":12,"scratched":false,"emergency":null,"claim":null,"barrier":"(7)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"S","legend":"","rating":88,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"cb653c81-ee12-4b40-ad44-9ad372ee38fd","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Fiery Redhead","jockey":"James P Innes (a3)","trainer":"N J Osborne","weight":"54","record":"77","market":"31","number":13,"scratched":false,"emergency":null,"claim":null,"barrier":"(9)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"U","legend":"","rating":90,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"50d27fa2-492e-4dc2-b551-d28d62b84455","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Chamunda","jockey":"Ms K O'Hara","trainer":"J A O'Shea","weight":"54","record":"","market":"17","number":14,"scratched":false,"emergency":null,"claim":null,"barrier":"(4)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"F","legend":"","rating":92,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"ecf918bc-12a3-4a57-9688-96120102fa05","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Cathay Belle","jockey":"","trainer":"J G Sargent","weight":"54","record":"","market":"13","number":15,"scratched":false,"emergency":1,"claim":null,"barrier":"(3)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"F","legend":"","rating":91,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null},{"id":"db273881-2290-4b1d-868e-004d03eb2f64","raceid":"0f5ff287-f78c-445b-9d96-0eb263c26f7d","name":"Otter","jockey":"C Reith","trainer":"J A O'Shea","weight":"54","record":"","market":"4","number":16,"scratched":false,"emergency":2,"claim":null,"barrier":"(6)","gear":null,"colour":null,"gender":null,"sire":null,"dam":null,"damsire":null,"oldtrainer":null,"trainerlocation":null,"livery":null,"winnings":null,"start":null,"finish1":null,"finish2":null,"finish3":null,"startx":null,"finish1x":null,"finish2x":null,"finish3x":null,"starttrack":null,"finish1track":null,"finish2track":null,"finish3track":null,"startdistance":null,"finish1distance":null,"finish2distance":null,"finish3distance":null,"starttrackdistance":null,"finish1trackdistance":null,"finish2trackdistance":null,"finish3trackdistance":null,"finish1distancesum":null,"start1up":null,"finish11up":null,"finish21up":null,"finish31up":null,"start2up":null,"finish12up":null,"finish22up":null,"finish32up":null,"starta":null,"finish1a":null,"finish3a":null,"finish2a":null,"startb":null,"finish1b":null,"finish2b":null,"finish3b":null,"startc":null,"finish1c":null,"finish2c":null,"finish3c":null,"start3up":null,"finish13up":null,"finish23up":null,"finish33up":null,"start4up":null,"finish14up":null,"finish24up":null,"finish34up":null,"finish44up":null,"updown":"F","legend":"","rating":92,"jockey2":null,"trainer2":null,"age":null,"owner":null,"win%":null,"place%":null,"tip":null}]
		},
        {   // 3 meeting for sliks
            'data' :  {"id":"57b6a6f8-215e-4a76-ba72-9eebaa364e36","date":"2015-10-01","venue":"Bendigo","races":[{"id":"a5b22660-3048-4757-acea-04c2fc1ab61d","meetid":"57b6a6f8-215e-4a76-ba72-9eebaa364e36","name":"Vic Seniors' Festival Plate","number":1,"racetime":"2015-10-01 12:55:00+10","runners":[{"id":"63d5b64d-60a2-486e-aed7-4fa54af9d073","livery":"royal blue, lime quarters and armbands, quartered cap","name":"Amenzel","number":1,"trainer":"Shea Eden"},{"id":"1c8d8bee-3bac-4dbd-9bd9-69e059cb316f","livery":"purple, red star, red sleeves and cap","name":"Constant Justice","number":2,"trainer":"M M Laurie"},{"id":"13dfc638-de76-4070-b316-82a6d68e44c0","livery":"black, orange spots and cap","name":"Equidant","number":3,"trainer":"Byron Cozamanis"},{"id":"778de05c-f460-4ca9-b98a-502318cce7aa","livery":"lime, purple and gold braces and armbands","name":"Secret Obsession","number":4,"trainer":"Brent Stanley"},{"id":"e34714ea-fb6f-4170-9cd6-bbeec0c17559","livery":"brown and green hoops, orange sleeves and cap","name":"The Profit","number":5,"trainer":"Sean Cooper"},{"id":"c25dbbbb-8f31-4465-beb0-f05af532d1b7","livery":"maroon, green band and armbands","name":"Unfettered","number":6,"trainer":"A O Diggins"},{"id":"4950ce7e-3412-459e-964f-1e0517472eca","livery":"maroon, black maltese cross, gold sleeves and cap","name":"Hard Spark","number":7,"trainer":"S Fliedner"},{"id":"bd12e67b-dded-40e5-829e-afd6d964bfc8","livery":"green, white cap","name":"Penny Shares","number":8,"trainer":"J F Moloney"},{"id":"201efc75-5e2c-4623-ae06-631bfb26ce36","livery":"pink, brown armbands and cap","name":"Results","number":9,"trainer":"S A Dwyer"},{"id":"9dcf6417-d827-40be-947c-96a9cc737487","livery":"olive, white circle, hooped cap","name":"Snitzel Music","number":10,"trainer":"Luke Oliver"}]},{"id":"acdc9cc7-23e2-4946-a845-5ee672eb3fca","meetid":"57b6a6f8-215e-4a76-ba72-9eebaa364e36","name":"Cup Eve Gala @ All Seasons","number":2,"racetime":"2015-10-01 13:30:00+10","runners":[{"id":"fdb8c4d7-9130-46e8-b189-b97227ea3302","livery":"purple and yellow diamonds, green sleeves, purple cap","name":"Jack Henry","number":1,"trainer":"P A Banks"},{"id":"e90281fc-f5e0-43b5-a92b-c3c0c7d6e0ea","livery":"red, yellow diamond band, white collar, sleeves and cap","name":"Blue Moon Diamonds","number":2,"trainer":"B A Gentle"},{"id":"8589521e-b72c-450b-ae82-883519453caf","livery":"white, black and orange diamonds band and diamonds armbands, orange cap","name":"Dothraki Queen","number":3,"trainer":"K A Davison"},{"id":"9da6a3bc-5d17-414c-8b24-6394140e9e20","livery":"black, red epaulettes, white sleeves, red and white striped cap","name":"Lovespur","number":4,"trainer":"Paul Rocke"},{"id":"26a6287f-0f4d-4a45-8754-721f67080155","livery":"white, dark green band and sleeves, quartered cap, white pom pom","name":"Seeyawheniseeya","number":5,"trainer":"S A Dwyer"},{"id":"5b62c9f6-a8b2-4f59-a1fc-a533400c12c1","livery":"red, yellow diamond band, white collar, white sleeves and red cap","name":"The Squatter","number":6,"trainer":"B A Gentle"},{"id":"14eb47f2-4c99-4435-b3ef-55dae8fdd6a0","livery":"black, yellow braces","name":"Heza Lover","number":7,"trainer":"Ms G Gillis"},{"id":"596707d0-5972-4a9c-9e05-24905f9a6690","livery":"black, white diamond band, checked cap","name":"Sparta","number":8,"trainer":"M, W & J Hawkes"},{"id":"8e69fecd-39ba-48b7-ae4a-a7eab2c8020f","livery":"green, white cap","name":"Belsapphire","number":9,"trainer":"J F Moloney"},{"id":"1216321b-5e0f-4520-bc36-759780bff778","livery":"maroon, black maltese cross, gold sleeves and cap","name":"Flying Spark","number":10,"trainer":"S Fliedner"},{"id":"31ca8efa-4636-4d80-95b0-3415e93209aa","livery":"rainbow checks, grey sleeves","name":"Tahlio","number":11,"trainer":"Luke Oliver"}]},{"id":"2ed072c4-6b39-4b4f-ba69-5098f2fc80c0","meetid":"57b6a6f8-215e-4a76-ba72-9eebaa364e36","name":"3BO FM Plate","number":3,"racetime":"2015-10-01 14:05:00+10","runners":[{"id":"dc5f0340-1227-4e46-af8e-55276f46e49e","livery":"purple, white maltese cross and armbands","name":"Armageddon On It","number":1,"trainer":"Chris Calthorpe"},{"id":"a2beabbc-2125-4253-9a72-86aa7d69f847","livery":"pink, brown armbands and cap","name":"First Stimulus","number":2,"trainer":"S A Dwyer"},{"id":"85df628d-e5a1-4beb-928f-6b6126cb5ac0","livery":"pink, black spots, pink and black spots cap","name":"Leodoro","number":3,"trainer":"M C Kent"},{"id":"64525b85-86bc-4e38-b1c5-f709eed86852","livery":"red, white stars, royal blue sleeves and white cap","name":"Mansale","number":4,"trainer":"J D Sadler"},{"id":"011e635c-fca9-48f7-8da7-e3958c608ae0","livery":"green, white sash, black sleeves and cap, white pom pom","name":"Volcan De Fuego","number":5,"trainer":"G A Thornton"},{"id":"dd088d05-fb50-4c79-8b05-b719ee69d7e4","livery":"black and gold checks, striped sleeves and cap","name":"Intrigo","number":6,"trainer":"Saab Hasan"},{"id":"ba41a1fd-d85c-47ac-a2c4-22f176deaf11","livery":"black, black and orange checked sash and cap","name":"Battlecamp","number":7,"trainer":"Lee & Anthony Freedman"},{"id":"840ca165-60f4-4585-a551-f6db88eec3ef","livery":"white, red diagonal stripes and cap","name":"Comeback","number":8,"trainer":"S Fliedner"},{"id":"b3b99837-f23b-4ca2-9e76-bff8f846ff70","livery":"purple, white hoops, black seams, purple and white quartered cap","name":"Radioactive","number":9,"trainer":"C J Waller"},{"id":"5b32f7cd-91ad-4ea8-988a-0ae31661f12b","livery":"white, orange cross and cap","name":"Shockaholic","number":10,"trainer":"M M Laurie"},{"id":"5a400037-1410-4c9f-8a01-a1835eda1530","livery":"navy","name":"Fair Isle","number":11,"trainer":"D Hayes & T Dabernig"},{"id":"239b3544-a4a2-4575-9560-630e5b36186e","livery":"royal blue, white crossed sashes","name":"The Nickster","number":12,"trainer":"Pat Cannon"}]},{"id":"c0bbcb1d-f152-4d52-9f1e-0a53998155dd","meetid":"57b6a6f8-215e-4a76-ba72-9eebaa364e36","name":"Peter Anthony Menswear","number":4,"racetime":"2015-10-01 14:40:00+10","runners":[{"id":"eedaa13d-567f-44ca-885e-6ba34d0078cb","livery":"royal blue, gold diamond sash, sleeves, royal blue cuffs, gold cap","name":"Amber Whisper","number":1,"trainer":"Daryn Drust"},{"id":"74af990a-18ae-4ce3-8773-66724d541821","livery":"burgundy, cream stripes and cuffs, burgundy cap","name":"Catechesis","number":2,"trainer":"R F Donat"},{"id":"ed19a356-9cc1-424b-bebe-a3c2df074339","livery":"red, yellow spot, red block, yellow armbands, quartered cap","name":"Cocolicious","number":3,"trainer":"Colin Scott"},{"id":"4d0d2828-16d0-4311-90eb-15a004584fa6","livery":"silver, aqua seams","name":"Real Desire","number":4,"trainer":"Brent Stanley"},{"id":"16e19c63-8cc3-444e-a376-af861214f038","livery":"fluorescent yellow, navy blue seams","name":"Shiny Lass","number":5,"trainer":"D K Weir"},{"id":"1cae58b2-4967-4331-a8fc-49d452ed89f7","livery":"royal blue and white checks, green sleeves and cap","name":"Tricky Affair","number":6,"trainer":"R D Griffiths"},{"id":"5474bea5-ff0b-4602-8200-70fbc826d140","livery":"red, black yoke, white sleeves, black diamond armbands, red and black quartered cap","name":"Crafty Miss","number":7,"trainer":"M M Laurie"},{"id":"5254142f-462f-48cb-a015-cf3834c2b741","livery":"white, red stripes","name":"Lotta Sugar","number":8,"trainer":"D Hayes & T Dabernig"},{"id":"e20f6090-3f16-4ab4-974c-8452ae63dd6d","livery":"red, yellow diamond band, white collar, sleeves and cap","name":"One More Fantasy","number":9,"trainer":"B A Gentle"},{"id":"e9b9f4dd-6e07-4443-99b0-e11047f90a37","livery":"black, hot pink checked sash, black and hot pink checked cap","name":"Rokeby Red","number":10,"trainer":"M M Laurie"},{"id":"db2397e1-6d0e-433c-99ca-9a75086ee3bf","livery":"red, navy blue sleeves, white armbands and cap","name":"Sandrelli","number":11,"trainer":"Lee & Shannon Hope"},{"id":"ab379008-2bc2-4b76-a0c3-9be1ee6deb1e","livery":"navy blue, white sash, lime striped sleeves, quartered cap","name":"Sauternes","number":12,"trainer":"Andrew Noblet"},{"id":"ad3dc1b3-86d7-438c-a6b9-8afd8bc30ff2","livery":"navy blue, white sash, hooped cap","name":"Semiramis","number":13,"trainer":"M C Kent"},{"id":"75baecc9-de9f-41ac-b4c0-7373ca5118db","livery":"light blue, hot pink and purple stripes, hooped sleeves, light blue cap","name":"Young Amazon","number":14,"trainer":"Mark Ashby"}]},{"id":"9b2b621f-b4d5-4ee4-94cf-4360e09c2f1a","meetid":"57b6a6f8-215e-4a76-ba72-9eebaa364e36","name":"Baillieu Holst Showcase","number":5,"racetime":"2015-10-01 15:15:00+10","runners":[{"id":"f6ec1725-acb0-484a-b38b-1c469d1dc9f5","livery":"white, green and orange diamonds and cap","name":"Simply Ming","number":1,"trainer":"J G Symons & S Laxon"},{"id":"6e92a7cf-0fea-40ac-bc36-c3e57255e2c7","livery":"royal blue and gold spots, red cap","name":"Valrouz","number":2,"trainer":"D C Harrison"},{"id":"aee418f3-1b8f-4824-839a-89f4a1bb61ea","livery":"white, gold and navy blue angle horseshoe, navy blue sleeves and cap","name":"Kalabek","number":3,"trainer":"M J Cerchi"},{"id":"b1ac78cb-397f-44db-9c10-fa069ec9300b","livery":"royal blue","name":"Marrakesh","number":4,"trainer":"Lee & Anthony Freedman"},{"id":"96b629de-4cb1-4f34-a981-665556f1f071","livery":"flourescent yellow, dark blue seams","name":"My Obsession","number":5,"trainer":"D K Weir"},{"id":"588486c7-8477-4e60-9902-085e90bfa744","livery":"pink, yellow hoops, royal blue sleeves, yellow armbands, pink, yellow, royal blue hooped cap","name":"Gauteng Gal","number":6,"trainer":"J W Price"},{"id":"3cc3afbd-0898-47ec-8096-cc45d520a9de","livery":"white with emerald green shamrock, emerald green and maroon striped sleeves, white cap","name":"Petite's Reward","number":7,"trainer":"B J McCarthy"},{"id":"aabc5d5e-c814-41d6-b1ff-97d7b1fe961e","livery":"pale blue, black band, white sleeves, gold cap","name":"Parcel","number":8,"trainer":"Wez Hunter"},{"id":"dd56e457-4bb0-4b90-a93b-973386ad24dc","livery":"pale blue and white hoops, pink and white checked cap","name":"Tiz My View","number":9,"trainer":"Sam Pritchard-Gordon"}]},{"id":"a756cffa-c5df-49e5-93ed-d76f52984a5f","meetid":"57b6a6f8-215e-4a76-ba72-9eebaa364e36","name":"O'FRM Lawyers Bendigo","number":6,"racetime":"2015-10-01 15:52:00+10","runners":[{"id":"ab1f96cc-09b1-4672-a0bf-346f795495df","livery":"royal stewart tartan, red and blue braces, white sleeves","name":"Angelic Lass","number":1,"trainer":"Philip Evans"},{"id":"18195f10-210d-4605-9cfa-1f8129b20f54","livery":"black, white thunderbolts","name":"Miss Thunder Road","number":2,"trainer":"D K Weir"},{"id":"a5471b27-9c24-463e-aa99-604b638376d5","livery":"tangerine, black diamond armbands, black star cap","name":"Finda Fitter Filly","number":3,"trainer":"J E & C Ledger"},{"id":"79411150-254f-4873-b71e-0eef43813e49","livery":"lime, white hoops, lime cap, white pom pom","name":"Make Mine Brandy","number":4,"trainer":"D S Archard"},{"id":"792fa560-b0d1-4043-a9b8-c84bf05ee5e0","livery":"sky blue, white and sky blue horse motif band","name":"Tail Risk","number":5,"trainer":"Heath Conners"},{"id":"55a4b0d9-f75e-4434-adb3-b1c62946e650","livery":"black, light blue hoops and cap","name":"Lourdeaux","number":6,"trainer":"Ms S Naylor"},{"id":"d944c886-cab0-413d-a4c9-e857aacc422c","livery":"green and yellow checks and striped sleeves, green and gold seams cap","name":"Svalbard","number":7,"trainer":"D K Weir"},{"id":"6631c5fc-d22a-4ed3-a399-258a2897f7a9","livery":"red, lime diagonal stripes","name":"Andrioli","number":8,"trainer":"R W Smerdon"},{"id":"9ce7f7ec-e0f0-4d4f-a78f-d1c8ed84c0cb","livery":"navy blue, white star, white sleeves, navy blue armbands, navy blue and white stars cap","name":"Effortless Miss","number":9,"trainer":"S Fliedner"},{"id":"7e33e4f3-8455-4ad3-b733-de5774f27986","livery":"green, white stars, red armbands and cap","name":"Annesbrook","number":10,"trainer":"B R Mills"}]},{"id":"a37ef05d-5bfe-4b36-8f0d-7f70e7f48116","meetid":"57b6a6f8-215e-4a76-ba72-9eebaa364e36","name":"Bendigo Eye Clinic Handicap","number":7,"racetime":"2015-10-01 16:32:00+10","runners":[{"id":"4c50d107-4251-4fc8-b730-dc767b5a1fde","livery":"royal blue and gold spots, red cap","name":"Cosentino","number":1,"trainer":"D C Harrison"},{"id":"109e73ca-d2a2-4b6d-b267-31c70830edb3","livery":"navy blue, gold lightning bolt, gold and white armbands, gold cap","name":"Jackpot","number":2,"trainer":"M D Moroney"},{"id":"05205030-e8ee-47ea-844b-2a620519ed2e","livery":"yellow, royal blue knight, royal blue and yellow stripe sleeves, yellow and royal blue star cap","name":"Jacoman","number":3,"trainer":"L & T Corstens"},{"id":"d4f32d5b-946a-49fa-8883-913f28d4f3dc","livery":"red, white stripe and sleeves, quartered cap","name":"Tavernier Blue","number":4,"trainer":"M M Laurie"},{"id":"65c4b629-cacf-4cc4-ad7e-7d2c1d380abf","livery":"green, white cap","name":"Brown Burberry","number":5,"trainer":"J F Moloney"},{"id":"75bd5847-3965-4bc7-99c2-7bc8a6874054","livery":"green, tartan crossed sashes, red sleeves, tartan cap","name":"Scarlett's Boy","number":6,"trainer":"J D Sadler"},{"id":"c8aeaec4-f485-4903-ad17-1767d6ec4abb","livery":"red, white love hearts, striped sleeves and cap","name":"Black Sheep","number":7,"trainer":"D K Weir"},{"id":"d1ff6ac0-4d78-4aad-a7d1-534bb54973c8","livery":"yellow, black epaulettes, striped cap","name":"Don Reggio","number":8,"trainer":"C F Hyland"},{"id":"a6b6e1cb-bc46-4a57-9f0d-b0418a518a36","livery":"purple and yellow diamonds, green sleeves, purple cap","name":"Rouen","number":9,"trainer":"P A Banks"},{"id":"04bbb99a-e73d-41ff-a81d-b85b6f1c27f6","livery":"black, lime band and cap","name":"Sirgasalot","number":10,"trainer":"Daniel Kelly"},{"id":"0b1ee986-016c-4483-928b-67f95b656f01","livery":"green, white stars, red armbands and cap","name":"Alberti","number":11,"trainer":"B R Mills"},{"id":"48c4c5a8-2038-4019-94c2-14a1790c4895","livery":"red, white star","name":"Kracken","number":12,"trainer":"D K Weir"}]},{"id":"f46478f6-d2a2-4d78-9d24-f681e1902b5a","meetid":"57b6a6f8-215e-4a76-ba72-9eebaa364e36","name":"Jayco Handicap","number":8,"racetime":"2015-10-01 17:12:00+10","runners":[{"id":"e63ecb63-cc19-4d0c-86fe-4982794817ca","livery":"purple, black stars, pink sleeves, black armbands","name":"Global Assault","number":1,"trainer":"Shawn Mathrick"},{"id":"2ccaaece-be5c-4c97-8c05-93505c7cb640","livery":"black and white stripes, maroon sleeves, black and white quartered cap","name":"Master's Degree","number":2,"trainer":"S A Lake"},{"id":"567a4c05-c2a6-4052-a18f-68290769a5bf","livery":"white, navy blue star, stars on sleeves and cap","name":"Beau Padrille","number":3,"trainer":"G F Wheeler"},{"id":"07569020-cb95-43d8-bd06-c1207e81144a","livery":"maroon, white star, white and maroon stars sleeves, white and maroon star cap","name":"Lethal","number":4,"trainer":"D K Weir"},{"id":"35156631-8f6a-46eb-af49-97205b103ab7","livery":"gold, black squares, spots and maltese crosses, white cap, gold pom pom","name":"The Early Crow","number":5,"trainer":"D K Weir"},{"id":"d18fe20e-017a-4525-8adf-42915b22f9ab","livery":"red, lime diagonal stripes","name":"Coppola","number":6,"trainer":"Lee & Anthony Freedman"},{"id":"eeda5548-9f6c-4a6a-8eea-b601ad688cdd","livery":"green, royal blue braces, yellow armbands and cap","name":"Lunar Nova","number":7,"trainer":"P A Chow"},{"id":"1909fc0a-2572-471b-bf62-7d91708e5b6c","livery":"royal blue and white checks, green sleeves and cap","name":"Rocknet","number":8,"trainer":"R D Griffiths"},{"id":"eafb3f08-4c0f-43ad-8171-5255ace8fb08","livery":"navy blue, white armbands and cap","name":"Thornton","number":9,"trainer":"Robert Hickmott"},{"id":"4229bb45-7d31-4297-9e0f-05dd6bd427d8","livery":"navy blue, gold lightning bolt, gold and white armbands, gold cap","name":"Trendsetter","number":10,"trainer":"M D Moroney"},{"id":"001b25f7-89bd-4ef7-850a-e87401688e35","livery":"lime, burgundy hoops","name":"Elzinga","number":11,"trainer":"E W Nichols"},{"id":"ab69dc70-3b9f-4d91-acaf-bd886ce2f6bd","livery":"red, royal blue v, quartered cap","name":"Treasure Map","number":12,"trainer":"M Sell"},{"id":"fea5c894-4a3a-450d-b807-89a04e7c6cc8","livery":"royal blue, red and white striped sleeves, white cap","name":"Super Daph","number":13,"trainer":"G A Thornton"},{"id":"30cdeacb-7b8d-4312-bcef-ca4ee65c1390","livery":"lime, purple question marks","name":"Hi Way Downs","number":14,"trainer":"M Sell"}]}]}
        },
        {   // 4 load meetings
            "data" :  [{"track":"Angle Park","code":"Angle Park","date":"2015-10-01","type":"GR","runnercount":"99","status":[{"id":"ca43b363-74f8-49e0-8b5b-e7a7d93fab2e","loadid":"Angle Park2015-10-01GR","type":"race","time":"2015-09-29 08:32:01.762327","status":"load"},{"id":"360e26e8-e9f9-4d3c-85a2-f2ad17fd3880","loadid":"Angle Park2015-10-01GR","type":"runner","time":"2015-09-29 08:32:01.692102","status":"loaded"}],"source":[{"time":"2015-09-29 09:02:01.765354+10","feed":"bf2-APK01Oct15.xml","loadid":"Angle Park2015-10-01GR"}],"history":[{"id":"ba066bf8-e997-419a-af26-c36f328f2177","time":"2015-09-29 08:48:12.182992+10","userid":"10bc6670-1aff-405d-9912-ea65ff1abbb5","firstname":"Steve","lastname":"Davison","type":"Race","message":"Race data","meetingid":"36e694ba-41b4-4977-b93e-1814ac7750da"},{"id":"da7ee7fd-b881-4a63-8840-123e21f66594","time":"2015-09-29 08:48:12.511895+10","userid":"10bc6670-1aff-405d-9912-ea65ff1abbb5","firstname":"Steve","lastname":"Davison","type":"Runners","message":"First load","meetingid":"36e694ba-41b4-4977-b93e-1814ac7750da"}],"loadid":"36e694ba-41b4-4977-b93e-1814ac7750da"},{"track":"Ascot Park Raceway NZ","code":"Ascot Park Raceway NZ","date":"2015-10-03","type":"HA","runnercount":"77","status":[{"id":"202fa796-66e8-42ea-910f-20b4de90b65f","loadid":"Ascot Park Raceway NZ2015-10-03HA","type":"runner","time":"2015-09-30 11:46:30.1846","status":"loaded"},{"id":"89bf2718-d8c1-412e-9fd9-23586248bdc8","loadid":"Ascot Park Raceway NZ2015-10-03HA","type":"race","time":"2015-09-30 11:46:30.221903","status":"update"}],"source":[{"time":"2015-09-29 08:46:43.741764+10","feed":"Ver4_2015_10_03_Harn_M7_AscotParkRaceway.xml","loadid":"Ascot Park Raceway NZ2015-10-03HA"},{"time":"2015-09-29 11:46:24.93251+10","feed":"Ver4_2015_10_03_Harn_M7_AscotParkRaceway.xml","loadid":"Ascot Park Raceway NZ2015-10-03HA"},{"time":"2015-09-29 15:01:33.165961+10","feed":"Ver4_2015_10_03_Harn_M7_AscotParkRaceway.xml","loadid":"Ascot Park Raceway NZ2015-10-03HA"},{"time":"2015-09-30 08:46:30.225164+10","feed":"Ver4_2015_10_03_Harn_M7_AscotParkRaceway.xml","loadid":"Ascot Park Raceway NZ2015-10-03HA"}],"history":[{"id":"726bdaa8-ee81-45df-a4ef-8d3774a677cb","time":"2015-09-29 12:10:03.619612+10","userid":"3208eb40-2075-4b4b-9d75-3e84a7c6f194","firstname":"Craig","lastname":"Baxter","type":"Race","message":"Race data","meetingid":"8b893318-2b63-4853-82b8-a03ec9ef943f"},{"id":"58f282de-a956-4a6f-8732-978c6e6da9f7","time":"2015-09-29 12:10:03.84105+10","userid":"3208eb40-2075-4b4b-9d75-3e84a7c6f194","firstname":"Craig","lastname":"Baxter","type":"Runners","message":"First load","meetingid":"8b893318-2b63-4853-82b8-a03ec9ef943f"},{"id":"b2b7eef7-0c51-42b7-8c0c-add8e7b0408b","time":"2015-09-30 13:01:53.994138+10","userid":"3208eb40-2075-4b4b-9d75-3e84a7c6f194","firstname":"Craig","lastname":"Baxter","type":"Runners","message":"Reload: Runners,Jockeys","meetingid":"8b893318-2b63-4853-82b8-a03ec9ef943f"},{"id":"91a0f68b-2c00-4a39-a3ad-e3f85870a898","time":"2015-09-30 13:44:15.109822+10","userid":"3208eb40-2075-4b4b-9d75-3e84a7c6f194","firstname":"Craig","lastname":"Baxter","type":"NZ TXT","message":"Loaded","meetingid":"8b893318-2b63-4853-82b8-a03ec9ef943f"},{"id":"88cd7af2-011b-458d-ad26-1353bab99da0","time":"2015-09-30 13:44:23.295822+10","userid":"3208eb40-2075-4b4b-9d75-3e84a7c6f194","firstname":"Craig","lastname":"Baxter","type":"Selections","message":"Loaded","meetingid":"8b893318-2b63-4853-82b8-a03ec9ef943f"}],"loadid":"8b893318-2b63-4853-82b8-a03ec9ef943f"},{"track":"Bathurst","code":"Bathurst","date":"2015-10-05","type":"GR","runnercount":"100","status":[{"id":"efa65cdc-3514-488c-8bf4-b289290bca3d","loadid":"Bathurst2015-10-05GR","type":"race","time":"2015-09-30 15:26:04.753418","status":"load"},{"id":"b035b033-7ad1-42f3-8ca8-57cbbedc1746","loadid":"Bathurst2015-10-05GR","type":"runner","time":"2015-09-30 15:26:04.684547","status":"load"}],"source":[{"time":"2015-09-30 15:26:04.756885+10","feed":"bf2-BAT05Oct15.xml","loadid":"Bathurst2015-10-05GR"}],"history":[{"id":"8eea6e06-5960-48c4-bea0-91de4f5c17b4","time":"2015-09-30 15:50:52.318097+10","userid":"10bc6670-1aff-405d-9912-ea65ff1abbb5","firstname":"Steve","lastname":"Davison","type":"Race","message":"Race data","meetingid":"43d75148-10bf-4de9-ab32-c5645af3e5fb"},{"id":"20ad6ad3-a35a-4ddf-8480-a2711c5950de","time":"2015-09-30 15:50:52.612691+10","userid":"10bc6670-1aff-405d-9912-ea65ff1abbb5","firstname":"Steve","lastname":"Davison","type":"Runners","message":"First load","meetingid":"43d75148-10bf-4de9-ab32-c5645af3e5fb"},{"id":"b335ef55-6d87-403c-b6e0-05dd00d42605","time":"2015-09-30 15:51:48.253888+10","userid":"10bc6670-1aff-405d-9912-ea65ff1abbb5","firstname":"Steve","lastname":"Davison","type":"Portal","message":"Re-sync meeting","meetingid":"43d75148-10bf-4de9-ab32-c5645af3e5fb"},{"id":"c80b7868-58d4-43d5-a3fa-0d29f6be703f","time":"2015-09-30 15:53:19.071746+10","userid":"10bc6670-1aff-405d-9912-ea65ff1abbb5","firstname":"Steve","lastname":"Davison","type":"Portal","message":"Re-sync meeting","meetingid":"43d75148-10bf-4de9-ab32-c5645af3e5fb"}],"loadid":"43d75148-10bf-4de9-ab32-c5645af3e5fb"},{"track":"Belmont Park","code":"bep","date":"2015-10-03","type":"RA","runnercount":"63","status":[{"id":"678d9ea4-93d3-47e0-966c-dd441705d144","loadid":"bep2015-10-03RA","type":"race","time":"2015-09-30 14:47:03.306482","status":"loaded"},{"id":"88584419-f96d-4967-9390-aa2365e62365","loadid":"bep2015-10-03RA","type":"runner","time":"2015-09-30 14:47:03.26108","status":"load"}],"source":[{"time":"2015-09-30 15:08:14.442428+10","feed":"PMFLB_bep_0310.aap","loadid":"bep2015-10-03RA"},{"time":"2015-09-30 15:10:18.925929+10","feed":"PMFRM_bep_0310.aap","loadid":"bep2015-10-03RA"},{"time":"2015-09-30 15:10:25.202459+10","feed":"PMSTW_bep_0310.aap","loadid":"bep2015-10-03RA"},{"time":"2015-09-30 15:59:02.660199+10","feed":"PMFLB_bep_0310.aap","loadid":"bep2015-10-03RA"},{"time":"2015-09-30 16:47:03.316746+10","feed":"PMFLB_bep_0310.aap","loadid":"bep2015-10-03RA"}],"history":[{"id":"ea9925c8-09bb-48e9-9f89-cc355b5b3204","time":"2015-09-30 15:29:02.176175+10","userid":"01d69050-6d59-484a-9c51-3b378b7c5292","firstname":"Rohan","lastname":"Bassett","type":"Race","message":"Race data","meetingid":"b359002a-b246-4f19-bdc1-804c78d3ce84"},{"id":"58aed3a1-2e15-44a2-909f-0e68ad3187e1","time":"2015-09-30 15:29:05.73145+10","userid":"01d69050-6d59-484a-9c51-3b378b7c5292","firstname":"Rohan","lastname":"Bassett","type":"Runners","message":"First load","meetingid":"b359002a-b246-4f19-bdc1-804c78d3ce84"}],"loadid":"b359002a-b246-4f19-bdc1-804c78d3ce84"}]
        },
        {   // 5 load meetings
            "data" :  'true'
        },
        {	// 6 load meetings
        	"data" : {"track":"Bathurst","code":"Bathurst","date":"2015-10-05","type":"GR","runnercount":"100","status":[{"id":"efa65cdc-3514-488c-8bf4-b289290bca3d","loadid":"Bathurst2015-10-05GR","type":"race","time":"2015-09-30 15:26:04.753418","status":"load"},{"id":"b035b033-7ad1-42f3-8ca8-57cbbedc1746","loadid":"Bathurst2015-10-05GR","type":"runner","time":"2015-09-30 15:26:04.684547","status":"load"}],"source":[{"time":"2015-09-30 15:26:04.756885+10","feed":"bf2-BAT05Oct15.xml","loadid":"Bathurst2015-10-05GR"}],"history":[{"id":"8eea6e06-5960-48c4-bea0-91de4f5c17b4","time":"2015-09-30 15:50:52.318097+10","userid":"10bc6670-1aff-405d-9912-ea65ff1abbb5","firstname":"Steve","lastname":"Davison","type":"Race","message":"Race data","meetingid":"43d75148-10bf-4de9-ab32-c5645af3e5fb"},{"id":"20ad6ad3-a35a-4ddf-8480-a2711c5950de","time":"2015-09-30 15:50:52.612691+10","userid":"10bc6670-1aff-405d-9912-ea65ff1abbb5","firstname":"Steve","lastname":"Davison","type":"Runners","message":"First load","meetingid":"43d75148-10bf-4de9-ab32-c5645af3e5fb"},{"id":"b335ef55-6d87-403c-b6e0-05dd00d42605","time":"2015-09-30 15:51:48.253888+10","userid":"10bc6670-1aff-405d-9912-ea65ff1abbb5","firstname":"Steve","lastname":"Davison","type":"Portal","message":"Re-sync meeting","meetingid":"43d75148-10bf-4de9-ab32-c5645af3e5fb"},{"id":"c80b7868-58d4-43d5-a3fa-0d29f6be703f","time":"2015-09-30 15:53:19.071746+10","userid":"10bc6670-1aff-405d-9912-ea65ff1abbb5","firstname":"Steve","lastname":"Davison","type":"Portal","message":"Re-sync meeting","meetingid":"43d75148-10bf-4de9-ab32-c5645af3e5fb"}],"loadid":"43d75148-10bf-4de9-ab32-c5645af3e5fb"}
        },
        {	// 7 load runners
        	"data": "43d75148-10bf-4de9-ab32-c5645af3e5fb",
        }
    ]

	describe('Meetings screen', function() {

        beforeEach(function() {
			loadFixtures('meetinglist.html');
			z = 0;

            Radb.url = new Radb.Url();
            Radb.state = new Radb.State();
            // Radb.PubSub.subscribe({
            //     'Radb.resource.update'  : [ "load_from_url",
            //                                 "resource/selected",
            //                                 "resource/updated" ],
            //     'Radb.url.update'       : [ "url/updated" ]
            // });

            // spyOn(Radb.resource, 'update');



			// ***************************************
			//               LOAD VIEWS
			// ***************************************
            Radb.meeting_view   = new Radb.View.meetings({'template': template('meetingList'), 'el': $('.meetingsList')});
            Radb.filter         = new Radb.View.filter();
			Radb.race_list_view = new Radb.View.race(    {'template': template('raceData'),    'el': $('.raceList')});
			Radb.runners_view   = new Radb.View.runners( {'template': template('runnersData'), 'el': $('.runnersList')});



            // // ***************************************
			// 			   LOAD COLLECTIONS
			// // ***************************************
			Radb.runners_col = new Radb.Collection.runners(Radb.Model.runner);
			Radb.races_col   = new Radb.Collection.races(Radb.Model.race);
			Radb.meeting_col = new Radb.Collection.meetings(Radb.Model.meeting);



			spyOn($, "ajax").andCallFake(function(params) {
				var d = $.Deferred();
                var xhr = {'status':200};
				d.resolve(ajaxData[z], status, xhr);
				return d.promise();
			});

			spyOn(Radb.PubSub,          'publish');
			spyOn(Radb.meeting_view, 	'render').andCallThrough();
			spyOn(Radb.meeting_view, 	'events').andCallThrough();
			spyOn(Radb.race_list_view, 	'render').andCallThrough();
			spyOn(Radb.race_list_view, 	'events').andCallThrough();
			spyOn(Radb.race_list_view, 	'update').andCallThrough();
			spyOn(Radb.runners_view, 	'render').andCallThrough();
			spyOn(Radb.runners_view, 	'events').andCallThrough();


			page = Radb.meeting_col.fetch().fail(function(r) {
				console.log(r.responseText);
			});
		});




		it("expects Meetings to fetch and publish message", function() {
			page.done(function(r) {
				meetingId = r.data.length -1;
				expect(Radb.meeting_col.meetings[meetingId].data.code).toEqual('tes');
				expect(Radb.PubSub.publish).toHaveBeenCalledWith('meetings/fetched', Radb.meeting_col);
			});
		});

		it("expects Meetings_list view to update after fetch", function() {
			page.done(function(r) {
				z = 0;
				Radb.meeting_view.update('meetings/fetched', Radb.meeting_col);
				expect(Radb.meeting_view.render).toHaveBeenCalled();
				expect(Radb.meeting_view.events).toHaveBeenCalled();
				$('.meetingsList ul:last').click();
                expect(Radb.PubSub.publish).toHaveBeenCalledWith('resource/selected', Radb.state);
			});
		});

        it("expects meeting header information to load", function() {
            page.done(function(r) {
                Radb.meeting_view.update('meetings/fetched', Radb.meeting_col);
                Radb.meeting_view.update('meeting/selected', Radb.meeting_view.meetings.meetings[1].data.id)

                /* test */
                expect( $('.top-main') ).toExist();
                expect( $('#meetingLocation') ).toExist();
                expect( $('#meetingLocation span:nth-child(2)').text()).toEqual('TEST ');

                spyOn(Radb.dialog, 'show').andCallThrough();
                spyOn(Radb.dialog, 'closeWindow').andCallThrough();

                z = 3;
                spyOn(Radb.server, 'create').andCallThrough();
                spyOn(Radb.server, 'update').andCallThrough();
                spyOn(Radb.server, 'delete').andCallThrough();
                /* test colours */
                $('#meeting_buttons button.colours').trigger('click');
                var datum = {'data':[]};
                datum.data.push(ajaxData[3].data);

                expect( $('#dialogButtons button:nth-child(2)')).toExist();

                expect( $('#dialogButtons button:nth-child(2)').text()).toEqual('Cancel');

                $('#dialogButtons button:nth-child(1)').trigger('click');

                expect(Radb.server.create).toHaveBeenCalledWith('jockeysilks', datum);

                $('#dialogButtons button:nth-child(2)').trigger('click');

                expect(Radb.dialog.closeWindow).toHaveBeenCalled();





                /* test sync*/
                z = 0
                Radb.meeting_view.update('meeting/selected', Radb.meeting_view.meetings.meetings[1].data.id)
                var meetingsync = Radb.meeting_view.meetings.meetings[1];
                spyOn(meetingsync, 'sync').andCallThrough();
                $('#meeting_buttons button.sync').trigger('click');

                expect(Radb.dialog.show).toHaveBeenCalledWith("Show TEST  on the portal?", "Warning", meetingsync.sync, meetingsync);

                expect( $('#dialogButtons button:nth-child(2)')).toExist();

                expect( $('#dialogButtons button:nth-child(2)').text()).toEqual('Cancel');

                $('#dialogButtons button:nth-child(1)').trigger('click');

                expect(meetingsync.sync).toHaveBeenCalled();
                expect(Radb.server.update).toHaveBeenCalledWith('meeting/62e6516a-e549-403d-8175-3db41b5e15d6', {'sync':true});


                Radb.dialog.closeWindow();

                /* test unsync */
                spyOn(meetingsync, 'unsync').andCallThrough();
                $('#meeting_buttons button.sync').trigger('click');
                expect(Radb.dialog.show).toHaveBeenCalledWith("Hide TEST  from the portal?", "Warning", meetingsync.unsync, meetingsync);
                $('#dialogButtons button:nth-child(1)').trigger('click');
                expect(meetingsync.unsync).toHaveBeenCalled();
                expect(Radb.server.update).toHaveBeenCalledWith('meeting/62e6516a-e549-403d-8175-3db41b5e15d6', {'unsync':true});



                // // /* test hold */
                spyOn(meetingsync, 'update').andCallThrough();
                $('#meeting_buttons button.hold').trigger('click');
                expect(meetingsync.update).toHaveBeenCalledWith({'disabled':true});


                // /* test delete */
                Radb.dialog.show.reset();
                spyOn(meetingsync, 'delete').andCallThrough();
                $('#meeting_buttons button.delete').trigger('click');
                expect(Radb.dialog.show).toHaveBeenCalledWith("Delete TEST  on 2099-01-01?", "Warning", meetingsync.delete, meetingsync);
                $('#dialogButtons button:nth-child(1)').trigger('click');
                expect(meetingsync.delete).toHaveBeenCalled();

            });
        });





		it("expects a click on meeting item to load race list view", function() {
			page.done(function(r) {

				z = 1;
				Radb.meeting_view.update('meetings/fetched', Radb.meeting_col);
				Radb.races_col.update('meeting/selected', Radb.meeting_view.meetings.meetings[1].data.id).done(function(r) {
					expect(Radb.PubSub.publish).toHaveBeenCalledWith('races/fetched', Radb.races_col);
					Radb.PubSub.publish('races/fetched', Radb.races_col);
					Radb.race_list_view.update('races/fetched', Radb.races_col);
					expect(Radb.race_list_view.update).toHaveBeenCalled();
					expect(Radb.race_list_view.render).toHaveBeenCalled();
					expect( $('.race_data li').eq(2).find('input').val() ).toEqual('TAB Rewards Plate');
					expect( $('.race_data li').eq(1).find('input').val() ).toEqual('13.10');
				});
			});
		});

		it("expects a click on race item to load runners list view", function() {
			page.done(function(r) {
				z = 1;
				Radb.meeting_view.update('meetings/reloaded', Radb.meeting_col);
				Radb.races_col.update('meeting/selected', Radb.meeting_view.meetings.meetings[1].data.id).done(function(r) {
					expect(Radb.PubSub.publish).toHaveBeenCalledWith('races/fetched', Radb.races_col);
					Radb.race_list_view.update('races/fetched', Radb.races_col);
					$('.raceList li:first').click();
					expect( Radb.PubSub.publish ).toHaveBeenCalledWith('race/selected', Radb.race_list_view.data.races[0].data.id);
					z = 2;
					Radb.runners_col.update('race/selected', Radb.race_list_view.data.races[0].data.id);
					expect(Radb.PubSub.publish).toHaveBeenCalledWith('runners/fetched', Radb.runners_col);

					Radb.runners_view.update('runners/fetched', Radb.runners_col);
					expect( $('.runner_data') ).toExist();
					console.log($('.runner_data li').eq(3));
					expect( $('.runner_data li').eq(1).find('input').val() ).toEqual('4879');
					expect( $('.runner_data li').eq(3).find('button').text() ).toEqual('Dane Slugger');
					expect( $('.runner_data li').eq(6).find('input').val() ).toEqual('(14)');
					expect( $('.runner_data li').eq(8).find('input').val() ).toEqual('J A Martin');
					expect( $('.runner_data li').eq(12).find('input').val() ).toEqual('56');
					expect( $('.runner_data li').eq(13).find('input').val() ).toEqual('Bjorn Baker');
					expect( $('.runner_data li').eq(16).find('input').val() ).toEqual('97');
					expect( $('.runner_data li').eq(17).find('input').val() ).toEqual('8');
				});
			});
		});

		it("expects data within a race to update", function() {
			page.done(function(r) {
				z = 1;
				Radb.meeting_view.update('meetings/fetched', Radb.meeting_col);
				Radb.races_col.update('meeting/selected', Radb.meeting_view.meetings.meetings[1].data.id).done(function(r) {
					Radb.race_list_view.update('races/fetched', Radb.races_col);
					$('.raceList li:first').click();

					spyOn(Radb.race_list_view.data.races[0], 'update').andCallThrough();
					$('.race_data li').eq(2).find('input').val('new val').trigger('change');
					expect( Radb.race_list_view.data.races[0].update).toHaveBeenCalledWith({'name': "new val"});


					$('.race_data li').eq(3).find('input').val('andy cap').trigger('change');
					expect( Radb.race_list_view.data.races[0].update).toHaveBeenCalledWith({'name2': "andy cap"});

					$('.race_data li').eq(4).find('input').val('grade6').trigger('change');
					expect( Radb.race_list_view.data.races[0].update).toHaveBeenCalledWith({'class': "grade6"});

					$('.race_data li').eq(6).find('input').val('10').trigger('change');
					expect( Radb.race_list_view.data.races[0].update).toHaveBeenCalledWith({'distance': "10"});

					expect(Radb.PubSub.publish).toHaveBeenCalledWith('race/updated', Radb.race_list_view.data.races[0]);
					expect( Radb.race_list_view.data.races[0].data.name).toEqual('new val');
					expect( Radb.race_list_view.data.races[0].data.name2).toEqual('andy cap');
					expect( Radb.race_list_view.data.races[0].data.class).toEqual('grade6');
					expect( Radb.race_list_view.data.races[0].data.distance).toEqual('10');

				});

			});
		});

		it("expects data within a runner to update", function() {
			page.done(function(r) {
				z = 1;
				Radb.meeting_view.update('meetings/fetched', Radb.meeting_col);
				z = 2;
				Radb.runners_col.update('meeting/selected', Radb.meeting_view.meetings.meetings[0].data.id).done(function(r) {

					Radb.runners_view.update('runners/fetched', Radb.runners_col);
					spyOn(Radb.runners_view.data.runners[0], 'update').andCallThrough();

					$('.runner_data:first').find('li').eq(1).find('input').val('666').trigger('change');
					expect( Radb.runners_view.data.runners[0].update).toHaveBeenCalledWith({'record': "666"});

					// $('.runner_data:first').find('li').eq(3).find('input').val('new runner').trigger('change');
					// expect( Radb.runners_view.data.runners[0].update).toHaveBeenCalledWith({'name': "new runner"});

					$('.runner_data:first').find('li').eq(8).find('input').val('barry').trigger('change');
					expect( Radb.runners_view.data.runners[0].update).toHaveBeenCalledWith({'jockey': "barry"});

					$('.runner_data:first').find('li').eq(9).find('input').val('5').trigger('change');
					expect( Radb.runners_view.data.runners[0].update).toHaveBeenCalledWith({'claim': "5"});

					$('.runner_data:first').find('li').eq(17).find('input').val('999').trigger('change');
					expect( Radb.runners_view.data.runners[0].update).toHaveBeenCalledWith({'market': "999", 'supplier': ""});

					// $('.runner_data:first').find('li').eq(9).find('input').val('Harry').trigger('change');
					// expect( Radb.runners_view.data.runners[0].update).toHaveBeenCalledWith({'jockey2': "Harry"});

					// expect( Radb.PubSub.publish).toHaveBeenCalledWith('runner/updated', Radb.runners_view.data.runners[0]);
					// expect( Radb.runners_view.data.runners[0].data.name).toEqual('new runner');

					expect( Radb.runners_view.data.runners[0].data.record).toEqual('666');
					// expect( Radb.runners_view.data.runners[0].data.jockey).toEqual('barry');
					expect( Radb.runners_view.data.runners[0].data.claim).toEqual('5');
					// expect( Radb.runners_view.data.runners[0].data.jockey2).toEqual('Harry');
					expect( Radb.runners_view.data.runners[0].data.market).toEqual('999');

					$('.runner_data:first').find('li').eq(2).find('div').trigger('click');
					expect( Radb.runners_view.data.runners[0].data.tip).toEqual(true);

				});
			});
		});

	});

















	describe('Load screen', function() {

		beforeEach(function() {
			loadFixtures('loadlist.html');
			z = 4;

			Radb.url      = new Radb.Url();
			Radb.state   = new Radb.State();


			// ***************************************
			//               LOAD VIEWS
			// ***************************************

			Radb.load_view = new Radb.View.load({'template': template('loadList'), 'el': $('.meetingsList')});
			Radb.feed      = new Radb.Feed.load();
			Radb.filter    = new Radb.View.filter();


            Radb.load_history = new Radb.View.load_history({'template': template('meetingHistory'), 'el': '#historyData'});
            Radb.load_source  = new Radb.View.load_source({'template': template('meetingSource'), 'el': '#sourceData'});
            Radb.load_feed    = new Radb.View.load_feed({'template': template('load-box'), 'el': '#importBox'});
            // Radb.source_feed  = new Radb.View.load_diff({'template': template('source-feed'), 'el': '#importBox'});



			// // ***************************************
			//             LOAD COLLECTIONS
			// // ***************************************
			Radb.load_col = new Radb.Collection.load(Radb.Model.loadModel);



			spyOn($, "ajax").andCallFake(function(params) {
				var d = $.Deferred();
				var xhr = {'status':200};
				d.resolve(ajaxData[z], status, xhr);
				return d.promise();
			});

			spyOn(Radb.PubSub,       'publish')
			spyOn(Radb.load_view,    'render').andCallThrough();
			spyOn(Radb.load_view,    'events').andCallThrough();


			page = Radb.load_col.fetch().fail(function(r) {
				console.log(r.responseText);
			});
		});




		it("expects Load meetings to fetch and publish message", function() {
			page.done(function(r) {
				meetingId = 0;
				expect(Radb.load_col.meetings[meetingId].data.code).toEqual('Angle Park');
				expect(Radb.PubSub.publish).toHaveBeenCalledWith('load/fetched', Radb.load_col);
			});
		});

		it("expects Load_list view to update after fetch", function() {
			page.done(function(r) {
				Radb.load_view.update('load/fetched', Radb.load_col);
				z = 6;

				// console.log(Radb.load_view.meetings.meetings);

				spyOn( Radb.load_view.meetings.meetings[3], 'fetch' ).andCallThrough();
				$('.meetingsList > div:last').click();
				expect(Radb.PubSub.publish).toHaveBeenCalledWith('load/fetched', Radb.load_col);
				expect(Radb.load_view.render).toHaveBeenCalled();
				expect(Radb.load_view.events).toHaveBeenCalled();

				expect(Radb.load_view.meetings.meetings[3].fetch).toHaveBeenCalledWith(null);

				spyOn( Radb.load_view, 'renderLoadInfo').andCallThrough();

				// Radb.load_view.renderLoadInfo(ajaxData[6]);

				// expect(Radb.load_view.renderLoadInfo).toHaveBeenCalledWith(ajaxData[6]);
				expect( $('.loadContainer') ).toExist();
				expect( $('#historyData') ).toExist();
				expect( $('#sourceData') ).toExist();

				expect( $('#importBox') ).toExist();

				// console.log( $('.meetingsList > div:last li.meeting').text() );
				// console.log(Radb.load_col.meetings);
				expect($('.meetingsList > div:last li.meeting').text()).toEqual('Bathurst');
				var elem = $('.meetingsList > div:last div.load-actions > button');
				expect(elem).toHaveClass('load');
				// console.log(elem);
			});
		});

		it("expects Load_list item button to load", function() {
			page.done(function(r) {
				z = 6;

				// render the load list
				Radb.load_view.update('load/fetched', Radb.load_col);

				// select the last meeting (Bathurst)
				$('.meetingsList > div:last').click();

				var elem = $('.meetingsList > div:last div.load-actions > button');
				expect(elem).toHaveClass('load');

				spyOn( Radb.load_col.meetings[3], 'load' ).andCallThrough();
				spyOn(Radb.server, 'create').andCallThrough();

				// click the load button
				elem.click();
				expect(Radb.load_col.meetings[3].load).toHaveBeenCalledWith({'feed': 'race'});
				expect(Radb.server.create).toHaveBeenCalledWith('load/Bathurst,2015-10-05,GR', {'feed': 'race'});
				expect(Radb.PubSub.publish).toHaveBeenCalledWith('load/fetched', Radb.load_col);
			});
		});


		it("expects Load_list item button to update", function() {
			page.done(function(r) {
				z = 6;

				spyOn( Radb.load_col.meetings[3], 'load' ).andCallThrough();
				spyOn( Radb.server, 'create').andCallThrough();
				spyOn( Radb.server, 'update').andCallThrough();

				// render the load list
				Radb.load_view.update('load/fetched', Radb.load_col);

				// select the last meeting (Bathurst)
				$('.meetingsList > div:nth-child(2)').click();
				// click the update button
				var elem = $('.meetingsList > div:nth-child(2) div.load-actions > button');
				expect(elem).toHaveClass('update');
				elem.click();
				expect($('#importOptWindow')).toExist();

				// Close the window
				$('#importClose').click();

				// Re-open the window
				elem.click();
				var load            = $('#import');
				var importList      = $('#importList');
				var loadAll         = importList.find('li:nth-child(1)');


				// z=7;
				loadAll.click();
				load.click();
				expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'All': true});

				elem.click();
				var load            = $('#import');
				var importList      = $('#importList');
				var loadRaceHeaders = importList.find('li:nth-child(3)');

				Radb.server.update.reset();
				loadRaceHeaders.click();
				load.click();
				expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Raceheaders': true});


				elem.click();
				var load            = $('#import');
				var importList      = $('#importList');
				var racetime        = importList.find('li:nth-child(4)');

				Radb.server.update.reset();
				racetime.click();
				load.click();
				expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Racetimes': true});

                elem.click();
                var load            = $('#import');
                var importList      = $('#importList');
                var racetime        = importList.find('li:nth-child(5)');

                Radb.server.update.reset();
                racetime.click();
                load.click();
                expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Racenames': true});


                elem.click();
                var load            = $('#import');
                var importList      = $('#importList');
                var loadStewards    = importList.find('li:nth-child(6)');

                Radb.server.update.reset();
                loadStewards.click();
                load.click();
                expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Stewards': true});

                elem.click();
                var load            = $('#import');
                var importList      = $('#importList');
                var loadStewards    = importList.find('li:nth-child(7)');

                Radb.server.update.reset();
                loadStewards.click();
                load.click();
                expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Distance': true});

                elem.click();
                var load            = $('#import');
                var importList      = $('#importList');
                var loadStewards    = importList.find('li:nth-child(8)');

                Radb.server.update.reset();
                loadStewards.click();
                load.click();
                expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Tips': true});


				elem.click();
				var load            = $('#import');
				var importList      = $('#importList');
				var runners         = importList.find('li:nth-child(10)');

				Radb.server.update.reset();
				runners.click();
				load.click();
				expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Runners': true});


				elem.click();
				var load            = $('#import');
				var importList      = $('#importList');
				var loadJockeys     = importList.find('li:nth-child(11)');

				Radb.server.update.reset();
				loadJockeys.click();
				load.click();
				expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Jockeys': true});


				elem.click();
				var load            = $('#import');
				var importList      = $('#importList');
				var loadMarket      = importList.find('li:nth-child(12)');

				Radb.server.update.reset();
				loadMarket.click();
				load.click();
				expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Market': true});

				elem.click();
				var load            = $('#import');
				var importList      = $('#importList');
				var loadRating      = importList.find('li:nth-child(13)');

				Radb.server.update.reset();
				loadRating.click();
				load.click();
				expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Ratings': true});

				elem.click();
				var load            = $('#import');
				var importList      = $('#importList');
				var loadRating      = importList.find('li:nth-child(14)');

				Radb.server.update.reset();
				loadRating.click();
				load.click();
				expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Silks': true});


				elem.click();
				var load            = $('#import');
				var importList      = $('#importList');
				var loadRating      = importList.find('li:nth-child(15)');

				Radb.server.update.reset();
				loadRating.click();
				load.click();
				expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Formbank': true});

				elem.click();
				var load            = $('#import');
				var importList      = $('#importList');
				var loadRating      = importList.find('li:nth-child(16)');

				Radb.server.update.reset();
				loadRating.click();
				load.click();
				expect(Radb.server.update).toHaveBeenCalledWith('load/Ascot Park Raceway NZ,2015-10-03,HA', {'Brief': true});

			});
		});




		it("expects feeds box to display", function() {
			page.done(function(r) {

				z = 6;
				// render the load list
				Radb.load_view.update('load/fetched', Radb.load_col);

                Radb.PubSub.publish.reset();

				// select the last meeting (Bathurst)
				$('.meetingsList > div:last').click();
				expect(Radb.PubSub.publish).toHaveBeenCalledWith('load/selected', ajaxData[6].data);

                Radb.load_feed.update('load/selected', Radb.load_view.meetings.meetings[3].data);

				var elem = $('.load-top');
				expect(elem).toExist();

				var elem = $('#importBox');
				expect(elem).toExist();

				spyOn( Radb.feed, 'update' ).andCallThrough();
                spyOn( Radb.effects, 'message' );

				var textbox = document.getElementById('feed-textbox');
				expect(textbox).toExist();
				textbox.value = "dummy data";

				// // Comment
				elem = $('.import-options > .feed_save:nth-child(1)');
				expect(elem.data('feed')).toEqual('comment');
				elem.click();
				Radb.feed.update('load/import', {'meeting': ajaxData[z].data.id, 'text': textbox.value, 'feed': elem.text().toLowerCase()});

				expect(Radb.feed.update).toHaveBeenCalled();

				// NZ TXT File
				elem = $('.import-options > .feed_save:nth-child(2)');
				expect(elem.data('feed')).toEqual('nztxt');
				elem.click();

				Radb.feed.update('load/import', {'meeting': ajaxData[z].data.id, 'text': textbox.value, 'feed': elem.data('feed')});

				expect(Radb.feed.update).toHaveBeenCalled();

				// // Tips
				elem = $('.import-options > .feed_save:nth-child(3)');
				expect(elem.data('feed')).toEqual('tips');
				elem.click();
				Radb.feed.update('load/import', {'meeting': ajaxData[z].data.id, 'text': textbox.value, 'feed': elem.text().toLowerCase()});

				expect(Radb.feed.update).toHaveBeenCalled();

				// Market
				elem = $('.import-options > .feed_save:nth-child(4)');
				expect(elem.data('feed')).toEqual('market');
				elem.click();
				Radb.feed.update('load/import', {'meeting': ajaxData[z].data.id, 'text': textbox.value, 'feed': elem.text().toLowerCase()});

				expect(Radb.feed.update).toHaveBeenCalled();

				// Clear
				elem = $('.import-options > .feed_clear');
				expect(elem.text()).toEqual('Clear');
				elem.click();
				expect(textbox.value).toEqual('');
			});
		});




	});

});
