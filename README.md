# Express Nextjs Boilerplate

The following is a basic setup for NextJS with server side routing and React. While NextJS is a glorious thing, it's out of the box routing is not very practical for a web application that you're looking to index or integrate with some backend endpoints. This gives you clean routes, and a basic example if you are going to integrate with a backend API of your own. 

I've also left some examples using Contentful content management system. For those who have not tried this, please do. Let you clients get a better CMS than wordpress while you go out and make some reactive magic.

The server.js file is also optimized to allow for concurrency, something not covered on the NextJS documentation but something that certainly helps out a ton if memory starts to spike.

I've included a `heroku-postbuild` step in the package.json file for easy deploy to Heroku, however this is not totally necessary.

## To Run

Setup environment file based upon the README.env environment file. Add your own Contentful space id and access tokens (preview and production) these will be accessible via `http://localhost:3000/api/contentful` as a starter. All parameters can be passed as a query string to this endpoint to use the standard `getEntries` method with their Javascript SDK. Feel free to modify this to suit your needs or break it out into it's own server side route. 

`npm install`

`npm run dev` runs development server with nodemon listening for server changes.

`npm run build` builds the next js app.

`npm run start` for production builds.

## Server Side Routes

All pages will require a server side route to maintain clean URL's. While you can still add files to the `/pages` directory, it is recommended you create a route in the server and then add that to the `server.js` file. These routes can now support get, post, put, and delete methods.

A standard catch all `/api` route is provided for external services and masking, however, feel free to modify this to suit your needs.

## Client Side

Use the `getInitialProps` hook to populate pages with data from Contenful or another source. This data need not be passed in server side. When rendering from the server, ie. first page load, then this data will be fetched server side and rendered (hooray SEO). When navigating on the client side this data will be fetched client side.

## Contentful

Contentful is setup by default to use their javascript SDK. Note that on the server side `resolveLinks` is set to false. This is necessary because the data cannot make it over the wire to the client side when rendering from the client due to Contentful's allowance of circular references. To mitigate this effect, we've separated the `contentful-resolve-response` package to pages and components so when fetching on the client side the response can be rebuilt after making it over the network to the client. *Please be careful: circular references are still possible on the client side with this configuration, however you are able to nest and include more deeply this way when not stringifying the JSON before parsing it on the client.*

**Why use server side routes at all?**

This helps protect your api keys and space id from being exposed in the front end code. So it is recommended for all services like this that you use the environment file to store your keys and mask them within express.
