/* bootstrap */
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "react-router-dom";

type Props = {
    image: string,
    title: string,
    artistName: string,
    summary: string,
    id: string
}

export const PodcastCard = ({image, title, artistName, summary, id} : Props) => {
    return (
        <Card style={{ width: '25rem' }} className='mx-auto shadow-lg'>
            <Link to={`/podcast/${id}`}>
                <Card.Img 
                    variant="top" 
                    className='p-4'
                    src={ image }
                />
            </Link>

            <ListGroup className="list-group-flush">
                <ListGroup.Item>
                    <Card.Title><Link to={`/podcast/${id}`} className='text-decoration-none text-dark'>{ title }</Link></Card.Title>
                    by: { artistName }
                </ListGroup.Item>
                <ListGroup.Item>
                    <p><strong>Description:</strong></p>
                    { summary }
                </ListGroup.Item>
            </ListGroup>
        </Card>
    )
}