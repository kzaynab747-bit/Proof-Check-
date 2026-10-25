# ProofCheck

**Pause. Check the evidence. Decide carefully.**

ProofCheck is a browser-based educational prototype that highlights selected warning patterns in suspicious messages and suggests ways to verify claims independently.

## Problem
People may receive suspicious job offers, shopping deals, payment requests, or messages that pressure them to click, pay, or share sensitive information. They may not know which parts to examine or how to verify the sender.

## What it does
- Analyzes pasted text locally in the browser.
- Highlights phrases matched by transparent JavaScript rules.
- Explains why each warning pattern may matter.
- Provides practical verification steps.
- Includes English and selected Roman Urdu patterns.
- Includes sample messages for demonstration.
- Does not send the pasted message to a server.

## Important limitations
ProofCheck does not determine whether a message is definitively fraudulent. A rule match is not proof of fraud, and no match is not proof of safety. The rules may produce false positives and false negatives, and the sample phrases cover only a limited range of wording. Do not use this prototype as the sole basis for financial, legal, or security decisions.

## Technology
- HTML
- CSS
- JavaScript
- Regular expressions and browser DOM APIs

No backend, package installation, or paid API is required.

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Alternatively, open the folder in VS Code and use Live Server.

## Demo
Try the built-in Job offer, Shopping deal, Ordinary message, and Roman Urdu samples. Then edit the wording to explore how the rules respond.

## Privacy
The current implementation analyzes the message in the browser and does not transmit it to a server. Avoid pasting passwords, one-time codes, private identity information, or other sensitive content into any demonstration tool.

## Original contribution
This repository implements the interface, rule definitions, evidence highlighting, explanations, and verification checklist as a hackathon prototype. The author/team should accurately describe and verify their own contributions before submission.

## Future improvements
- Expand and test language coverage.
- Add a transparent, reproducible test suite.
- Add optional domain or organization verification using trusted sources.
- Improve accessibility and user testing.

## License
MIT. See [LICENSE](LICENSE).
