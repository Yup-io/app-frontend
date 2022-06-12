const PRERENDER_TOKEN = 'qMJGnydLuILOuCFcFbMS';
const NON_SSR_REGEX = /\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|doc|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff|svg|eot)$/i;

export async function middleware(request) {
  const { url } = request;
  const { isBot } = request.ua;
  const { search } = request.nextUrl;

  if (/*(isBot || /_escaped_fragment_/.test(search)) && */!NON_SSR_REGEX.test(url)) {
    return await fetch(`https://service.prerender.io/${url}`, {
      headers: {
        'x-prerender-token': PRERENDER_TOKEN
      }
    });
  }
}
