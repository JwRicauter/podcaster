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
