const next = require('next');
const Koa = require('koa');
const Router = require('koa-router');
const { parse } = require('url');
const request = require('request');

const dev = process.env.NODE_ENV !== 'production';
const n = next({ dev });
const handle = n.getRequestHandler();
const API_ROUTES = ['/itinary/optimize'];

n.prepare().then(() => {
  const app = new Koa();
  const router = new Router();

  router.get('*', async (ctx, next) => {
    const parsedUrl = parse(ctx.req.url, true);
    const { pathname } = parsedUrl;
    if (!API_ROUTES.includes(pathname)) {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    } else {
      return next();
    }
  });

  router.get('/itinary/optimize/', optimizeItinary);

  app.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  app.use(router.routes());

  app.listen(process.env.PORT || 3000);
});

// Optimize itinary route :

const GOOGLE_API_KEY = 'AIzaSyAmbWDDtZLseI0s7hHee51RAieFnQGrSqs';

const buildOptimizeUrl = (start, end, waypoints) =>
  `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${start}&destination=place_id:${end}&waypoints=optimize:true|place_id:${waypoints.join(
    '|place_id:'
  )}&key=${GOOGLE_API_KEY}`;

const fetchOptimizedItinary = (start, end, placesIds) =>
  new Promise((resolve, reject) => {
    const googleUrl = buildOptimizeUrl(start, end, placesIds);

    request.get(googleUrl, (error, response, body) => {
      try {
        let json = JSON.parse(body);
        resolve(json.routes[0].waypoint_order);
      } catch (e) {
        reject(e);
      }
    });
  });

async function optimizeItinary(ctx) {
  if (
    ctx.query.placesIds &&
    ctx.query.placesIds.length &&
    ctx.query.placesIds.length > 2
  ) {
    const placesIds = ctx.query.placesIds.split(',');
    const start = placesIds.shift();
    const end = placesIds.shift();

    try {
      const optimizedOrder = await fetchOptimizedItinary(start, end, placesIds);
      const optimizedPlacesIds = [];

      optimizedOrder.forEach(o => {
        optimizedPlacesIds.push(placesIds[o]);
      });

      optimizedPlacesIds.unshift(start, end);

      ctx.body = {
        optimizedPlacesIds
      };
    } catch (e) {
      /* eslint-disable no-console */
      console.error('=> Error optimizing itinary', e);
      /* eslint-enable */

      ctx.body = e;
    }
  } else {
    ctx.body = { error: true, message: 'No place ids provided' };
  }
}
