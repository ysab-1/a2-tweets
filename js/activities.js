function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// Filter completed events
	completedTweets = tweet_array.filter(t => t.source === 'completed event');

	// Count activity frequencies
	let activityCounts = {};
    completedTweets.forEach(t => {
        let type = t.activityType;
        activityCounts[type] = (activityCounts[type] || 0) + 1;
    });

	// Sort activities by frequency in descending order
    let sortedActivities = Object.keys(activityCounts).sort((a, b) => activityCounts[b] - activityCounts[a]);

	// Update spans for activity counts and top activities
    document.getElementById('numberActivities').innerText = sortedActivities.length;
    document.getElementById('firstMost').innerText = sortedActivities[0] || '';
    document.getElementById('secondMost').innerText = sortedActivities[1] || '';
    document.getElementById('thirdMost').innerText = sortedActivities[2] || '';

    // Tracking the top 3 activities for distance analysis
	const top3 = sortedActivities.slice(0, 3);
    const top3Tweets = completedTweets.filter(t => top3.includes(t.activityType));

	// Determine longest and shortest activity types among the top 3
    let activityDistances = {};
    top3.forEach(act => {
        let acts = completedTweets.filter(t => t.activityType === act);
        let totalDist = acts.reduce((sum, t) => sum + t.distance, 0);
        activityDistances[act] = totalDist / acts.length;
    });

    let longestAct = Object.keys(activityDistances).reduce((a, b) => activityDistances[a] > activityDistances[b] ? a : b, top3[0]);
    let shortestAct = Object.keys(activityDistances).reduce((a, b) => activityDistances[a] < activityDistances[b] ? a : b, top3[0]);

    document.getElementById('longestActivityType').innerText = longestAct;
    document.getElementById('shortestActivityType').innerText = shortestAct;

	// Weekday vs Weekend analysis
    let weekdayDistances = [];
    let weekendDistances = [];
    completedTweets.forEach(t => {
        let day = t.getTime().getDay(); // 0 is Sunday, 6 is Saturday
        if (day === 0 || day === 6) {
            weekendDistances.push(t.distance);
        } else {
            weekdayDistances.push(t.distance);
        }
    });

    let avgWeekday = weekdayDistances.reduce((a, b) => a + b, 0) / (weekdayDistances.length || 1);
    let avgWeekend = weekendDistances.reduce((a, b) => a + b, 0) / (weekendDistances.length || 1);

    document.getElementById('longerType').innerText = avgWeekend > avgWeekday ? 'weekends' : 'weekdays';

	
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});