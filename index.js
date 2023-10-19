require("dotenv").config();

const { createObjectCsvWriter } = require("csv-writer");
const githubApi = require("./github");
const harvestApi = require("./harvest");
const utils = require("./utils");

async function main() {
  const userTimeEntries = await harvestApi.getUserTimeEntries();

  const ghIssuesEntries = utils.getGhIssuesEntries(userTimeEntries);

  const ghIssuesEntriesWithEstimation = await Promise.all(
    ghIssuesEntries.map(async (entry) => ({
      ...entry,
      estimation: await githubApi.getEstimation({
        issueId: entry.issueId,
        repositoryName: entry.repositoryName,
      }),
    }))
  );

  console.table(ghIssuesEntriesWithEstimation, [
    "issueId",
    "name",
    "hours",
    "estimation",
  ]);

  const csvWriter = createObjectCsvWriter({
    path: "output.csv",
    header: [
      { id: "name", title: "Name" },
      { id: "hours", title: "Harvest hours" },
      { id: "estimation", title: "GitHub Estimation" },
      { id: "task", title: "Harvest Task" },
      { id: "repositoryName", title: "GitHub Repository" },
      { id: "issueId", title: "GitHub Issue ID" },
      { id: "issueUrl", title: "GitHub Issue URL" },
    ],
  });

  await csvWriter.writeRecords(ghIssuesEntriesWithEstimation);
}

main();
