# shell-parallel

run commands in parallel, exit all when one ends.
exit code used to exit main process.
```
-x to run noisily (pipe to stdout/stderr)
-s to run silently (dont pipe to stdout/stderr)
```

### example
```
shell-parallel -s './asset_server' -x './asset_server_tests'
```
