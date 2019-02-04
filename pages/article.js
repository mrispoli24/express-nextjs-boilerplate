import { Component } from 'react'
import Layout from '../components/Layout'
import fetch from 'isomorphic-unfetch'
import resolveResponse from 'contentful-resolve-response'
import Marked from '../components/Marked'

// class component (allows for state)
export default class Article extends Component {
  static async getInitialProps(context) {
    const { id } = context.query;
    const options = {credentials: 'same-origin'}

    if (typeof context !== 'undefined') {
      options.headers = {
        Authorization: context.req.headers.authorization
      }
    }

    const contentfulRes = await fetch(`http://localhost:3000/api/contentful?fields.slug=${id}&content_type=article&include=1`, options);
    const data = await contentfulRes.json();
    const resData = await resolveResponse(data);

    return { 
      article: resData[0]
    };
  }

  render() {
    const {article} = this.props;
    
    return (
      <Layout title={article.fields.pageTitle} description={article.fields.pageDescription}>
        <h1>{article.fields.title}</h1>
        <img src={`${article.fields.thumbnail.fields.file.url}?w=600`} />
        <Marked content={article.fields.body} />
      </Layout>
    );
  }
}