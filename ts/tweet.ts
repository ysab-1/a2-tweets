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

    // Getter that strips user-written text of URLs, Runkeeper text, hashtags, and links
    get writtenText():string {
        let cleaned = this.text;
        // Remove URLs
        cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, "");
        // Remove #RunKeeper
        cleaned = cleaned.replace(/#RunKeeper/gi, "");
        // Remove common RunKeeper boilerplate prefixes
        cleaned = cleaned.replace(/Just completed a\s*[\d.]+\s*(mi|km)\s*\w+with\s*@RunKeeper\.?/gi, "");
        cleaned = cleaned.replace(/Just posted a\s*[\d.]+\s*(mi|km)\s*\w+with\s*@RunKeeper\.?/gi, "");
        cleaned = cleaned.replace(/Just completed a\s*[\d.]+\s*\w+with\s*@RunKeeper\.?/gi, "");
        cleaned = cleaned.replace(/Just posted a\s*[\d.]+\s*\w+with\s*@RunKeeper\.?/gi, "");
        return cleaned.trim();
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