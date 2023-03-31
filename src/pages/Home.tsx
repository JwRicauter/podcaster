/* react */
import { useState, useEffect } from 'react'

/* react-router */
import { useOutletContext } from 'react-router';
import { Link } from "react-router-dom";

/* bootstrap */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';





export const Home = ( ) => {

  /* store api data */
	const [data, setData] = useState<any[]>([])
  
	/* Search string */
	const [searchString, setSearchString] = useState<string>('');

	/* Boolean that indicates if the podcast is loading */
	const { loader, setLoader } = useOutletContext<{loader: boolean, setLoader: React.Dispatch<React.SetStateAction<boolean>>}>();



	return(
			<> 
				<Container fluid>
					<Row className='my-4'>
						<Col sm={12} md={12} lg={4}></Col>
						<Col sm={12} md={6} lg={4}></Col>
						<Col sm={12} md={6} lg={4}>
							<Form className='d-flex'>
								<Badge bg="primary" className='my-auto'> {data.length} </Badge>
								<Form.Group className="mb-0 px-2" controlId="search">
									<Form.Control onChange={e => { setSearchString(e.target.value) }} placeholder="Filter podcasts..." />
								</Form.Group>
							</Form>
						</Col>
					</Row>

					<Row className='mt-5 pt-5'>

					</Row>


				</Container>

			</>
	)
}