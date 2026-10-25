const messageInput = document.getElementById("messageInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const charCount = document.getElementById("charCount");
const emptyState = document.getElementById("emptyState");
const report = document.getElementById("report");
const statusPill = document.getElementById("statusPill");
const signalCount = document.getElementById("signalCount");
const summaryText = document.getElementById("summaryText");
const cautionText = document.getElementById("cautionText");
const highlightedMessage = document.getElementById("highlightedMessage");
const findingsContainer = document.getElementById("findings");
const checklistContainer = document.getElementById("checklist");

const samples = {
  job: "Congratulations! You have been selected for a remote internship with a salary of Rs. 80,000 per month. Pay a refundable registration fee of Rs. 2,000 within 30 minutes to secure your position. Send your CNIC and bank details now.",
  shopping: "FLASH SALE! You won a brand new phone. Click this link immediately and pay a small delivery fee to claim your free prize. Offer expires in 10 minutes. Do not miss this chance!",
  benign: "Hello, your appointment is confirmed for Tuesday at 3 PM. Please bring the documents listed in your appointment email. If you need to reschedule, contact our office using the number on our official website.",
  urdu: "Mubarak ho! Aap job ke liye select ho gaye hain. Apni seat confirm karne ke liye abhi registration fee bhejein. Sirf 10 minutes hain warna offer cancel ho jayegi. Apna bank code bhi send karein."
};

// Each rule has a pattern, an explanation, a severity label, and a verification action.
// These are warning signals only; no single match proves fraud.
const rules = [
  {
    id: "upfront-payment",
    title: "Upfront payment request",
    level: "high",
    patterns: [
      /\b(pay|payment|send|transfer|deposit)\b.{0,45}\b(registration fee|processing fee|refundable fee|advance fee|security fee|fee)\b/i,
      /\b(registration fee|processing fee|refundable fee|advance fee|security fee)\b/i,
      /\b(fee|payment|paisa|paise|raqam)\b.{0,40}\b(bhejein|bhejo|jama karwa|transfer karein|send karein)\b/i,
      /\b(paisa|paise|raqam)\b.{0,35}\b(bhejein|bhejo|jama karwa|transfer)\b/i
    ],
    explanation: "Requests for money to unlock a job, prize, delivery, or opportunity deserve independent verification. Some legitimate services charge fees, so check the organization and the reason for payment.",
    action: "Do not pay based only on this message. Find the organization’s official contact details independently and confirm whether the fee is real."
  },
  {
    id: "urgency",
    title: "Pressure or artificial urgency",
    level: "medium",
    patterns: [
      /\b(within \d+ minutes?|only \d+ minutes?|immediately|right now|act now|expires in \d+ minutes?|last chance|urgent|limited time|do not delay)\b/i,
      /\b(abhi|foran|jaldi|sirf \d+ minutes?|10 minutes hain|warna offer cancel|aaj hi)\b/i
    ],
    explanation: "A very short deadline can pressure people into acting before checking the details. Urgency alone does not prove a message is fraudulent.",
    action: "Pause. Verify the offer through a separate, trusted channel before clicking, paying, or sharing information."
  },
  {
    id: "sensitive-info",
    title: "Request for sensitive information",
    level: "high",
    patterns: [
      /\b(password|one[- ]time password|otp|pin code|bank details|card number|cvv|recovery code|private key)\b/i,
      /\b(cnic|identity card|bank code|account details)\b.{0,35}\b(send|share|reply|provide|now|bhejein|send karein)\b/i,
      /\b(send|share|provide|reply with|bhejein|send karein)\b.{0,35}\b(cnic|identity card|bank code|otp|password|pin)\b/i
    ],
    explanation: "Passwords, one-time codes, PINs, and financial details can be used to access accounts or make unauthorized transactions. Some legitimate processes request identity documents, but the channel and purpose must be verified.",
    action: "Never share passwords, PINs, or one-time codes in response to an unsolicited message. Verify identity-document requests through the official organization."
  },
  {
    id: "prize-bait",
    title: "Unexpected prize or reward",
    level: "medium",
    patterns: [
      /\b(you won|you have won|claim your prize|free prize|free phone|winner selected|congratulations.{0,30}(prize|winner|selected))\b/i,
      /\b(mubarak ho|inaam jeet|prize jeeta|free gift|gift mila)\b/i
    ],
    explanation: "Unexpected prizes can be used to lure people into paying fees or sharing information. Check whether you entered the promotion and whether it is listed on an official source.",
    action: "Do not use links or phone numbers supplied in the message until you have independently verified the promotion."
  },
  {
    id: "threat-or-pressure",
    title: "Threatening or coercive language",
    level: "medium",
    patterns: [
      /\b(account will be blocked|account suspended|legal action|police case|final warning|account will close|immediate arrest)\b/i,
      /\b(account band|account block|police case|warna account band|warna offer cancel)\b/i
    ],
    explanation: "Threats may be used to make recipients react without checking. Genuine organizations can also send urgent notices, so confirm through an independently found official channel.",
    action: "Do not call numbers or open links solely because the message threatens you. Visit the official website or app directly."
  },
  {
    id: "link-pressure",
    title: "Link or click pressure",
    level: "medium",
    patterns: [
      /\b(click this link|click here|open this link|verify your account here|tap the link|link par click|is link ko kholein)\b/i,
      /\bhttps?:\/\/[^\s]+/i,
      /\bwww\.[^\s]+/i
    ],
    explanation: "Links can lead to legitimate pages or deceptive copies. A link's presence alone is not proof of danger; inspect the destination carefully and avoid unexpected sign-in or payment pages.",
    action: "If you need to check the claim, navigate to the service's official site yourself instead of following an unexpected link."
  },
  {
    id: "job-fee",
    title: "Recruitment offer with a fee",
    level: "high",
    patterns: [
      /\b(job|internship|employment|salary|selected for a position|hiring)\b.{0,100}\b(registration fee|processing fee|security fee|advance fee|pay to secure|fee to confirm)\b/i,
      /\b(job|internship|naukri|mulazmat)\b.{0,80}\b(fee|paisa|payment|registration)\b/i
    ],
    explanation: "A job or internship offer tied to an upfront payment is a strong reason to verify the employer and recruitment process. This rule is broad and may flag legitimate training or placement services.",
    action: "Find the employer's official careers page independently and contact its published HR channel. Do not rely only on a recruiter’s message."
  },
  {
    id: "too-good",
    title: "Unusually attractive promise",
    level: "medium",
    patterns: [
      /\b(guaranteed profit|double your money|earn \d+%|no risk|instant loan guaranteed|easy money|salary of rs\.?\s?\d{4,})\b/i,
      /\b(ghar baithe lakhon|guaranteed profit|paisa double|bina risk|asani se lakh)\b/i
    ],
    explanation: "Unusually large or guaranteed rewards can be used to attract quick decisions. The wording alone cannot establish whether the offer is genuine.",
    action: "Check the terms, organization, and independent reviews. Be skeptical of guaranteed returns or income claims that lack verifiable evidence."
  }
];

function updateCharacterCount() {
  charCount.textContent = `${messageInput.value.length} / 8000`;
}

function findMatches(text) {
  const matches = [];
  for (const rule of rules) {
    const rangesForRule = [];
    for (const pattern of rule.patterns) {
      // Reset state in case a future rule uses a global regular expression.
      pattern.lastIndex = 0;
      const match = pattern.exec(text);
      if (match && match[0].length > 0) {
        rangesForRule.push({
          start: match.index,
          end: match.index + match[0].length,
          phrase: match[0]
        });
      }
    }
    // Keep the first match per rule so repeated phrases do not inflate the report.
    if (rangesForRule.length) {
      rangesForRule.sort((a, b) => a.start - b.start);
      matches.push({ ...rule, ...rangesForRule[0] });
    }
  }
  return matches.sort((a, b) => a.start - b.start);
}

function renderHighlightedText(text, matches) {
  // Build safe DOM nodes instead of injecting user text as HTML.
  highlightedMessage.replaceChildren();
  let cursor = 0;

  for (const match of matches) {
    if (match.start < cursor) continue;
    if (match.start > cursor) {
      highlightedMessage.appendChild(document.createTextNode(text.slice(cursor, match.start)));
    }

    const mark = document.createElement("mark");
    mark.className = match.level;
    mark.textContent = text.slice(match.start, match.end);
    mark.title = match.title;
    highlightedMessage.appendChild(mark);
    cursor = match.end;
  }

  if (cursor < text.length) {
    highlightedMessage.appendChild(document.createTextNode(text.slice(cursor)));
  }
  if (!text.length) highlightedMessage.textContent = "No message provided.";
}

function getChecklist(matches) {
  const actions = matches.map(match => match.action);
  const general = [
    "Look up the organization independently; do not rely only on contact details in the message.",
    "Check the sender address, domain, and context for inconsistencies.",
    "If money or sensitive information is requested, pause and confirm through a trusted official channel."
  ];
  const combined = [...actions, ...general];
  return [...new Set(combined)].slice(0, 6);
}

function renderFindings(matches) {
  findingsContainer.replaceChildren();

  if (!matches.length) {
    const card = document.createElement("article");
    card.className = "finding";
    const title = document.createElement("h4");
    title.textContent = "No known warning pattern matched";
    const explanation = document.createElement("p");
    explanation.textContent = "This does not mean the message is safe. Scams can use wording these simple rules do not recognize. Verify important claims independently.";
    card.append(title, explanation);
    findingsContainer.appendChild(card);
    return;
  }

  for (const match of matches) {
    const card = document.createElement("article");
    card.className = "finding";

    const headingRow = document.createElement("div");
    headingRow.className = "finding-title";

    const title = document.createElement("h4");
    title.textContent = match.title;

    const level = document.createElement("span");
    level.className = `level ${match.level}`;
    level.textContent = match.level === "high" ? "HIGH CONCERN SIGNAL" : "CHECK CAREFULLY";

    const phrase = document.createElement("p");
    phrase.className = "matched";
    phrase.textContent = `Matched phrase: “${match.phrase}”`;

    const explanation = document.createElement("p");
    explanation.textContent = match.explanation;

    headingRow.append(title, level);
    card.append(headingRow, phrase, explanation);
    findingsContainer.appendChild(card);
  }
}

function renderChecklist(matches) {
  checklistContainer.replaceChildren();
  for (const action of getChecklist(matches)) {
    const item = document.createElement("li");
    item.textContent = action;
    checklistContainer.appendChild(item);
  }
}

function analyzeMessage() {
  const text = messageInput.value.trim();

  if (!text) {
    messageInput.focus();
    statusPill.textContent = "Message needed";
    statusPill.className = "pill caution";
    emptyState.hidden = false;
    report.hidden = true;
    return;
  }

  const matches = findMatches(text);
  const highCount = matches.filter(match => match.level === "high").length;

  emptyState.hidden = true;
  report.hidden = false;
  signalCount.textContent = matches.length;

  if (highCount > 0) {
    statusPill.textContent = "Verify before acting";
    statusPill.className = "pill high";
    summaryText.textContent = "High-concern signal(s) found";
  } else if (matches.length > 0) {
    statusPill.textContent = "Check carefully";
    statusPill.className = "pill caution";
    summaryText.textContent = "Warning pattern(s) found";
  } else {
    statusPill.textContent = "No patterns matched";
    statusPill.className = "pill neutral";
    summaryText.textContent = "No known warning pattern matched";
  }

  cautionText.textContent = "This is a rule-based screening result, not a fraud verdict or a probability. A message can be risky even if no signal is found.";
  renderHighlightedText(text, matches);
  renderFindings(matches);
  renderChecklist(matches);
}

analyzeBtn.addEventListener("click", analyzeMessage);
messageInput.addEventListener("input", updateCharacterCount);

clearBtn.addEventListener("click", () => {
  messageInput.value = "";
  updateCharacterCount();
  emptyState.hidden = false;
  report.hidden = true;
  statusPill.textContent = "Waiting for message";
  statusPill.className = "pill neutral";
  messageInput.focus();
});

document.querySelectorAll("[data-sample]").forEach(button => {
  button.addEventListener("click", () => {
    messageInput.value = samples[button.dataset.sample] || "";
    updateCharacterCount();
    analyzeMessage();
  });
});

updateCharacterCount();
