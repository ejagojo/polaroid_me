# Polaroid Me
Polaroid Me is website designed for users who want to see what their music taste looks like as polaroids😤

Polaroid Me is heavily inspired by Receiptify, a popular website that converts your top Spotify tracks into a receipt-style list. Idea for this project of mine is creds to the creator of Receiptify!

Anyways feel free to visit my site -- https://polaroid-me.vercel.app/

# Run the app locally
Some pre-reqs is to have Nodejs downloaded - so please visit this site for a Nodejs downdload tutorial https://nodejs.org/en/learn/getting-started/how-to-install-nodejs


Once Node is installed - follow the instructions below
Clone the repo 

```
$ git clone https://github.com/ejagojo/polaroid_me.git
```

Once cloned, install the dependencies by running -
```
$ npm i
```

### Obtaining your Spotify API user credentials

Please visit this website[https://developer.spotify.com/] to obtain your Client ID and to setup your Redirect uri

I used 
```http://localhost:3000/callback``` - for the redirecturi

Once those are setup, put them into your projects root folder in a .env file
Now you can run the app by using the following command
```
$ npm start
```
