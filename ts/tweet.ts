class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	// Getter for tweet source
    get source():string {
        // Categorizing RunKeeper tweets
        if (this.text.toLowerCase().includes("completed") || this.text.toLowerCase().includes("posted a workout") || this.text.toLowerCase().includes("ran") || this.text.toLowerCase().includes("walked") || this.text.toLowerCase().includes("biked")) {
            // Check state of action
            if (this.text.toLowerCase().includes("right now")) {
                return "live event";
            }
            return "completed event";
        } else if (this.text.toLowerCase().includes("achieved") || this.text.toLowerCase().includes("goal") || this.text.toLowerCase().includes("set a")) {
            return "achievement";
        } else if (this.text.toLowerCase().includes("watch") || this.text.toLowerCase().includes("download")) {
            return "miscellaneous";
        }
        
        // Processing common RunKeeper phrases
        if (this.text.includes("Just completed") || this.text.includes("Just posted")) {
            return "completed event";
        } else if (this.text.includes("Watch")) {
            return "live event";
        } else if (this.text.includes("achieved")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    // Getter that determines is tweet contains original, user-written text
    get written():boolean {
        if (this.source !== "completed event") {
            return false;
        }
        let textWithoutTags = this.writtenText;
        return textWithoutTags.trim().length > 0;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}