# email-validator
Email address validation tool that detects temporary, misspelled, or invalid addresses.

## Setup

1. `npm install`
1. Append your API key <sup>1</sup> to the `dnsLookupUrl` variable in `lib/validator`, i.e. `dnsLookupUrl = 'https://www.whoisxmlapi.com/whoisserver/DNSService?apiKey=PASTE_YOUR_API_KEY_HERE'`
1. `npm run start`

<sup>1</sup> This app checks the domain’s mail server (MX record) by performing a DNS lookup using the [DNS Lookup API by WhoisXML API](https://dns-lookup.whoisxmlapi.com/api). You can sign up for a free subscription plan limited to 500 queries per month to get an API key.

## Example

### Request

```sh
curl \
  -X POST \
  -H 'Content-Type:application/json' \
  -d '{ "email" : "test@outbook.com" }' \
localhost:3000/check
```

### Response

```json
{
  "temp"        : false,
  "misspelled"  : true,
  "autocorrect" : "test@outlook.com",
  "invalid"     : true
}
```
