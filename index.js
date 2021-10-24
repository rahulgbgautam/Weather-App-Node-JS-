const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");
const replaceVal = (tempVal,orgval)=>{
	let temprature = tempVal.replace("{%temp%}",orgval.main.temp/10);
	temprature = temprature.replace("{%temp_min%}",orgval.main.temp_min/10);
	temprature = temprature.replace("{%temp_max%}",orgval.main.temp_max/10);
	temprature = temprature.replace("{%location%}",orgval.name);
	temprature = temprature.replace("{%country%}",orgval.sys.country);
	temprature = temprature.replace("{%status%}",orgval.weather[0].main);
	// console.log(orgval);
	// console.log(temprature);
	return temprature;
};

const server = http.createServer((req,res)=>{

	if(req.url == "/"){
		requests("https://api.openweathermap.org/data/2.5/weather?q=lucknow&appid=9dd31a5fed6fd9ea127fe45c72ca4480")
			.on("data", (chunk) => {
				const objData = JSON.parse(chunk);
				const arrData = [objData];
				// console.log(arrData[0].main.temp);
				const realTimeData = arrData
				.map((val) => replaceVal(homeFile,val))
				.join("");
				console.log(realTimeData);
				res.write(realTimeData);
			})
			.on("end", (err) => {
				if(err){
					console.log("connection close due to error");
				}
					res.end();
			});
	}

});

server.listen(8000,"127.0.0.1");

