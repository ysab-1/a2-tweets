class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

    // Returns the date of the tweet
    public getTime():Date {
        return this.time;
    }

	// Getter for tweet source
    get source():string {
        const lowerText = this.text.toLowerCase();

        // Check for completed events
        if (lowerText.startsWith("just completed") || lowerText.startsWith("just posted")) {
            if (lowerText.includes("right now")) {
                return "live event";
            }
            return "completed event";
        } 
        // Check for live events
        else if (lowerText.startsWith("watch") || lowerText.includes("right now")) {
            return "live event";
        } 
        // Check for achievements
        else if (lowerText.includes("achieved") || lowerText.includes("goal") || lowerText.includes("set a")) {
            return "achievement";
        } 
        // Default to miscellaneous
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
        if (this.source !== "completed event") {
            return "unknown";
        }
        const lower = this.text.toLowerCase();
        
        // Check specific activity keywords first
        if (lower.includes("bike") || lower.includes("biking") || lower.includes("cycling")) {
            return "biking";
        }
        if (lower.includes("walk") || lower.includes("walking")) {
            return "walking";
        }
        if (lower.includes("run") || lower.includes("running") || lower.includes("ran")) {
            return "running";
        }
        if (lower.includes("swim") || lower.includes("swimming")) {
            return "swimming";
        }
        if (lower.includes("ski") || lower.includes("skiing")) {
            return "skiing";
        }
        if (lower.includes("hike") || lower.includes("hiking")) {
            return "hiking";
        }
        if (lower.includes("elliptical")) {
            return "elliptical";
        }
        if (lower.includes("yoga")) {
            return "yoga";
        }
        if (lower.includes("core workout")) {
            return "core workout";
        }
    
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