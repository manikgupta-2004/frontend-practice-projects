const btn = document.getElementById("analyzeBtn");
const inputText = document.getElementById("inputText");
const loader = document.getElementById("loader");
const result = document.getElementById("result");

btn.addEventListener("click", analyze);

function analyze() {
    const text = inputText.value.trim();
    if (!text) {
        alert("Please enter text.");
        return;
    }

    loader.style.display = "block";
    result.style.display = "none";

    setTimeout(() => {
        const analysis = analyzeText(text);
        displayResult(analysis);
        loader.style.display = "none";
    }, 1200);
}

function detectLanguage(text) {
    if (/[\u0900-\u097F]/.test(text)) return "Hindi";
    if (text.toLowerCase().match(/\b(tum|agar|sabko|pata|kyun|nahi|ho|hai)\b/)) return "Hinglish";
    return "English";
}

function analyzeText(text) {
    let score = 0;
    let manipulation = "None Detected";
    let tone = "Neutral";

    const lower = text.toLowerCase();

    const guilt = ["if you really", "after everything", "agar tum", "agar tumne", "अगर तुम"];
    const gaslight = ["you're imagining", "never happened", "tum galat ho", "तुम गलत हो"];
    const dominance = ["you must", "tumhe karna hoga", "तुम्हें करना होगा"];
    const aggression = ["shut up", "stupid", "idiot", "चुप रहो"];

    if (guilt.some(w => lower.includes(w))) {
        score += 25;
        manipulation = "Guilt Tripping";
        tone = "Emotionally Pressuring";
    }

    if (gaslight.some(w => lower.includes(w))) {
        score += 30;
        manipulation = "Gaslighting";
        tone = "Psychologically Manipulative";
    }

    if (dominance.some(w => lower.includes(w))) {
        score += 20;
        manipulation = "Dominance / Control";
        tone = "Authoritative";
    }

    if (aggression.some(w => lower.includes(w))) {
        score += 25;
        tone = "Aggressive";
    }

    if (text.includes("!!!")) score += 10;

    if (score > 100) score = 100;

    let riskLabel;
    if (score < 30) riskLabel = "Low Psychological Risk";
    else if (score < 60) riskLabel = "Moderate Manipulation Risk";
    else riskLabel = "High Psychological Manipulation";

    return {
        score,
        manipulation,
        tone,
        language: detectLanguage(text),
        explanation: generateExplanation(score, manipulation, tone)
    };
}

function generateExplanation(score, manipulation, tone) {
    if (score < 30) {
        return "The message appears neutral with minimal psychological manipulation indicators.";
    }
    if (score < 60) {
        return "The message shows moderate emotional or psychological influence patterns. Be aware of subtle pressure tactics.";
    }
    return "This message contains strong psychological manipulation signals such as " + manipulation + ". Caution is advised.";
}

function displayResult(data) {
    document.getElementById("riskScore").textContent = data.score;
    document.getElementById("riskLabel").textContent = data.score < 30 ? 
        "Low Risk" : data.score < 60 ? "Moderate Risk" : "High Risk";

    document.getElementById("language").textContent = data.language;
    document.getElementById("manipulation").textContent = data.manipulation;
    document.getElementById("tone").textContent = data.tone;
    document.getElementById("explanation").textContent = data.explanation;

    result.style.display = "block";
}