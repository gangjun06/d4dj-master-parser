# D4DJ Master Parser

Parsing d4dj groovy mix game's master file to store DB

It workds with [d4dj-info-backend](https://github.com/gangjun06/d4dj-info-backend).

## Usage

```bash
yarn run build
yarn run start
```

## API

`POST /`

> Basic Auth Required

Request Body:

```
{
	"name": "Target Master File Name", //ex: Event
	"region": "Target region", // ex: jp
	"group": true/false // Check src/data/index.ts -> ParseGroup
}
```

Response Example:

```
{
  "result": [
		["Event-jp", "create", "1],
		["Event-jp", "create", "2],
		["Event-jp", "create", "3]
		....
	]
}
```
