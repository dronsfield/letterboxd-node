import crypto from "crypto"
import FormData from "form-data"
// @ts-ignore
import httpDebug from "http-debug"
import querystring from "querystring"
import { v4 } from "uuid"
import betterFetch from "../util/betterFetch"
httpDebug.http.debug = 2

const BASE_URL = `https://api.letterboxd.com/api/v0`

// const encrypt = async () => {
//   let secret = "sec-demo" // the secret key
//   let enc = new TextEncoder()
//   let body =
//     "GET\npub-demo\n/v2/auth/grant/sub-key/sub-demo\nauth=myAuthKey&g=1&target-uuid=user-1&timestamp=1595619509&ttl=300"
//   let algorithm = { name: "HMAC", hash: "SHA-256" }

//   let key = await crypto.subtle.importKey(
//     "raw",
//     enc.encode(secret),
//     algorithm,
//     false,
//     ["sign", "verify"]
//   )
//   let signature = await crypto.subtle.sign(
//     algorithm.name,
//     key,
//     enc.encode(body)
//   )
//   let digest = btoa(String.fromCharCode(...new Uint8Array(signature)))

//   console.log(digest)

//   return { key, signature, digest }
// }

let API_KEY = ""

const API_SECRET = "secret"
function generateSignature(opts: {
  method: string
  url: string
  body: string
}) {
  const { method, url, body } = opts
  const apiSecret = API_SECRET

  const hmac = crypto.createHmac("SHA256", apiSecret)

  hmac.update(`${method.toUpperCase()}${url}`)

  if (body) {
    hmac.update(Buffer.from(JSON.stringify(body)))
  }

  return hmac.digest("hex")
}

export const letterboxdFetch = async (
  ...params: Parameters<typeof betterFetch>
) => {
  let [url, opts] = params
  const { method = "GET", body } = opts || {}
  const nonce = v4()
  const timestamp = new Date().getTime()
  const query = querystring.stringify({
    nonce,
    timestamp,
    apiKey: API_KEY
  })
  url = `${url}?${query}`
  const signature = generateSignature({ method, url, body })
  url += `&signature=${signature}`
  console.log({ url })
  return betterFetch(...params)
}

export const auth = async (username: string, password: string) => {
  const formData = new FormData()
  formData.append("username", username)
  formData.append("password", password)
  formData.append("grant_type", "password")
  const resp = await letterboxdFetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    body: formData,
    contentType: "form"
  })
  console.log({ resp })
}
