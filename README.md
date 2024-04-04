# KoreografeyeServer

An experimental LDN inbox server with a [Koreografeye](https://github.com/eyereasoner/Koreografeye) backend.

## Install

```
yarn
```

## Example

Start the LDN inbox:

```
npx KoreografeyeServer start-server
```

Copy an example [Event Notification](https://www.eventnotifications.net/) in the inbox:

```
cp data/offer.jsonld inbox
```

Start the LDN inbox handler with the default rule set (`./rules`):

```
npx KoreografeyeServer handle-inbox
```

### See also

- [ldn-inbox-server](https://github.com/MellonScholarlyCommunication/ldn-inbox-server)
