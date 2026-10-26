function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
    if(runkeeper_tweets === undefined) {
        window.alert('No tweets returned');
        return;
    }
    
    const tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });

    // Filter completed events
    const completedTweets = tweet_array.filter(t => t.source === 'completed event');

    // Count activity frequencies
    let activityCounts = {};
    completedTweets.forEach(t => {
        let type = t.activityType;
        activityCounts[type] = (activityCounts[type] || 0) + 1;
    });

    // Sort activities by frequency descending
    let sortedActivities = Object.keys(activityCounts).sort((a, b) => activityCounts[b] - activityCounts[a]);

    // Helper to safely update DOM elements without crashing if an ID doesn't match
    function safeSetText(id, text) {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = text;
        }
    }

    // Update Spans safely
    safeSetText('numberActivities', sortedActivities.length);
    safeSetText('firstMost', sortedActivities[0] || '');
    safeSetText('secondMost', sortedActivities[1] || '');
    safeSetText('thirdMost', sortedActivities[2] || '');

    // Top 3 activities for distance analysis
    const top3 = sortedActivities.slice(0, 3);
    const top3Tweets = completedTweets.filter(t => top3.includes(t.activityType));

    // Determine longest and shortest activity types among top 3
    let activityDistances = {};
    top3.forEach(act => {
        let acts = completedTweets.filter(t => t.activityType === act);
        let totalDist = acts.reduce((sum, t) => sum + t.distance, 0);
        activityDistances[act] = totalDist / acts.length;
    });

    let longestAct = Object.keys(activityDistances).reduce((a, b) => activityDistances[a] > activityDistances[b] ? a : b, top3[0] || '');
    let shortestAct = Object.keys(activityDistances).reduce((a, b) => activityDistances[a] < activityDistances[b] ? a : b, top3[0] || '');

    safeSetText('longestActivityType', longestAct);
    safeSetText('shortestActivityType', shortestAct);

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

    safeSetText('longerType', avgWeekend > avgWeekday ? 'weekends' : 'weekdays');

    // --- Vega-Lite Visualizations ---

    // 1. Activity type count visualization[cite: 4]
    let activityData = Object.keys(activityCounts).map(act => ({
        activity: act,
        count: activityCounts[act]
    }));

    let activity_vis_spec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "description": "A graph of the number of Tweets containing each type of activity.",
      "data": {
        "values": activityData
      },
      "mark": "bar",
      "encoding": {
        "x": {"field": "activity", "type": "nominal", "axis": {"labelAngle": -45}, "title": "Activity Type"},
        "y": {"field": "count", "type": "quantitative", "title": "Count"}
      }
    };
    vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

    // 2. Distance by day of week visualization (Raw points)
    let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let distanceData = top3Tweets.map(t => ({
        day: dayNames[t.getTime().getDay()],
        distance: t.distance,
        activity: t.activityType
    }));

    let distance_vis_spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Distances by day of the week for top 3 activities.",
        "data": {
            "values": distanceData
        },
        "mark": "point",
        "encoding": {
            "x": {"field": "day", "type": "nominal", "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "title": "time (day)"},
            "y": {"field": "distance", "type": "quantitative", "title": "distance"},
            "color": {"field": "activity", "type": "nominal", "title": "activity type"}
        }
    };

    // 3. Aggregated distance visualization (Mean)[cite: 4, 5]
    let aggregated_vis_spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Mean distances by day of the week for top 3 activities.",
        "data": {
            "values": distanceData
        },
        "mark": "point",
        "encoding": {
            "x": {"field": "day", "type": "nominal", "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "title": "time (day)"},
            "y": {"field": "distance", "aggregate": "mean", "type": "quantitative", "title": "Mean of distance"},
            "color": {"field": "activity", "type": "nominal", "title": "activity type"}
        }
    };

    // Render initial chart
    vegaEmbed('#distanceVis', distance_vis_spec, {actions: false});

    // Toggle button event listener to switch between raw points and aggregated means[cite: 4, 5]
    let isAggregated = false;
    const aggregateButton = document.getElementById('aggregate');
    
    if (aggregateButton) {
        aggregateButton.addEventListener('click', function() {
            isAggregated = !isAggregated;
            let currentView = isAggregated ? aggregated_vis_spec : distance_vis_spec;
            
            vegaEmbed('#distanceVis', currentView, {actions: false}).catch(function(error) {
                console.error("Vega embed error:", error);
            });
            
            aggregateButton.innerText = isAggregated ? "Show all points" : "Show means";
        });
    }
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});