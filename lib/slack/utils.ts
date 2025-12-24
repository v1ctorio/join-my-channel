import { Buffer } from "node:buffer";
import { timingSafeEqual } from "node:crypto";

interface EventCallback {
  type: 'event_callback'
  token: string
  team_id: string
  api_app_id: string
  event_id: string
  event_time: number
}
interface UrlVerificationCallback {
  token: string,
  challenge: string,
  type: 'url_verification'
}
interface LinkSharedEvent extends EventCallback {
  event: {
  type: string
  channel: string
  is_bot_user_member: boolean
  user: string
  message_ts: string
  unfurl_id: string
  thread_ts: string
  source: 'conversations_history' | 'composer'
  links: {
    domain:string,
    url:string
  }[]
  user_locale: string
  }
}

export type SlackEventRes = LinkSharedEvent | UrlVerificationCallback


export function safeCompare(a: string, b:string): boolean {
  const bufA = Buffer.from(a, 'utf-8')
  const bufB = Buffer.from(b, 'utf-8')

  if (bufA.length !== bufB.length) return false;

  return timingSafeEqual(bufA,bufB)
}