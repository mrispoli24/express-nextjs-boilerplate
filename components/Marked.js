import marked from 'marked'

const Marked = (props) => {
    const { content } = props;

    return (
        <div dangerouslySetInnerHTML={{__html: marked(content, {...props})}} />
    )
}

export default Marked