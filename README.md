# h1z1-server

## Description

Based on the work of @jseidelin on [soe-network](https://github.com/psemu/soe-network),
h1z1-server is a library trying to emulate a h1z1(just survive) server.

## Motivation

"It's just matter of effort and to have enough people of with interest towards having such private servers to the respected game.
I highly doubt that H1Z1 (Just Survive) is one of those."

## Current Goal

Making this work for the 15 January 2015 version of H1Z1 (first version).

## Setup H1Z1

### Download it

Use [DepotDownloader](https://github.com/SteamRE/DepotDownloader) ( only work if you've bought h1z1 )

AppID : 295110 DepotID : 295111 ManifestID : 1930886153446950288

How to use DepotDownloader : https://youtu.be/44HBxzC_RTg

### Setup ClientConfig.ini

On the H1Z1 game folder there is a file name "ClientConfig.ini".

Open it and change the *Server* value to the adress of your server , probably `localhost:PORT`

### Launch the game

Execute this command in CMD/Powershell ( you have to be in your h1z1 game folder ) :

`.\H1Z1.exe  inifile=ClientConfig.ini providerNamespace=soe sessionid=0 CasSessionId=0 Interna
tionalizationLocale=en_US LaunchPadUfp={fingerprint} LaunchPadSessionId=0 STEAM_ENABLED=0`

## Setup MongoDB

* Create a database named "h1server" with a collection named "servers"

* Add the following code as a document, this is a server's info template:

`{"serverId":{"$numberInt":"1"},"serverState":{"$numberInt":"1"},"locked":false,"name":"fuckdb","nameId":{"$numberInt":"1"},"description":"yeah","descriptionId":{"$numberInt":"1"},"reqFeatureId":{"$numberInt":"0"},"serverInfo":"ye","populationLevel":{"$numberInt":"1"},"populationData":"<Population ServerCapacity=\"0\" PingAddress=\"127.0.0.1:20043\" Rulesets=\"Permadeath\"><factionlist IsList=\"1\"><faction Id=\"1\" Percent=\"0\" TargetPopPct=\"0\" RewardBuff=\"52\" XPBuff=\"52\" PercentAvg=\"0\"/><faction Id=\"2\" Percent=\"0\" TargetPopPct=\"1\" RewardBuff=\"0\" XPBuff=\"0\" PercentAvg=\"0\"/><faction Id=\"3\" Percent=\"0\" TargetPopPct=\"1\" RewardBuff=\"0\" XPBuff=\"0\" PercentAvg=\"1\"/></factionlist></Population>","allowedAccess":true}`


## Current State

- [x] SessionRequestReply
- [x] LoginRequestReply

Right now after the client has succesfully receive the LoginRequestReply the LoginServer spam the client of 'ServerListReply'.

This allows us to access the game menu ( :D ), but the menu does not display any server to join.

## How to use

You need [Nodejs](https://nodejs.org/en/) ( currently using 12.16 LTS).

`npm i h1z1-server` to install package 

Now you can use the library like that : 


    const H1server = require("h1z1-server");
    
    var server = new H1server.LoginServer(
      295110, // <- AppID
      "dontnow", // <- environment
      true, // <- using MongoDB (boolean)
      1115, // <- server port
      "fuckdb", // <- loginkey
      "dontnow" // <- backend
     );
     server.start();


*I will make more documentation later*

## More resources

Here is a fork of the soe-network repository with updated dependencies without my work :

https://github.com/QuentinGruber/soe-network

@ChrisHffm attempts to do the same thing you can find his repository here : 

https://github.com/ChrisHffm/H1Z1-Server