import { Router } from 'meteor/iron:router';

Router.route('/api/geolocation', { where: 'server' })
  .get(function() {
    this.response.end('ok');
  })
  .post(function() {
    console.log(this.request.body);
    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end('ok');
  })
  .put(function() {
    console.log(this.request.body);
    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end('ok');
  });
