#!/bin/bash
source /home/ec2-user/.bash_profile
cd /var/www/SocialStats
sudo pm2 start -f server.js
