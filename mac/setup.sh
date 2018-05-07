#!/bin/bash
sudo launchctl unload -w /Library/LaunchDaemons/com.territories.plist
sudo cp ./com.territories.plist /Library/LaunchDaemons/
sudo launchctl load -w /Library/LaunchDaemons/com.territories.plist
chmod +x ./cronjob.sh
