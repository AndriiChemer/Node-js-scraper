const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

//ipconfig getifaddr en0 (like ip address) 
// Home IP: 192.168.0.164
server.listen(port, '192.168.0.164' || 'localhost', () => {console.log('App is listening on port 3000!')});