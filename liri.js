//Variables
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
//store user inputs in a variable
var string = process.argv;
    //user's commands.
var command = string[2];
//This variable captures the user input
var choice = string[3];
if (string[4]) {
    for (var i = 4; i < string.length; i++) {
        choice += " " + string[i];
    }
}
//============================================================

//Functions
//This function generates tweets response.
function tweet(data) {
    //This is an empty array which will store the data in JSON format.
    var array = [];
    for (var i = 0; i < data.length; i++) {
        var object = {};
        object.Count = (i + 1);
        object.Date = data[i].created_at;
        object.Tweet = data[i].text;
        object.User = data[i].user.name;
        array.push(object);
    }
    console.log(JSON.stringify(array, null, 2));
    //BONUS this will store the data to a log.txt file.
    store(JSON.stringify(array, null, 2));

}
//This function uses users song name to search the song from spotify.
function spotifire(choice) {
    var songName = choice;
    //This if statement checks to see if the user has input the song. otherwise it will default to search "The Sign" by Ace of Base.
    if (songName === undefined) songName = "The Sign Ace of Base";
    console.log(songName);
    spotify.search({ type: "track", query: songName }, function(err, data) {
        if (err) console.log("Error occurred: " + err);
        var array = [];
        for (var i = 0; i < data.tracks.items.length; i++) {
            var object = {};
            object.Search = (i + 1);
            object.ArtistName = data.tracks.items[i].album.artists[0].name;
            object.SongName = data.tracks.items[i].name;
            object.PreviewLink = data.tracks.items[i].external_urls.spotify;
            object.AlbumName = data.tracks.items[i].album.name;
            array.push(object);
        }
        console.log(JSON.stringify(array, null, 2));
        store(JSON.stringify(array, null, 2));
    });
}
//This function retrieve data from imdb using user's input.
function imdbcall(choice) {
    var movieName = choice;
    //This if statement checks to see if the user has input the movie name, otherwise it will set the default movie title as "Mr. Nobody"
    if (movieName === undefined) movieName = "Mr. Nobody";
    console.log(movieName);
    var queryUrl = 'http://www.omdbapi.com/?t=' + movieName;
    request(queryUrl, function(error, response, body) {
        if (error || response.statsuCode !== 200) console.log(error);
        var text = {};
        text.Title = JSON.parse(body).Title;
        text.Year = JSON.parse(body).Year;
        text.imdbRating = JSON.parse(body).imdbRating;
        text.Country = JSON.parse(body).Country;
        text.Language = JSON.parse(body).Language;
        text.Plot = JSON.parse(body).Plot;
        text.Actors = JSON.parse(body).Actors;
        text.RottenTomatoes = JSON.stringify(JSON.parse(body).Ratings[1]);
        console.log(JSON.stringify(text, null, 2));
        store(JSON.stringify(text, null, 2));
    });
}
//Main function
function main(command) {
    switch (command) {
        case 'my-tweets':
            //get method will access to tweeter account using a client variable which preset with the keys then it will retrieve 20 most recent statues and home timeline messages.
            client.get('statuses/home_timeline', function(error, tweets, response) {
                if (error || response.statusCode !== 200) console.log(error);
                tweet(tweets);
            });
            break;
        case 'spotify-this-song':
            spotifire(choice);
            break;
        case 'movie-this':
            imdbcall(choice);
            break;
        case 'do-what-it-says':
            fs.readFile("random.txt", "utf8", function(error, data) {
                command = data.split(",")[0];
                choice = data.split(",")[1];
                main(command)
            });
            break;
        default:
            console.log("Choose from the below list");
            console.log("1.node liri.js my-tweets");
            console.log("2.node liri.js spotify-this-song '<song name here>'");
            console.log("3.node liri.js movie-this '<movie name here>'");
            console.log("4.node liri.js do-what-it-says");
            break;
    }
}
//Bonus question, This function will store the response to the log txt file.
function store(text) {
    fs.appendFile('log.txt', text, function(error) {
        if (error) console.log(error);
    });
}
//============================================================

//Main Process
main(command);
//============================================================
