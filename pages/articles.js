import Layout from '../components/Layout.js'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'

// functional component (no state)
const Articles = (props) => (
    <Layout title="Articles" description="This is the meta-description for all articles on site.">
        <h1>All Articles</h1>
        <ul>
        {props.articles.items.map((article) => (
            <li key={article.sys.id}>
            <Link as={`/articles/${article.fields.slug}`} href={`/article?id=${article.fields.slug}`}>
                <a>{article.fields.title}</a>
            </Link>
            </li>
        ))}
        </ul>
        <style jsx>{`
            h1, a {
                font-family: "Arial";
            }

            ul {
                padding: 0;
            }

            li {
                list-style: none;
                margin: 5px 0;
            }

            a {
                text-decoration: none;
                color: black;
            }

            a:hover {
                opacity: 0.6;
            }
        `}</style>
    </Layout>
)
  
Articles.getInitialProps = async function(context) {
    const options = {credentials: 'same-origin'}

    if (typeof context !== 'undefined') {
      options.headers = {
        Authorization: context.req.headers.authorization
      }
    }

    const contentfulRes = await fetch(`http://localhost:3000/api/contentful?content_type=article`, options)
    const data = await contentfulRes.json()

    return {
        articles: data
    }
}
  
export default Articles
