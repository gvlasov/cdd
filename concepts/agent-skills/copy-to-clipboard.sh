#!/usr/bin/env bash
cd "$(git rev-parse --show-toplevel)"
set -e
./concepts/agent-skills/build | ./platform/clipboard/copy

