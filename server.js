// RUN USING THE FOLLOWING COMMAND
 // node server.js -e js,hbs

// -----------------------------------------------------------------------------------

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// The below command is to used to run the app in heroku. The OR statement is used to run the file locally.
const port = process.env.PORT || 3000;
var app = express();

// Partials are the code which is repeated in every file, so we can store them in a directory
// and call them whenever required instead of rewriting the entire code
hbs.registerPartials(__dirname + '/views/partials');

// Setting the view engine to hbs(stortform for handlebars)
// The directory to get the data from the view engine is by default "views"
app.set('view engine', 'hbs');

// If we don't call next, the remaining program will not be executed
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if(err){
			console.log('Some error Occured');
		}
	});
	next();
});

// The below line is used to serve static files from the directory mentioned inside the
// express.static argument
// For eg: we can run localhost:3000/help.html
// The help.html file is inside the public directory
app.use(express.static(__dirname + '/public'));

// Since we did not put next, we will not go ahead
// We get all our requests but we will not process ahead as the site is in mainataiance
/*app.use((req, res, next) => {
	res.render('maintainance.hbs');
});*/

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

// Another helper
hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
})

app.get('/', (req, res) => {
	// The below two lines sends HTMlL data 
	/*res.send(`Hello Express`);
	res.send(`<h1>Hello Express</h1>`);*/

	// Sending JSON data. The below object will be rendered as JSON by the browser
	/*res.send({
		name: 'Andrew',
		likes: [
			'Food',
			'Games',
			'Fun'
		]
	});*/

	res.render('home.hbs', {
		pageTitle: 'Home Page',
		message: 'Welcome to the application !!!'
		// We will use helper function for year since it is same for all pages
		// currentYear: new Date().getFullYear()
	})
});

// Here we can send a response when the user requests data from about page
app.get('/about', (req, res) => {
	// res.send('About page')

	// The about.hbs file should be in "views" directory
	res.render('about.hbs', {
		pageTitle: 'About Page'
		// We will use helper function for year since it is same for all pages		
		// currentYear: new Date().getFullYear()
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Unable to process request'
	});
});

// The listener is very important. It listens to the request on the port 3000 in the local machine
// The second callback is optional
app.listen(port, () => {
	console.log('Server is up and running at port', port);
});
