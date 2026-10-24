const quotes = [
    { text: "Success is the sum of small efforts repeated day after day.", author: "Robert Collier", category: "HABIT" },
    { text: "Make it simple, but significant.", author: "Don Draper", category: "DESIGN" },
    { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra", category: "WISDOM" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "MOMENTUM" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi", category: "FOCUS" },
    { text: "Stay hungry. Stay foolish.", author: "Steve Jobs", category: "MINDSET" },
    { text: "Small progress is still progress.", author: "Anonymous", category: "GROWTH" },
    { text: "Discipline beats motivation every single time.", author: "Anonymous", category: "DISCIPLINE" },
    { text: "Your only limit is your mind.", author: "Anonymous", category: "COURAGE" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso", category: "CREATIVITY" },
    { text: "Focus is a muscle. The more you practice, the stronger it gets.", author: "Cal Newport", category: "DEEP WORK" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "GRIT" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "PERSISTENCE" },
    { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear", category: "SYSTEMS" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", category: "WISDOM" }
];

const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const categoryEl = document.getElementById("quote-category");
const newQuoteBtn = document.getElementById("new-quote");
const copyQuoteBtn = document.getElementById("copy-quote-btn");
const quoteBox = document.getElementById("quote-box");

let lastIndex = -1;

function displayQuote() {
    let index;
    do {
        index = Math.floor(Math.random() * quotes.length);
    } while (index === lastIndex && quotes.length > 1);

    lastIndex = index;
    const item = quotes[index];

    quoteBox.classList.add("fade-out");
    setTimeout(() => {
        quoteEl.textContent = `“${item.text}”`;
        authorEl.textContent = `— ${item.author}`;
        categoryEl.textContent = item.category;
        quoteBox.classList.remove("fade-out");
    }, 200);
}

newQuoteBtn.addEventListener("click", () => {
    window.playChime?.("tick");
    displayQuote();
});

copyQuoteBtn.addEventListener("click", () => {
    const textToCopy = `${quoteEl.textContent} ${authorEl.textContent}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            window.showToast?.("Quote copied to clipboard!", "check");
            window.playChime?.("pop");
        });
    } else {
        prompt("Copy quote:", textToCopy);
    }
});

displayQuote();