#!/usr/bin/env bash

sudo apt-get -y update
sudo apt-get install -y git apache2

if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi

sudo add-apt-repository -y ppa:ondrej/php
sudo apt-get install -y python-software-properties
sudo apt-get -y update

sudo apt-get install -y php5.6 php5.6-curl


sudo apt-get install -y php5.6-cli curl > /dev/null

curl -Ss https://getcomposer.org/installer | php > /dev/null
sudo mv composer.phar /usr/bin/composer

sudo a2enmod rewrite
sudo a2enmod headers
cp /vagrant/000-default.conf /etc/apache2/sites-enabled/
sudo service apache2 restart