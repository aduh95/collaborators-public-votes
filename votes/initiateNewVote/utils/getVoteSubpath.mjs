import { spawn } from "node:child_process";
import { createInterface as readLines } from "node:readline";

const voteFileCanonicalName = "vote.yml";

export const findVoteSubPath = (firstCommitRef) => new Promise(async (resolve, reject) => {
    const cp = spawn("git", [
      "--no-pager",
      "show",
      firstCommitRef,
      "--name-only",
    ]);
    cp.on("error", reject);
    for await (const line of readLines(cp.stdout)) {
      if (line === voteFileCanonicalName) return resolve("./");
      if (line.endsWith(`/${voteFileCanonicalName}`))
        return resolve(line.slice(0, -voteFileCanonicalName.length));
    }
  });