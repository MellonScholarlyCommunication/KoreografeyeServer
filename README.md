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

### Example2

Start an experimental service with two LDN server that in a loop keep sying 'hi' to eachother.

Start server 1 (inbox: `./inbox1`)

```
yarn server1
```

Start server2 (inbox: `./inbox2`)

```
yarn server2
```

Start an inbox handler for `./inbox1`:

```
yarn handle1
```

Start an inbox handler for `./inbox1`:

```
yarn handle2
```

Inject the demo announce to `./inbox1`:

```
cp data/announce.jsonld ./inbox1
```

Now in intervals of 10 seconds you'll see notifications appear and disappear in both inboxes.

### See also

- [ldn-inbox-server](https://github.com/MellonScholarlyCommunication/ldn-inbox-server)
