#!/usr/bin/env node
const spawn = require('child_process').spawn
const once = require('once')
const argv = require('yargs').argv

// run commands in parallel, exit all when one ends
// -x to run noisily (pipe to stdout/stderr)
// -s to run silently (dont pipe to stdout/stderr)
//
// eg:
//   node development/shell-parallel.js -s 'npm run ganache:start' -x 'npm run test:screens:run'

// generate child processes
const silentCommands = toArray(argv.s)
const noisyCommands = toArray(argv.x)
const commands = [].concat(
    silentCommands.map(command => ({ command, noisy: false })),
    noisyCommands.map(command => ({ command, noisy: true }))
)

const children = commands.map(({ command, noisy }) => {
  const child = spawn('sh', ['-c', command], { env: process.env })
  console.log(`spawned (${child.pid}): "${command}"`)
  child.command = command
  // pipe output to console
  if (noisy) {
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
  }
  return child
})

// listen for any to end
const onEndOnce = once(onEnd)
children.forEach((child) => {
  child.once('exit', onEndOnce.bind(null, child))
})

// end all, exit with child's exit code
function onEnd(child, exitCode) {
  console.log(`exited: "${child.command}"`)
  // kill all
  children.forEach(child => child.kill())
  // exit with original exit code
  process.exit(exitCode)
}

function toArray(value) {
  if (value) {
    return Array.isArray(value) ? value : [value]
  }
  return []
}
