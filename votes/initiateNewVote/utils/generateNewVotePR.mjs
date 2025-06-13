export const keyServerURL = "hkps://keys.openpgp.org";

export function secretHolderThreshold(argv) {
  if (!argv['secret-holder']?.length) return 1
  if ('secret-holder-threshold' in argv) return Math.min(argv['secret-holder-threshold'], argv['secret-holder'].length)

  return Math.min(argv['secret-holder'].length, 3, Math.floor(2 * Math.log2(argv['secret-holder'].length)));
}

export const prOptions = {
  ["github-repo-name"]: {
    type: "string",
    describe: "GitHub repository, in the format owner/repo",
  },
  "pr-intro": {
    type: "string",
    describe: "Add an intro in markdown format for the PR body",
  },
  branch: {
    type: "string",
    short: "b",
    describe: "Name of the branch and subdirectory to use for the tests",
    demandOption: true,
  },
  subject: {
    type: "string",
    short: "s",
  },
  "secret-holder-threshold": {
    type: "string",
  },
  "secret-holder": {
    type: "string",
    multiple: true,
  },
}

export async function createVotePR(argv) {
  const response = await fetch(`${process.env.GITHUB_API_URL}/repos/${argv["github-repo-name"]}/pulls`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GH_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      base: 'main',
      head: argv.branch,
      title: argv.subject,
      body: `${argv["pr-intro"] ?? ""},

To close the vote, a minimum of ${secretHolderThreshold(argv)} key parts would need to be revealed.

Vote instructions will follow.`,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create PR: ' + response.statusText, { cause: response })
  }
  const { html_url: prUrl, url } = await response.json();

  {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.GH_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        body: `${argv["pr-intro"] ?? ""}

Vote instructions:

- on the web: <https://nodejs.github.io/caritat/#${prUrl}>
- on the CLI:
  ${"```sh"}
  git node vote ${prUrl}
  ${"```"}

${argv['secret-holder']?.length ?
`To close the vote, at least ${secretHolderThreshold(argv)} secret holder(s)[^1] must \
run the following command: ${"`"}git node vote ${prUrl} --decrypt-key-part --post-comment${"`"}
` : ''}
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to edit PR: ' + response.statusText, { cause: response })
    }
  }

  console.log("PR created", prUrl);
}
