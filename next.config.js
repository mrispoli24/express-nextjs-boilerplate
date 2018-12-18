module.exports = {
  serverRuntimeConfig: { // Will only be available on the server side
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET // Pass through env variables
  },
  publicRuntimeConfig: { // config vars for client and server, useful for api calls to routes inside express
    rootDomain: process.env.ROOT_DOMAIN,
  }
}