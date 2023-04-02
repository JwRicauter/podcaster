/* react */
import { useState, useEffect } from "react"

/* react-router */
import { useOutletContext, useParams } from 'react-router';

/* components */
import { PodcastCard } from "../components/PodcastCard";

/* bootstrap */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

/* services */
import { getDetail, getEpisodes } from "../services/api";


export const EpisodeDetail = ( ) => {

    /* podcast and episode ids */
    const { podcastId, episodeId } = useParams();
    /* detail data of the podcast */
    const [detailData, setDetailData] = useState<any>({});

    /* Boolean that indicates if the podcast is loading */
		const { loader, setLoader } = useOutletContext<{loader: boolean, setLoader: React.Dispatch<React.SetStateAction<boolean>>}>();

		useEffect(() => {
			setLoader(true);
			setDetailData([]);
      let podcastId_ : string = (podcastId as string)
      const cachedData = localStorage.getItem(podcastId_);
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
				getDetail(signal, podcastId_).then(res => {
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
                let uid = counter.toString();
								if ( episodeNo != undefined && seasonNo != undefined ) {
									uid = seasonNo.toString() + episodeNo.toString();
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
  
              localStorage.setItem(podcastId_, stringifiedData);

							setLoader(false);
	
						})
					}
        })

      }
      
	
		}, [podcastId]);
    
    useEffect(() => {

      console.log(episodeId)
      episodeId && detailData.episodes && console.log(detailData.episodes[episodeId])
	
		}, [detailData]);

    return(					
      <Container fluid>
        <Row className='mt-5'>
          <Col sm={12} md={12} lg={4}>
            {
              podcastId && episodeId && <PodcastCard 	
                image = {detailData.image}
                title = {detailData.title}
                artistName = {detailData.artistName}
                summary = {detailData.summary}
                id={(podcastId as string)}
              />
            }

          </Col>
          <Col sm={12} md={12} lg={7}>
            {
              podcastId && episodeId && detailData.episodes &&
              <Card className='mx-auto shadow-lg p-4'>
                <Card.Title>
                  <h2>{  detailData['episodes'][episodeId].title }</h2>
                </Card.Title>
                <Card.Body>
                <div dangerouslySetInnerHTML={{ __html: detailData['episodes'][episodeId].description }} />

                  
                </Card.Body>
                <Card.Body>

                  <audio src={detailData['episodes'][episodeId].audioUrl} className='w-100 text-dark' controls />
                </Card.Body>
              </Card>
            
            }

          </Col>
        </Row>
      </Container>
    )
}