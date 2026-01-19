# AutoUniversalPaperclips
Fully automate Universal Paperclips by Frank Lantz

# Play the Game
[Universal Paperclips](https://www.decisionproblem.com/paperclips/index2.html)

# How to Use
Copy-paste the contents of the JS file into your browser console while playing universal paperclips.

# What does it do?
## Phase 1
* Automatically set paperclip prices
* Click the make paperclip button
* Buy autoclippers, megaclippers, and marketing.
* Buy projects
* Click quantum chips when it provides positive value
* Make investments
* Strategic modeling
* Assign processors and memory using Trust

## Phase 2
* Buy harvester drones & wire drones
* Maintain >100% power
* Buy factories
* Sell factories and drones once the earth runs out of material

## Phase 3
* Click make probe
* Increase probe trust
* Entertain the swarm
* Increase max trust
* Design probes

# Issues
I consider this script a work-in-progress. There's multiple sections that don't behave anywhere close to optimal. Currently it takes more than 10 hours to beat the game, and some parts might require manual intervention.

## Investments
This needs to be rewritten with a more comprehensive investment strategy. The current algorithm somehow lets it go into negative money, and also doesn't allow it to easily buy trust worth more than $10,000,000. I thought that was the max, but there's at least one level of trust that's worth $60,000,000. It should withdraw increasingly large amounts of money, proportional to the amount needed to buy buildings and upgrades at the present moment.

## Transition to space age
I haven't tested whether selling all of the factories and drones is the right strategy to proceed with the space age. This might need manual intervention when you get to this point.

## Strategic modeling
I haven't bothered to crunch the numbers on the strategic modeling component, so right now it just sums the payout of A and B and goes all in on whichever one is higher. It works decently, and you will not be short of yomi, but it could be better.
