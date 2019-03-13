#!/usr/bin/env bash
source /home/ec2-user/.bash_profile
cd /var/www/SocialStats
pm2 start server.js
