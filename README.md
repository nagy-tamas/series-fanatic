# series-fanatic

## What is this?

A command line tool to list episodes of series aired in the close past and future, so you won't miss anything.

Sample output:

```
node check

2015-10-26 (Mon)  -  The Big Bang Theory S9#6: The Helium Insufficiency
2015-10-28 (Wed)  -  American Horror Story S5#4: Devil's Night
2015-10-28 (Wed)  -  South Park S19#6: Tweek x Craig
2015-10-31 (Sat)  -  Ash vs. Evil Dead S1#1: El Jefe
2015-11-01 (Sun)  -  Once upon a Time S5#6: The Bear and the Bow
2015-11-01 (Sun)  -  The Walking Dead S6#4: Here's Not Here
-------- NOW ---------
2015-11-04 (Wed)  -  American Horror Story S5#5: Room Service
2015-11-05 (Thu)  -  The Big Bang Theory S9#7: The Spock Resonance
2015-11-07 (Sat)  -  Ash vs. Evil Dead S1#2: Bait
2015-11-08 (Sun)  -  Family Guy S14#5: Peter, Chris, & Brian
2015-11-08 (Sun)  -  Once upon a Time S5#7: Nimue
2015-11-08 (Sun)  -  The Simpsons S27#6: Friend with Benefit
2015-11-08 (Sun)  -  The Walking Dead S6#5: Now
2015-11-11 (Wed)  -  American Horror Story S5#6: Room 33
2015-11-11 (Wed)  -  Modern Family S7#6: The More You Ignore Me
2015-11-12 (Thu)  -  The Big Bang Theory S9#8: The Mystery Date Observation
2015-11-14 (Sat)  -  Ash vs. Evil Dead S1#3: Books from Beyond
2015-11-15 (Sun)  -  Family Guy S14#6: A Shot in the Dark
2015-11-15 (Sun)  -  Once upon a Time S5#8: Birth
2015-11-15 (Sun)  -  Once upon a Time S5#9: The Bear King
2015-11-15 (Sun)  -  The Walking Dead S6#6: B
```

## Setup

Copy the file `./config/config.sample.js` to `./config/config.js`. Remove the shows you're not interested in. See the other options as well.


## How to use

Just run the following command in the project's folder:

```
node check
```


## Updating the db

The `cache` dir needs to be updated occasionally to be updated for the newer episodes. You need to run the following command for update everything:

```
node update-cache
```

Update only a specific show

```
node update-cache.js --shows="The Simpsons"
```

You can also `git pull` this repo from time to time, I try to keep it as updated as possible.


## Help needed

If your favourite show is missing, please create a github issue, or add it by yourself (it's really easy), and make a pull request.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/nagy-tamas/series-fanatic/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
