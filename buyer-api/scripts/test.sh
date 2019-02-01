#!/usr/bin/env bash

# TODO: take these values from the environment
ganache_port=8545
signing_service_port=9101
signing_service_url="http://localhost:$signing_service_port/health"

# Script based on:
# https://github.com/OpenZeppelin/openzeppelin-solidity/blob/0b33d29e411893b134ad67ca92043e8629c44325/scripts/test.sh

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the ganache instance that we started (if we started one and if it's still running).
  if [ -n "$ganache_pid" ] && ps -p "$ganache_pid" > /dev/null; then
    kill -9 "$ganache_pid"
  fi

  if [ -n "$signing_service_pid" ] && ps -p "$signing_service_pid" > /dev/null; then
    kill -9 "$signing_service_pid"
  fi
}

is_service_running() {
  nc -z localhost "$1"
}

start_ganache() {
  echo -ne "Ganache is starting...\r"
  node_modules/.bin/ganache-cli --gasLimit 0xfffffffffff --port "$ganache_port" > /dev/null &
  ganache_pid=$!
  echo "Ganache is starting... DONE (pid: ${ganache_pid})"
}

if is_service_running $ganache_port; then
  echo "Ganache is already running"
else
  start_ganache
fi

node_modules/.bin/ava --tap | tap-spec
