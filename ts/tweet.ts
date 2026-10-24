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

    // Getter for activity type in tweet
    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        const lower = this.text.toLowerCase();
        if (lower.includes("run")) return "running";
        if (lower.includes("bike") || lower.includes("biking") || lower.includes("cycling")) return "biking";
        if (lower.includes("walk")) return "walking";
        if (lower.includes("swim")) return "swimming";
        if (lower.includes("ski")) return "skiing";
        if (lower.includes("hike")) return "hiking";
        if (lower.includes("chair ride")) return "chair ride";
        if (lower.includes("elliptical")) return "elliptical";
        if (lower.includes("yoga")) return "yoga";
        if (lower.includes("core workout")) return "core workout";
        return "other";
    }

    // Getter for distance of run in miles
    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        // Match direct conversions like "3.11 mi" or "5 km"
        const match = this.text.match(/([\d.]+)\s*(mi|km)/i);
        if (!match) return 0;

        const val = parseFloat(match[1]);
        const unit = match[2].toLowerCase();

        if (unit === "km") {
            // Convert kilometers to miles
            return val / 1.609;
        }
        return val;
    }

    // Helper to make HTML table row for description page
    getHTMLTableRow(rowNumber:number):string {
        // Make links clickable
        let formattedText = this.text.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
        );

        return `<tr>
            <td>${rowNumber}</td>
            <td>${this.activityType}</td>
            <td>${formattedText}</td>
        </tr>`;
    }
}