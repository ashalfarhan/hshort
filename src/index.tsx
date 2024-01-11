import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { Env } from './types';
import { nanoid } from 'nanoid';
import { Layout } from './views/Layout';
import { CreationForm } from './views/CreationForm';
import { Created } from './views/Created';

const app = new Hono<{ Bindings: Env }>();

const STORE_PREFIX = 'hshort:slug:';

app.get('/*', serveStatic({ root: './' }));

app.use('*', async (c, next) => {
  c.setRenderer(content => {
    return c.html(<Layout>{content}</Layout>);
  });
  return await next();
});

app.get('/', async c => {
  const error = c.req.query('error');
  return c.render(<CreationForm error={error} />);
});

app.get('/created', async c => {
  const slug = c.req.query('slug');
  if (!slug) return c.status(403);
  return c.render(<Created url={'http://localhost:8787/' + slug} />);
});

app.post('/new', async c => {
  const form = await c.req.formData();
  let url = form.get('url');
  let slug = form.get('slug');
  try {
    if (!url) throw new Error('`url` is required');
    if (!slug) {
      slug = nanoid(4);
    } else {
      const isExists = await c.env.KEY_VAL.get(STORE_PREFIX + slug);
      if (isExists) throw new Error('Slug is already used!');
    }
    await c.env.KEY_VAL.put(STORE_PREFIX + slug, url);
    return c.redirect(`/created?slug=${slug}`, 303);
  } catch (error) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return c.redirect(`/?error=${message}`, 303);
  }
});

app.get('/:slug', async c => {
  const slug = c.req.param('slug');
  try {
    const result = await c.env.KEY_VAL.get(STORE_PREFIX + slug);
    if (!result) throw Error('Slug cannot be found');
    return c.redirect(result);
  } catch (error) {
    return c.redirect(`/?error=Link+not+found`, 301);
  }
});

export default app;
