# ProofCheck manual test cases

These examples are for testing rule behavior, not for establishing a real-world detection rate.

## 1. Expected warning matches: job offer
> Congratulations! You have been selected for a remote internship. Pay a refundable registration fee within 30 minutes to secure your position. Send your CNIC and bank details now.

Expected: upfront-payment, urgency, sensitive-info, and likely job-fee signals. The exact count can vary if rules are adjusted.

## 2. Expected warning matches: shopping
> FLASH SALE! You won a brand new phone. Click this link immediately and pay a small delivery fee to claim your free prize. Offer expires in 10 minutes.

Expected: prize-bait, link-pressure, urgency, and payment-related signal(s).

## 3. Benign control
> Hello, your appointment is confirmed for Tuesday at 3 PM. Please bring the documents listed in your appointment email. If you need to reschedule, contact our office using the number on our official website.

Expected: no known warning patterns. This does not prove the message is genuine.

## 4. Roman Urdu
> Mubarak ho! Aap job ke liye select ho gaye hain. Apni seat confirm karne ke liye abhi registration fee bhejein. Sirf 10 minutes hain warna offer cancel ho jayegi. Apna bank code bhi send karein.

Expected: some combination of payment, urgency, job-fee, and sensitive-information signals. If a rule fails to match, record it as a known limitation and improve the rule.

## 5. Potential false positive
> The official conference registration fee is due by Friday. Please pay through the university portal listed on the official website.

Expected: the payment rule may match. This is a possible false positive: a legitimate payment reminder can contain fee language. The tool should not call the message fraudulent.

## 6. Potential false negative
> We would love to offer you a position. Kindly complete the final step using our usual process.

Expected: possibly no warning match. A vague or cleverly worded scam may evade the current rules.

## How to test
For each example:
1. Paste the text or load the closest built-in sample.
2. Analyze it.
3. Record which rules triggered.
4. Note missed signals and benign wording that triggered.
5. Change rules carefully and rerun all cases.

Do not report an accuracy percentage unless you build a larger labeled test set, define a valid evaluation method, and calculate the result reproducibly.
