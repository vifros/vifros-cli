
- Refactor the routing system.
- See how make the formatters dynamic.
- Code the full set of verbs.

- Add new verb: `configure` that will drop users in a vifros REPL using the
 Node.js REPL.

- Optimize the app so delays for executing commands are nearly not noticed.

#### Some notes on delays:

(counting the API query)

- Requiring `flatiron` and initializing the app takes ~400msec.
- Requiring `commands` takes ~500msec.
- Initializing `commands` takes ~100msec.

Total: ~1.4sec