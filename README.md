# Raspberry Pi Playground

## Prepare Raspberry Pi

Remove unused apps

```sh
sudo apt-get purge libreoffice wolfram-engine sonic-pi scratch
sudo apt-get autoremove
```

Install Node

```sh
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Install Yarn

```sh
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```
