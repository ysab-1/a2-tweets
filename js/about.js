function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
    // Helper for IDs
    function setIdText(id, text) {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = text;
        }
    }

    // Helper for Classes (updates all matching elements on the page)
    function setClassText(className, text) {
        const elements = document.querySelectorAll('.' + className);
        if (elements.length > 0) {
            elements.forEach(el => {
                el.innerText = text;
            });
        }
    }

    // Update total tweet count
    setIdText('numberTweets', tweet_array.length);

	// Find earliest and latest tweet dates
    if (tweet_array.length > 0) {
        const sortedTweets = [...tweet_array].sort(function(a, b) {
            return a.getTime().getTime() - b.getTime().getTime();
        });

        const earliestDate = sortedTweets[0].getTime();
        const latestDate = sortedTweets[sortedTweets.length - 1].getTime();

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setIdText('firstDate', earliestDate.toLocaleDateString('en-US', options));
        setIdText('lastDate', latestDate.toLocaleDateString('en-US', options));
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

    setClassText('completedEvents', completedCount);
    setClassText('completedEventsPct', math.format((completedCount / totalTweets) * 100, {notation: 'fixed', precision: 2}) + '%');

    setClassText('liveEvents', liveCount);
    setClassText('liveEventsPct', math.format((liveCount / totalTweets) * 100, {notation: 'fixed', precision: 2}) + '%');

    setClassText('achievements', achievementCount);
    setClassText('achievementsPct', math.format((achievementCount / totalTweets) * 100, {notation: 'fixed', precision: 2}) + '%');

    setClassText('miscellaneous', miscCount);
    setClassText('miscellaneousPct', math.format((miscCount / totalTweets) * 100, {notation: 'fixed', precision: 2}) + '%');

	// Calculating user-written tweets
    let writtenCompletedCount = 0;
    tweet_array.forEach(function(t) {
        if (t.source === 'completed event' && t.written) {
            writtenCompletedCount++;
        }
    });

    setClassText('written', writtenCompletedCount);
    const completedPctOfWritten = completedCount > 0 ? (writtenCompletedCount / completedCount) * 100 : 0;
    setClassText('writtenPct', math.format(completedPctOfWritten, {notation: 'fixed', precision: 2}) + '%');
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});