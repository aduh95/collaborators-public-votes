# Initiate a new vote

## From the GitHub web UI

1. Edit the [`_EDIT_ME.yml`](./_EDIT_ME.yml) file, fill in the info related to
   vote to open.
2. When committing, chose to commit to new branch and open a Pull Request to
   discuss the vote terms.
3. Once the PR has approvals, merge it on the `initiateNewVote` branch (GHA
   should have set that as the target/base branch automatically).
4. GHA will open a new PR with the vote initiated.

## From the CLI

This method is not recommended.

1. Edit the [`_EDIT_ME.yml`](./_EDIT_ME.yml) file, fill in the info related to
   vote to open.
2. Commit your changes.
3. Push that to the remote `refs/heads/initiateNewVote`.
4. GHA will open a new PR with the vote initiated.
