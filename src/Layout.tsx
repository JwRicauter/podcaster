/* react */
import { useState } from 'react';

/* reac-router */
import { Outlet } from 'react-router-dom';
import { Link } from "react-router-dom";

/* bootstrap */
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


export const Layout = () => {

		/* boolean that fires gif loader in the navbar */
		const [loader, setLoader] = useState<boolean>(false);
	
    return(
			<>
			<Navbar className='card shadow-sm rounded-0'>
				<Container  className='p-0'>
					<Navbar.Brand href="">
						<Link to={'./'} className='text-decoration-none'>
							<h3 className='text-primary'>Podcaster</h3>	
						</Link>
					</Navbar.Brand>
					<Navbar.Toggle />
					<Navbar.Collapse className="justify-content-end">
						<Navbar.Text>
							{loader && <img className='float-right' height='50' src={require('./media/img/loading.gif')} />}
						</Navbar.Text>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<Outlet context={{loader, setLoader}}/>
			</>
    )
}