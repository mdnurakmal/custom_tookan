#!/bin/bash

ps -ef | grep node
sudo kill $(ps aux | grep 'app.js' | awk '{print $2}')