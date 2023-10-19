const ghIssuePattern = /#(\d+)$/; // "Issue title #999"
const mapHarvestTaskToRepo = JSON.parse(process.env.REPOSITORIES_MAP); // { "harvest_task_name": "github_repository_name" }

function getIssueNumber(timeEntryTitle) {
  const match = ghIssuePattern.exec(timeEntryTitle);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  } else {
    return null;
  }
}

function getIssueUrl({ repositoryName, issueId }) {
  return `https://github.com/${process.env.GITHUB_OWNER}/${repositoryName}/issues/${issueId}`;
}

exports.getGhIssuesEntries = function (harvestApiEntries) {
  const ghEntries = harvestApiEntries.filter((t) => {
    return ghIssuePattern.test(t.notes);
  });

  const combinedItems = {}; // to combine entries with the same name

  for (const item of ghEntries) {
    const { notes, hours, task } = item;
    const repositoryName = mapHarvestTaskToRepo[task.name];
    if (!repositoryName) {
      console.warn('Warning: Repository not found for harvest task!', task)
      continue
    }
    const issueId = getIssueNumber(notes);
    combinedItems[notes] = {
      name: notes,
      task: task.name,
      repositoryName,
      issueId,
      issueUrl: getIssueUrl({ repositoryName, issueId }),
      hours: hours + (combinedItems[notes]?.hours || 0),
    };
  }

  return Object.values(combinedItems);
};
