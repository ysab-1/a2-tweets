function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
    // DOM update helper to prevent crashes if an ID doesn't match
    function safeSetText(id, text) {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = text;
        }
    }
    
    // Update total tweet count[cite: 3]
    safeSetText('numberTweets', tweet_array.length);
    
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	// Find earliest and latest tweet dates
    if (tweet_array.length > 0) {
        const sortedTweets = [...tweet_array].sort(function(a, b) {
            return a.getTime().getTime() - b.getTime().getTime();
        });

        const earliestDate = sortedTweets[0].getTime();
        const latestDate = sortedTweets[sortedTweets.length - 1].getTime();

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        safeSetText('earliest', earliestDate.toLocaleDateString('en-US', options));
        safeSetText('latest', latestDate.toLocaleDateString('en-US', options));
    }

	// Analyzing tweet categories count & percentages
    let completedCount = 0;
    let liveCount = 0;
    let achievementCount = 0;
    let miscCount = 0;

    tweet_array.forEach(function(t) {
        const cat = t.source;
        if (cat === 'completed event') completedCount++;
        else if (cat === 'live event') liveCount++;
        else if (cat === 'achievement') achievementCount++;
        else miscCount++;
    });

    const totalTweets = tweet_array.length;

    safeSetText('completed', completedCount);
    safeSetText('completedPct', math.format((completedCount / totalTweets) * 100, {notation: 'fixed', precision: 2}) + '%');

    safeSetText('live', liveCount);
    safeSetText('livePct', math.format((liveCount / totalTweets) * 100, {notation: 'fixed', precision: 2}) + '%');

    safeSetText('achievements', achievementCount);
    safeSetText('achievementsPct', math.format((achievementCount / totalTweets) * 100, {notation: 'fixed', precision: 2}) + '%');

    safeSetText('miscellaneous', miscCount);
    safeSetText('miscellaneousPct', math.format((miscCount / totalTweets) * 100, {notation: 'fixed', precision: 2}) + '%');

	// Calculating user-written tweets
    let writtenCompletedCount = 0;
    tweet_array.forEach(function(t) {
        if (t.source === 'completed event' && t.written) {
            writtenCompletedCount++;
        }
    });

    safeSetText('written', writtenCompletedCount);
    const completedPctOfWritten = completedCount > 0 ? (writtenCompletedCount / completedCount) * 100 : 0;
    safeSetText('writtenPct', math.format(completedPctOfWritten, {notation: 'fixed', precision: 2}) + '%');
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});