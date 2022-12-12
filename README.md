# Raid Watch Beta

[beta.raidwatch.org](http://beta.raidwatch.org)

A Destiny 2 fireteam inspection tool to help catch configuration errors and show player synergy.

Depends on the [Bungie API](https://bungie-net.github.io/multi/index.html).

## Setup

To set up this app you first need to register. You can do that on Bungie's
[Application](https://www.bungie.net/en/Application) page.

Make sure to set the Origin Header to `http://localhost:3000` and save. It takes 20 mins for this
change to propagate.

You then need to install nodejs16+ and yarn locally. Once you have those run `yarn` in the root to
install all the dependencies.

Copy the `.envEXAMPLE` file to the root of the repo and rename it to `.env`. Then replace
`YOUR_DEV_KEY_HERE` in that file to your new API key. Finally, run `yarn start`.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

For prod use `yarn start-prod`.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

For a prod build use `yarn build-prod`.

### `yarn upload`

Runs `yarn build` and then calls an `upload.sh` that should handle uploading the site. This script
is missing from the repository for obvious reasons...

For a prod upload use `yarn upload-prod`.