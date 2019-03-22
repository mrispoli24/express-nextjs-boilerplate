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

We also implment caching on each route individually via `LRU-cache`. This can be tweaked on a route by route basis in this way. Route methods are exported from their respective files in the `/server/routes` directory. The naming convention for each method is borrowed from Ruby on Rails. 

|Method Name|Description|
|-----------|-----------|
|index      |Fetches all content of a certain type for an index page.|
|get        |Fetches a single piece of contnet of a certain type.    |
|post       |Post requests.                                          |
|put        |Put requests.                                           |
|delete     |Delete requests.                                        |

You can then define these in your `server.js` file. First by requiring the appropriate route file, then by adding it's proper method to the proper express method. See below for example...

```js
app.prepare().then(() => {
    ...
    // pages
    const index = require('./server/routes/index');
    const about = require('./server/routes/about');
    const articles = require('./server/routes/articles');

    ... 

    // pages
    server.get('/', index.index(app));
    server.get('/about', about.index(app));
    server.get('/articles', articles.index(app));
    server.get('/articles/:id', articles.get(app));

    ...

```

A standard catch all `/api` route is provided for external services and masking, however, feel free to modify this to suit your needs.

## Client Side

Use the `getInitialProps` hook to populate pages with data from Contenful or another source. This data need not be passed in server side. When rendering from the server, ie. first page load, then this data will be fetched server side and rendered (hooray SEO). When navigating on the client side this data will be fetched client side.

## Contentful

Contentful is setup by default to use their javascript SDK. Note that on the server side `resolveLinks` is set to false. This is necessary because the data cannot make it over the wire to the client side when rendering from the client due to Contentful's allowance of circular references. To mitigate this effect, we've separated the `contentful-resolve-response` package to pages and components so when fetching on the client side the response can be rebuilt after making it over the network to the client. *Please be careful: circular references are still possible on the client side with this configuration, however you are able to nest and include more deeply this way when not stringifying the JSON before parsing it on the client.*

**Why use server side routes at all?**

This helps protect your api keys and space id from being exposed in the front end code. So it is recommended for all services like this that you use the environment file to store your keys and mask them within express.

## Styles

Styles can be done via style jsx for components or just use standard CSS in the `/static/styles` directory. I've included [Tachyons atomic css framework](http://tachyons.io/) in the main stylesheet as a nice helper. Remove it if you hate atomic styles but I found this helps a ton in sticking to only styled jsx by providing great utility classes to re-use.

*Note: packages for SASS and CSS for this project were horribly under-documented and did not make easy use of things like @import which would allow for niceties like SASS variables and mixins. Long story short CSS should be relatively minimal if using styled JSX and we can now use CSS variables native support.*

## Fonts and Images

Fonts and images can go into the `/assets` directory either in their own folders or in bulk. We can then import fonts into the stylesheets as needed from there. 

## robots.txt and sitemap.xml

These two files sit in the static directory. We have provided these to get you started. We have also provided a sample sitmap generator script inside of the `/jobs` directory. This can be run on a chron and sent out to a CDN for dynamic hosting or just checked into source and built periodically with your deploys. Since SEO is pretty much the only reason we have to go through this whole rigamarole we might as well make that stuff awesome out of the box.

## Progress Bar

