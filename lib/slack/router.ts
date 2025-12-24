import { Hono } from 'hono'
import { cloneRawRequest } from "hono/request"
import { createHmac } from "node:crypto";
import { safeCompare, SlackEventRes } from "./utils.ts";
export const slack = new Hono()

const SLACK_SINGING_SECRET = Deno.env.get("SLACK_SINGING_SECRET") ?? ""
const SLACK_XOXB_TOKEN = Deno.env.get("SLACK_XOXB_TOKEN") ?? ""


slack.use(async (c, next) => {
  const rawreqBody = await (await cloneRawRequest(c.req)).arrayBuffer()
  const reqBody = new TextDecoder('utf-8').decode(rawreqBody)

  const timestamp = Number(c.req.header('X-Slack-Request-Timestamp')) || 0 
  const slackSignature = c.req.header("x-slack-signature") || ""

  console.log("Received slack req, ", c.req,'\n', reqBody)
  if ((Math.floor(Date.now() / 1000) - timestamp) > 60 * 5){
    console.log("rejecting for invalid timestamp")
    return c.text("Invalid timestamp")
  }
  const baseStringToSign = 'v0:' + timestamp + ':' + reqBody
  const signature = "v0=" + createHmac('sha256', SLACK_SINGING_SECRET).update(baseStringToSign).digest("hex")
  
  
  if (!safeCompare(signature, slackSignature)){
    console.log("rejecting for invalid signature")
    return c.text("Invalid signature")
  }
  await next()
})


slack.post("/events",async(c) => {
  const body: SlackEventRes = await c.req.json()
  c.status(200)
  console.log("got genuine event")
  if(body.type == 'url_verification') {
      return c.text(body["challenge"])
  } else if (body.type == "event_callback") {

    unfurl(body.event.unfurl_id, body.event.source, decodeURI(body.event.links[0].url))

    return c.text('')
  }
  return c.text("Hello slack, you seem authentic")

})

slack.get('/', (c)=> {
  return c.text("I don't know why slack would make a GET request but sure, this request seems legit.")
})


async function unfurl(unfurl_id: string, source: 'conversations_history' | 'composer', urlToUnfurl: string) {
  
  const body=JSON.stringify({
      unfurl_id,
      source,
      user_auth_required: false,
      unfurls: {
        [urlToUnfurl]: {
          blocks:[
                            {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Take a look at this carafe, just another cousin of glass"
                    },
                  },
                  {
                    "type": 'actions',
                    "elements": [
                      {
                        "type":"button",
                        "action_id": "the-click-button",
                        "text": {
                          "type": "plain_text",
                          "text": "click"
                        },
                        style: "primary"
                      }
                    ]
                  }
          ]
        }
      }
    })
    console.log(body)
  
  const res = await fetch('https://slack.com/api/chat.unfurl',{
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${SLACK_XOXB_TOKEN}`
    }
  })

  console.log(await res.json())
}