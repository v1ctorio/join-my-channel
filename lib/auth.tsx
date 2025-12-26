import { Hono } from "hono";
import { EnvT } from "./env.ts";
import { env } from "hono/adapter";
import { Layout } from "./browser.tsx";
import { resolve } from "node:path";
import { renderToReadableStream, Suspense } from "hono/jsx/streaming";

const hono = new Hono()


const TestC = async ({ text, delay }: { text: string; delay: number }) => {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return <p style={{ color: "green" }}>{text}</p>;
};


hono.get("/redirect/slack", (c) => {
    return c.redirect("")
})

hono.get("/hackclub", (c) => {

    const {HCA_CLIENT_ID, HCA_REDIRECT_URI} = env<EnvT>(c)

    const oidc_link = new URL("https://auth.hackclub.com/oauth/authorize")
    oidc_link.searchParams.append('client_id', HCA_CLIENT_ID)
    oidc_link.searchParams.append('redirect_uri', HCA_REDIRECT_URI)
    oidc_link.searchParams.append('response_type', 'code')
    oidc_link.searchParams.append('scope', 'openid+slack_id')


    return c.redirect(oidc_link.href)
})

hono.get("/hackclub/callback", async (c) => {

    const {HCA_CLIENT_ID, HCA_CLIENT_SECRET} = env<EnvT>(c)

    const code = c.req.query("code")

    if (!code) {
        return c.html(<Layout>
            <p>Code not provided. Log in at <a href="/hackclub">/hackclub</a>.</p>
        </Layout>)
    }

    const stream = renderToReadableStream(
        <Layout>
            <p>Starting to do things</p>

            <Suspense fallback={<p>failed</p>}>
                <TestC text="First thing" delay={1000}/>
            </Suspense>


            <Suspense fallback={<></>}>
                <TestC text={token.access_token} delay={100}/>
            </Suspense>
        </Layout>
    )
    const token = await HCACodeToToken(code, HCA_CLIENT_ID, HCA_CLIENT_SECRET)





    
    return c.body(stream, {
        headers: {
            "Content-Type":"text/html; charset=UTF-8",
            "Transfer-Encoding": "Chunked"
        }
    })
    return c.
})

export default hono;


async function HCACodeToToken(code:string, client_id: string, client_secret: string): Promise<HCATokenRes> {
    const payload = {
        client_id,
        client_secret,
        code,
        grant_type: "authorization_code"
    }
    const res = await fetch('https://auth.hackclub.com/oauth/token', {
        method: "POST",
        body: JSON.stringify(payload)
    })

    return await res.json()
}


interface HCATokenRes {
    access_token: string;
    token_type: 'Bearer',
    id_token: string
}