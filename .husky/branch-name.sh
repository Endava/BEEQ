#!/usr/bin/env bash

# Colors
RED='\033[0;31m'
YELLOW='\033[0;33m'
CLEARCOLOR='\033[0m'

local_branch_name="$(git rev-parse --abbrev-ref HEAD)"
allowed_branch_names="feat|fix|test|docs|style|chore|perf|refactor|revert|ci|build"

message="❌ ${RED}There is something wrong with your branch name${CLEARCOLOR} ❌\\n\
Branch names in this project must adhere to this contract:\\n\
  <prefix>/<name>\\n\
where prefix is one of:
  $allowed_branch_names\\n\
${YELLOW}Please, rename your branch to a valid name and try again.${CLEARCOLOR}\\n"

branch_name_check="^(($allowed_branch_names)\/[a-zA-Z0-9\-]+)$"
if [[ $local_branch_name != "main" && ! $local_branch_name =~ $branch_name_check ]]; then
    echo "$message"
    exit 1
fi

exit 0
