## This project is not ready yet.

# series-fanatic

## What is this?

A command line tool to list episodes of series aired in the close past and future, so you won't miss anything.

Sample output:

```
2015-10-18 (Sun)  -  The Simpsons S27#4: Halloween of Horror
2015-10-18 (Sun)  -  The Walking Dead S6#2: JSS
2015-10-19 (Mon)  -  The Big Bang Theory S9#5: The Perspiration Implementation
2015-10-21 (Wed)  -  American Horror Story S5#3: Mommy
2015-10-21 (Wed)  -  Modern Family S7#5: The Verdict
2015-10-21 (Wed)  -  South Park S19#5: Safe Space
-------- NOW ---------
2015-10-25 (Sun)  -  Family Guy S14#4: Peternormal Activity
2015-10-25 (Sun)  -  The Simpsons S27#5: Treehouse of Horror XXVI
2015-10-25 (Sun)  -  The Walking Dead S6#3: Thank You
2015-10-26 (Mon)  -  The Big Bang Theory S9#6: The Helium Insufficiency
2015-10-28 (Wed)  -  American Horror Story S5#4: Devil's Night
```

## Setup

Copy the file `./config/config.sample.js` to `./config/config.js`. Remove the shows you're not interested in. See the other options as well.


## How to use

Just run the following command in the project's folder:

```
npm check
```


## Updating the db

The `cache` dir needs to be updated occasionally to be updated for the newer episodes. You need to run the following command for that:

```
npm update-cache
```

You can also `git pull` this repo from time to time, I try to keep it as updated as I can.
