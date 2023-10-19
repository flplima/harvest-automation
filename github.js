const octokit = require("@octokit/graphql");

const graphqlWithAuth = octokit.graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_API_TOKEN}`,
  },
});

exports.getEstimation = async function ({ issueId, repositoryName }) {
  const response = await graphqlWithAuth(`
    query {
      repository(owner: "${process.env.GITHUB_OWNER}", name: "${repositoryName}") {
        issue(number: ${issueId}) {
          projectItems(first: 1) {
            nodes {
              id
              fieldValues(first: 50) {
                nodes {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    __typename
                    name
                    field {
                      ... on ProjectV2SingleSelectField {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `);
  const projectItem = response.repository.issue.projectItems.nodes[0];
  const effortField = projectItem.fieldValues.nodes.find(
    (node) => node.field?.name === "Effort"
  );
  return effortField?.name || "No estimation!";
};
