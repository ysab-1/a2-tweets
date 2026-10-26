let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// Map raw objects to Tweet instances and filter to just user-written completed tweets
    const tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });

    writtenTweets = tweet_array.filter(t => t.source === 'completed event' && t.written);
}

function addEventHandlerForSearch() {
	// Search the written tweets as text is entered into the search box, and add them to the table
    const searchBox = document.getElementById('textFilter');
    const tableBody = document.getElementById('tweetTable');
    const searchCountSpan = document.getElementById('searchCount');
    const searchTextSpan = document.getElementById('searchText');

    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const query = e.target.value;
            searchTextSpan.innerText = query;

            // Clear table if search text is empty
            if (!query || query.trim() === "") {
                tableBody.innerHTML = "";
                searchCountSpan.innerText = "0";
                return;
            }

            const lowerQuery = query.toLowerCase();
            const matchingTweets = writtenTweets.filter(t => t.text.toLowerCase().includes(lowerQuery));

            searchCountSpan.innerText = matchingTweets.length;

            let rowsHTML = "";
            matchingTweets.forEach((t, index) => {
                rowsHTML += t.getHTMLTableRow(index + 1);
            });

            tableBody.innerHTML = rowsHTML;
        });
    }
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});