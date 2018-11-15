import { Component } from 'react'
import Layout from '../components/Layout.js'
import fetch from 'isomorphic-unfetch'
import resolveResponse from 'contentful-resolve-response'
import Markdown, { renderers } from 'react-markdown'

// class component (allows for state)
export default class Article extends Component {
  static async getInitialProps(context) {
    const { id } = context.query;
    const res = await fetch(`http://localhost:3000/api/contentful?fields.slug=${id}&content_type=article&include=1`);
    const data = await res.json();
    const resData = await resolveResponse(data);
    console.log(resData[0]);
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
        <Markdown source={article.fields.body} />
      </Layout>
    );
  }
}