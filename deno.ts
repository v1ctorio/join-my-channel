import "@std/dotenv/load"
import { Hono } from 'hono'
import slack from './lib/slack/router.ts'
import auth from './lib/auth.tsx'
import { serveStatic } from "hono/deno"
import { getSite } from "./lib/browser.tsx";


const app = new Hono()




app.get('/static/*', serveStatic({ root: './' }))
app.route('/slack', slack)
app.route('/auth', auth)
app.get('/',getSite)


Deno.serve(app.fetch)
