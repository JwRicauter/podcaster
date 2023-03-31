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

/* services */
import { getPodcasts } from '../services/api';



export const Home = ( ) => {

  /* store api data */
	const [data, setData] = useState<any[]>([])
  
	/* Search string */
	const [searchString, setSearchString] = useState<string>('');

	/* Boolean that indicates if the podcast is loading */
	const { loader, setLoader } = useOutletContext<{loader: boolean, setLoader: React.Dispatch<React.SetStateAction<boolean>>}>();


	/* Use effect that gather all podcast info from api or cache */
	useEffect(() => {

		/* init variables */
		setLoader(true);
		setData([]);

		const cachedData = localStorage.getItem('podcasts');
		let makeACall = true;
		if (cachedData) {

			const parsedData = JSON.parse(cachedData);
			const lastUpdate = new Date(parsedData.lastFetchDate);
			const diff = Date.now() - lastUpdate.getTime();
			const diffDays = diff / (1000 * 60 * 60 * 24);

			// check if the data is expired
			const isExpired = diffDays > 1
			if (!isExpired) {
				makeACall = false;
				setData(parsedData.data);
				setLoader(false);
			} 
		}

		if (makeACall) {
			/* api call */
			const controller = new AbortController();
			const signal = controller.signal;
			getPodcasts(signal).then(res => {
				if ( res.feed ) {
					setData(res.feed.entry);
					const stringifiedData = JSON.stringify({
						data: res.feed.entry,
						lastFetchDate: Date.now(),
					});

					localStorage.setItem('podcasts', stringifiedData);
					setLoader(false);
				}
			})
			/* sanitize */
			return () => {
				controller.abort();
			};
		}

		
		
	}, [ ]);

	/* Use effect that filter data by the title or author */ 
	useEffect(() => {
		setLoader(true);
		setData([]);

		const cachedData = localStorage.getItem('podcasts');
		
		if (cachedData) {

			const parsedData = JSON.parse(cachedData);
			if (searchString.length > 0) {
				/* Filtering data by title or author */
				let wholeData : any[] = parsedData.data
				let newData = wholeData.filter(function( item ) {
					if (
						item['im:name']['label'].toLowerCase().includes(searchString.toLowerCase()) 
						|| item['im:artist']['label'].toLowerCase().includes(searchString.toLowerCase())
					) {
						return item
					}
				 });
				setData(newData)
				setLoader(false);
			} else {
				/* If there are no search string, retrieve the data from localstorage */
				setData(parsedData.data);
				setLoader(false);
			}
		}

		
	}, [searchString]);


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
						{
							data.length > 0 && data.map((item, index) => {
								return(
									<Col sm={12} md={6} lg={3} key={index}>
										<Link className='text-decoration-none text-dark' to={`/podcast/${item['id']['attributes']['im:id']}`}>
											<Card style={{ width: '18rem', height: '15rem' }} className='mx-auto shadow-lg my-5'>
												<Card.Img 
													variant="top" 
													src={item['im:image'][2]['label']} 
													className='rounded-circle w-50 mx-auto'
													style={{marginTop: '-20%'}}
												/>
												<Card.Body>
													<Card.Title className='text-center'>{item['im:name']['label']} </Card.Title>
													<Card.Text className='text-center'>
														Author: {item['im:artist']['label']}
													</Card.Text>
												</Card.Body>
											</Card>
										</Link>
									</Col>
								)
							})
						}
					</Row>


				</Container>

			</>
	)
}