# Portfolio Site

## Available Scripts

### `npm start`

Runs the app in the development mode. [http://dev-portfolio.wolfcraft.io:3000](http://dev-portfolio.wolfcraft.io:3000/)

Local configuration: 
- Configure localhost to dev-portfolio.wolfcraft.io to run development version
    - Windows: add `127.0.0.1 v dev-portfolio.wolfcraft.io` to hosts file
- Add environment variables to `.env` file in root folder
    - HOST=dev-portfolio.wolfcraft.io
    - REACT_APP_CONTACT_EMAIL=          // contact email for website
    - REACT_APP_SM_INSTAGRAM=           // instagram account (optional)
    - REACT_APP_S3_BUCKET=              // S3 bucket name for photos
    - REACT_APP_S3_REGION=              // S3 bucket region
    - REACT_APP_S3_ID=                  // S3 acces user ID
    - REACT_APP_S3_SECRET=              // S3 access user sercret
    - REACT_APP_APPLICATION_SOURCE=     // link to source code (optional)


### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Build gets automatically executed for AWS Amplify app when pushed to `main`. Local builds are normally not required.\

> Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.\
[More info on deployment.](https://facebook.github.io/create-react-app/docs/deployment)
