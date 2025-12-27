# Join my channel
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Fv1ctorio%2Fjoin-my-channel)


Easy and fast to deploy tool meant to replace private-channel join request Slack workflows. Built with serverless support in mind, using hono as it's only dependency (no bolt).


> [!NOTE]
> To deploy it, follow the guide at [/docs/deploy.md](./docs/deploy.md).

## Contributing

To set up a dev environment, populate the `.env` and
for deno,

```sh
deno task start
```

for cloudflare workers,

```sh
npx wrangler dev
```