One thing that can get pretty annoying to users is clicking links that fetch contentful data and nothing happening. Is nothing really happening? Nope. We just need to give users some feedback. This uses the [next-nprogress](https://www.npmjs.com/package/next-nprogress) package and a custom app wrapper to achieve. Thank you [sergiodxa](https://www.npmjs.com/~sergiodxa). Check the [docs](https://github.com/rstacruz/nprogress) for more [configuration options](https://github.com/rstacruz/nprogress#configuration).

## Markdown Parsing

There are two packages for parsing markdown here. One is `react-markdown` which provides a nice component and can be used for many purposes. I have also provided `marked` as a component which is a more robust markdown package in that we can use it as a component that will allow for HTML use in the markdown. Be aware this does utilize `dangerouslySetInnerHtml` so ensure you are not accepting content from the public with this component. Some editing teams require that HTML be allowed in their CMS so this accounts for that.

*Marked Example:*

```js
import Marked from '../components/Marked'

...

render(){
    return(
        <Marked content={article.fields.body} sanitize={true} />
    );
}
```

*React Markdown Example:*

```js
import Markdown, { renderers } from 'react-markdown'

...

render(){
    return(
        <Markdown source={article.fields.body} />
    );
}
```

## Config Vars

Configuratin variables can be held in the server inside of a `.env` file as normal. For certain variables that are not security sensitive you may want these to be available to both the client and the server. An example is the root domain of the application for api calls that call an internal api that will toggle between localhost and your real domain depending upon the application. For this purpose you can use `next.config.js`. The `publicRuntimeConfig` object can be used to hoist these variables. For private variables that you only want to use in server side renders use the `serverRuntimeConfig` object.

This file looks like this:

```js
// next.config.js

module.exports = {
  serverRuntimeConfig: { // Will only be available on the server side
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET // Pass through env variables
  },
  publicRuntimeConfig: { // config vars for client and server, useful for api calls to routes inside express
    rootDomain: process.env.ROOT_DOMAIN,
  }
}
```

In your routes and components you will call this through like this:

```js
// page.js

import getConfig from 'next/config';

...

Page.getInitialProps = async function(context) {
  const {publicRuntimeConfig} = getConfig();

  ...

  const pageRes = await fetch(`${publicRuntimeConfig.rootDomain}/api/your_api_route`);
  
  ...

```

## Static Files

All static files can be placed in the `/static` directory. However, in certain cases you may want some of these files to serve from the root directory. Examples of this are `sitemap.xml`, `robots.txt`, and `favicon.ico`. In this case you can add these to the `rootStaticFiles` array of in the `server.js` file so they will be served off of the root. You should still place these files in the base of the `/static` file directory.

```js
// next/js routes that don't require backend routes
server.get('*', (req, res) => {
  // setup static files from root like sitemap.xml || robots.txt || favicon.ico
  const parsedUrl = parse(req.url, true);
  const rootStaticFiles = [
    '/robots.txt',
    '/sitemap.xml', 
    '/favicon.ico'
  ];

  if (rootStaticFiles.indexOf(parsedUrl.pathname) > -1) {
    const path = join(__dirname, 'static', parsedUrl.pathname);
    return app.serveStatic(req, res, path);
  }
  // else serve page if not required by server
  return handle(req, res);
});
```

## Basic Auth

I've included basic auth to password protect the appliation using a plaintext username and password set in the environment file. This is NOT to be used for super sensitive appliations housing major trade secrets or people's personal info. If you just need to protect a staging site or server while developing or to create a content preview application for Contentful then this is your jam.

To enable add these to your `.env` file:

```
BASIC_AUTH_ENABLED = true
BASIC_AUTH_USERNAME = 'admin'
BASIC_AUTH_PASSWORD = 'supersecret'
```

*You should use the username and password that you would like for this*

Just enabling this WILL throw errors in your pages that make internal API calls in `getInitialProps`. This is because you need to pass the credentials into these calls. You will need to get the `res` argument from next here to access the basic authentication header.

Here it is in a functional component: 

```js
Article.getInitialProps = async function(context) {
  const options = {credentials: 'same-origin'} // need this header to pass creds for the client side

   // need this to pass creds server side
  if (typeof context !== 'undefined') {
    options.headers = {
      Authorization: context.req.headers.authorization
    }
  }

  // pass options as second argument to fetch
  const contentfulRes = await fetch(`http://localhost:3000/api/contentful?content_type=article`, options)

  ...

```

Here it is in a Class based component:

```js
export default class Article extends Component {
  static async getInitialProps(context) {
    const { id } = context.query;
    const options = {credentials: 'same-origin'}

    if (typeof res !== 'undefined') {
      options.headers = {
        Authorization: context.req.headers.authorization
      }
    }

    const contentfulRes = await fetch(`http://localhost:3000/api/contentful?fields.slug=${id}&content_type=article&include=1`, options);

    ...
```

This is included in both example routes with `getInitialProps` since I do find it helpful to password protect staging servers most of the time.

## Jobs

The jobs folder is for any node jobs you may want to run as automated tasks or chron jobs. We have provided a sample for creating a sitemap from contentful content on site.