//Variables===================================================	
var request = require('request');
var keys = require("./keys.js");
var inquirer = require("inquirer");
var fs = require("fs");
var twitter = require('twitter');
var spotify = require('spotify');

//store tweeter keys in a variable
var client = new twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});
//============================================================



//Functions===================================================

//This function generates tweets response.
function tweet(data) {
    for (var i = 0; i < data.length; i++) {
        console.log("====================================================================");
        console.log("");
        console.log("TWEET " + (i + 1));
        console.log(data[i].created_at);
        console.log(data[i].text);
        console.log("BY: " + data[i].user.name);
        console.log("");
        console.log("====================================================================");
    }
}
//This function asks user to type a song name, and use the song name to search from the spotify api and organize the response.
function spotifire() {
    inquirer.prompt([{
        type: "input",
        message: "Please type the name of the song you wish to look up",
        name: "name"
    }]).then(function(user) {
        var songName = user.name;
        //This if statement checks to see if the user has input the song. otherwise it will default to search "The Sign" by Ace of Base.
        if (songName == "") songName = "The Sign Ace of Base";
        spotify.search({ type: "track", query: songName }, function(err, data) {
            if (err) console.log("Error occurred: " + err);
            for (var i = 0; i < data.tracks.items.length; i++) {
                console.log("====================================================================");
                console.log("");
                console.log("Search " + (i + 1));
                console.log("Artist Name: " + data.tracks.items[i].album.artists[0].name);
                console.log("The Song's Name: " + data.tracks.items[i].name);
                console.log("A preview link of the song: " + data.tracks.items[i].external_urls.spotify);
                console.log("The Album's Name: " + data.tracks.items[i].album.name);
                console.log("");
                console.log("====================================================================");
            }
        })
    });
}
//This function retrieve data from imdb.
function imdbcall() {
    inquirer.prompt([{
        type: "input",
        message: "Please type the name of movie you would like to search",
        name: 'name'
    }]).then(function(user) {
        var movieName = user.name;
        var queryUrl = 'http://www.omdbapi.com/?t=' + movieName;
        request(queryUrl, function(error, response, body) {
            if (error || response.statsuCode !== 200) console.log(error);
            console.log("====================================================================");
            console.log("");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes: " + JSON.stringify(JSON.parse(body).Ratings[1]));
            console.log("");
            console.log("====================================================================");
        });
    });
}
//Main function
function main(command) {
    switch (command) {
        case 'my-tweets':
            //get method will access to tweeter account using a client variable which preset with the keys then it will retrieve 20 most recent statues and home timeline messages.
            //noinspection JSUndeclaredVariable
            client.get('statuses/home_timeline', count = 1, function(error, tweets, response) {
                if (error || response.statusCode !== 200) console.log(error);
                tweet(tweets);
            });
            break;
        case 'spotify-this-song':
            spotifire();
            break;
        case 'movie-this':
            imdbcall();
            break;
        case 'do-what-it-says':
            fs.readFile("random.txt", "utf8", function(error, data) {
                console.log(data.split(",")[0]);
                command= data.split(",")[0];
            });
            break;

    }
}


//============================================================





//Main Process================================================

//this prompt will give users a selection of choices.
inquirer.prompt([{
    type: 'list',
    message: "Please choose from one of the following",
    choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
    name: 'command'
}]).then(function(user) {
    //set up the user choise as a variable, so we can easily use it on our functions.
    var command = user.command;
    main(command);
});




//============================================================
