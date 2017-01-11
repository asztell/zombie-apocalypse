# Zombie-Apocalypse

## What Is It?
Zombie Apocalypse is a web-based single player, 2D, RPG, survival game. It is playable [here][1].

The objective of the game is to kill as many zombies as possible and to survive as long as possible. You do this by balancing killing zombies and collecting food items for health points.

## Technology

It is built around an MVC structure utilizing MySQL, Express, Handlebars, the Phaser game engine, the Tiled map editor, and Node. The game currently runs best on Chrome.

## Game Play

* Select from one of three characters with differing starting health points and attack points
* Move the character using the arrow keys
* Collect food items to gain health points and kill zombies by running into them, which displays a modal for attack actions
* Every zombie has randomly generated health and attack points
* Some zombies are designed to chase you if you get within a defined interaction radius
* After a zombie kill, a health pack with randomly generated points is dropped within a defined radius around the character
* Some buildings can be entered to collect food for more health
* There are several trigger points in the game that result in zombie hoards being generated where previously there were no zombies

[1]: http://www.sajegames.com