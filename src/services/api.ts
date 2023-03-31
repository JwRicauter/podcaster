export const getPodcasts = async (signal: AbortSignal)  => {

  const uri : string = process.env.REACT_APP_ITUNES_URL + 'us/rss/toppodcasts/limit=100/genre=1310/json';
  let response = await fetch(uri, {
    method: 'GET',
    signal: signal
  }).then(
    res => res.json()
  ).catch(
    err => {return err}
  )
  
  return response;
}

export const getDetail = async (signal: AbortSignal, podcastId: string) => {
    
  const uri : string = 'https://api.allorigins.win/get?url=' + process.env.REACT_APP_ITUNES_URL + `lookup?id=${podcastId}`;

  let response = await fetch(uri, {
    method: 'GET',
    signal: signal
  }).then(
    res => res.json()
  ).catch(
    err => {return err}
  )
  
  return response;
}

export const getEpisodes = async (uri: string) => {
  
  let response = await fetch(uri, {
    method: 'GET',
  }).then(
    res => res.text()
  ).catch(
    err => {return err}
  )
  
  return response;
}