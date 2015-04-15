var Commands = new Mongo.Collection('Commands');

if (Meteor.isClient) {
  Router.route('home', {
    path: '/',
    data: Commands.find({}, {sort: {timestamp: -1}, limit: 20})
  });

  /**

   Log the given item in the console

   @function log
   @memberof TemplateHelpers
   @param {Object} The item to be logged
   */

  Template.registerHelper('log', function(item) {
    return console.log(item);
  });
}

if (Meteor.isServer) {
  var io = Meteor.npmRequire('socket.io')(5001);
  var dateformat = Meteor.npmRequire('dateformat');

  Meteor.startup(function () {// basic server
    io.on ('connection', Meteor.bindEnvironment(function (socket) {
      socket.on ('sync', function (id) {
        socket.join (id);
      });

      socket.on ('message', Meteor.bindEnvironment(function (id, msg) {
        socket.broadcast.to (id).emit (msg);
	var date = new Date();
	formattedDate = dateformat(date, 'yyyy/mm/dd HH:MM:ss') + ':' + date.getMilliseconds();
        Commands.insert({message: msg, teamId: id, timestamp: formattedDate})
        console.log ('[' + formattedDate + '] ' + id + ': \'' + msg + '\'');
      }));

      socket.on ('send', Meteor.bindEnvironment(function (id, msg) {
        socket.broadcast.to (id).emit (msg);
        var date = new Date();
        formattedDate = dateformat(date, 'yyyy/mm/dd HH:MM:ss') + ':' + date.getMilliseconds();
        Commands.insert({message: msg, teamId: id, timestamp: formattedDate})
        console.log ('[' + formattedDate + '] ' + id + ': \'' + msg + '\'');
      }));

    }));

    console.log ('socket server on localhost:4000');
  });
}
