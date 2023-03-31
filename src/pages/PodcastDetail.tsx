/* react */
import { useState, useEffect } from "react"

/* react-router */
import { useOutletContext, useParams } from 'react-router';
import { Link } from "react-router-dom";

/* services */
import { getDetail, getEpisodes } from "../services/api";

/* components */
import { PodcastCard } from "../components/PodcastCard";

/* bootstrap */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';





export const PodcastDetail = () => {

		/* detail data of the podcast */

		const [detailData, setDetailData] = useState<any>({});
		/* Boolean that indicates if the podcast is loading */
		const { loader, setLoader } = useOutletContext<{loader: boolean, setLoader: React.Dispatch<React.SetStateAction<boolean>>}>();
		
		/* podcast id */
		const { id } = useParams();


		useEffect(() => {
			setLoader(true);
			setDetailData([]);
      let podcastId : string = (id as string)
      const cachedData = localStorage.getItem(podcastId);
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
					setDetailData(parsedData.data);
					setLoader(false);
				} 
			}
      if (makeACall) {


        const controller = new AbortController();
				const signal = controller.signal;
				
        let podcastDetail : any = {}
				getDetail(signal, podcastId).then(res => {
					if (res.contents) {
						let content = JSON.parse(res.contents).results[0]
						podcastDetail['artistName'] = content.artistName
						podcastDetail['image'] = content.artworkUrl600 
						getEpisodes(content['feedUrl']).then( doc => {
							let responseDoc = new DOMParser().parseFromString(doc, 'application/xml');
							podcastDetail['summary'] = responseDoc.getElementsByTagName('itunes:summary').item(0)?.innerHTML;
							podcastDetail['title'] = responseDoc.getElementsByTagName('title').item(0)?.innerHTML;
							podcastDetail['episodes'] = {}

							let episodes = responseDoc.getElementsByTagName('item');
							podcastDetail['episodesNo'] = episodes.length
              
              let counter = 1;
							Array.from(episodes).forEach(episode => {
								let episodeNo = episode.getElementsByTagName('itunes:episode').item(0)?.innerHTML
								let seasonNo = episode.getElementsByTagName('itunes:season').item(0)?.innerHTML
                let uid = counter;
								if ( episodeNo != undefined && seasonNo != undefined ) {
									let uid : string = seasonNo + episodeNo;
								} else {
                  seasonNo = '1';
                  episodeNo = counter.toString();
                  counter = counter + 1;
                }
                podcastDetail['episodes'][uid] = {
                  'title': episode.getElementsByTagName('title').item(0)?.innerHTML,
                  'pubDate': episode.getElementsByTagName('pubDate').item(0)?.innerHTML,
                  'duration': episode.getElementsByTagName('itunes:duration').item(0)?.innerHTML,
                  'episode': episodeNo,
                  'season': seasonNo,
                  'description': episode.getElementsByTagName('description').item(0)?.innerHTML,
                  'audioUrl': episode.getElementsByTagName('enclosure').item(0)?.getAttribute('url')
                }

							});
							
							setDetailData(podcastDetail);
              const stringifiedData = JSON.stringify({
                data: podcastDetail,
                lastFetchDate: Date.now(),
              });
  
              localStorage.setItem(podcastId, stringifiedData);

							setLoader(false);
	
						})
					}
        })

      }
	
		}, [id]);


		const fmtMSS = (s: number) => { return(s-(s%=60))/60+(9<s?':':':0')+s }

    return (
        <>
					<Container fluid>
						<Row className='mt-5'>
							<Col sm={12} md={12} lg={4}>
								<PodcastCard 	
									image = {detailData.image}
									title = {detailData.title}
									artistName = {detailData.artistName}
									summary = {detailData.summary}
									id={(id as string)}
								/>
							</Col>
							<Col sm={12} md={12} lg={7}>
								<Card className='shadow-lg'>
									<Card.Title className='px-4 py-2 mb-0'>Episodes: { detailData.episodes ? Object.keys(detailData.episodes).length : 0}</Card.Title>
								</Card>

								<Card className='shadow-lg p-4 mt-3'>
									<Table striped hover className=''>
										<thead>
											<tr>
												<th>Title</th>
												<th>Date</th>
												<th>Duration</th>
											</tr>
										</thead>
										<tbody>
											{
												
											}
											{
												detailData.episodes && Object.keys(detailData.episodes).length > 0 && 
												Object.keys(detailData.episodes).map((episodeId: any, index: number) => {
                          let duration = detailData.episodes[episodeId].duration
                          if (duration && duration.split(':').length == 1) { duration = fmtMSS(duration)}
													
													
													return (
														<tr key={index}>
															<td>
																<Link className='text-decoration-none' to={`/podcast/${id}/episode/${episodeId}`}>
																	{detailData.episodes[episodeId].title}
																</Link>	
															</td>
															<td>{detailData.episodes[episodeId].pubDate}</td>
															<td>{ duration }</td>
														</tr>
													)
												})
											}
										</tbody>
									</Table>
								</Card>

							</Col>
						</Row>

					</Container>
        </>
    )
}