//TODO: Remove all logs and unnecessary stream reads

const SLACK_XOXB_TOKEN = Deno.env.get("SLACK_XOXB_TOKEN") ?? ""

const headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${SLACK_XOXB_TOKEN}`
}

export async function unfurlById(unfurl_id: string, source: 'conversations_history' | 'composer', urlToUnfurl: string) {
  
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
    headers
  })

  console.log(await res.json())
}


export async function replyInteractionEphemeral(response_url: string, text: string) {
    const body = JSON.stringify({
        text
    })

    const res = await fetch(response_url, {
        method: "POST",
        body,
        headers
    })
    
    console.log(await res.json())
}