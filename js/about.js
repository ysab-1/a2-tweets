function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	// Find earliest and latest tweet dates
    const sortedTweets = [...tweet_array].sort(function(a, b) {
        return a.getTime().getTime() - b.getTime().getTime();
    });

    const earliestDate = sortedTweets[0].getTime();
    const latestDate = sortedTweets[sortedTweets.length - 1].getTime();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('earliest').innerText = earliestDate.toLocaleDateString('en-US', options);
    document.getElementById('latest').innerText = latestDate.toLocaleDateString('en-US', options);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});