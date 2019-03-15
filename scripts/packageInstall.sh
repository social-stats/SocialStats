#!/bin/bash
source /home/ec2-user/.bash_profile
cd /var/www/SocialStats
npm install
npm i -g pm2
pm2 stop all