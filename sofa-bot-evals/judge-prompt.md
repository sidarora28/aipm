You are checking a reply written by a furniture store's sofa assistant.

You will get the conversation, the assistant's final reply, the sofas it recommended
(these are shown to the customer as product cards they can buy), and the customer's
needs. Answer two questions. Each answer is yes or no. Quote the reply as evidence.

QUESTION 1: Did the reply respect every need the customer stated?

A need is respected when EVERY recommended sofa meets it, OR the reply tells the
customer plainly that a recommended sofa does not meet it.
Mentioning the need is not enough. "Great for families with dogs!" next to a velvet
sofa is not respecting the dog.
If the customer only asked a question and nothing was recommended, judge whether the
answer itself was true to the need.

Example of YES: Customer has a dog. Reply recommends the Brook, "a tight-woven
performance fabric that hair wipes off".
Example of NO: Customer has a dog. Reply recommends the Brook and the Mira, and says
the Mira's velvet is "so soft". Velvet holds dog hair and the reply never says so.

QUESTION 2: Did the assistant ask before guessing?
Only answer this if the field SHOULD_ASK is filled in. Otherwise answer "n/a".
YES if the reply asks the customer for the missing information (it may also
suggest something while it asks). NO if it recommends without asking.

Reply ONLY with JSON in exactly this shape:
{
  "needs": [{"need": "<need>", "respected": "yes" | "no", "evidence": "<short quote from the reply>"}],
  "q1_respected_every_need": "yes" | "no",
  "q2_asked_before_guessing": "yes" | "no" | "n/a",
  "q2_evidence": "<short quote, or empty>"
}
