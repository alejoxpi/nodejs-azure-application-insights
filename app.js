const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

/* Show how to use AI */
let start = Date.now();
let appInsights = require('applicationinsights');
const { ExceptionData } = require('applicationinsights/out/Declarations/Contracts');
appInsights.setup('InstrumentationKey=cca25d53-xxxxxx');
appInsights.defaultClient.config.samplingPercentage = 100; // 33% of all telemetry will be sent to Application Insights
appInsights.start();
let client = appInsights.defaultClient;
client.trackEvent({name: "my custom event", properties: {customProperty: "custom property value"}});


const server = http.createServer((req, res) => {
  client.trackNodeHttpRequest({request: req, response: res});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  
  /* Exceptions */
  client.trackException({exception: new Error("handled exceptions can be logged with this method")});
  client.flush();
   
  res.end('Hello World');
});

server.listen(port, hostname, () => {   
  /* Metrics */
  let duration = Date.now() - start;
  client.trackMetric({name: "server startup time", value: duration}); 
  client.trackEvent({name: "my custom event", properties: {customProperty: "Server running"}});
  console.log(`Server running at http://${hostname}:${port}/`);
});