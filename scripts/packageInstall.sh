#!/bin/bash
source /home/ec2-user/.bash_profile
cd /var/www/SocialStats
pm2 stop all
npm install
npm i -g pm2
