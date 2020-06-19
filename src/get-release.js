const
    core = require('@actions/core'),
    github = require('@actions/github');

const
    getLatestRelease = async (octokit) => {
        const { owner, repo } = github.context.repo;
        const { data } = await octokit.repos.getLatestRelease({ owner, repo });
        return data;
    },
    getReleaseByTag = async (octokit, tag) => {
        const { owner, repo } = github.context.repo;
        const { data } = await octokit.repos.getReleaseByTag({ owner, repo, tag });
        return data;
    };

module.exports = async () => {
    try {
        var tag = core.getInput('tag');
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
        const { ref } = github.context;

        core.debug(`Input release tag: ${tag}`);
        tag = '@context' === tag ? ref.replace('refs/tags/', '') : tag;
        core.debug(`Generated release tag: ${tag}`);

        core.debug('Getting release information from GitHub')
        const release = '@latest' === tag
            ? await getLatestRelease(octokit)
            : await getReleaseByTag(octokit, tag);

        core.debug('=== RELEASE INFORMATION ===');
        core.debug(JSON.stringify(release, null, 4));

        core.setOutput('release_id', release.id);
        core.setOutput('release_name', release.name);

        core.setOutput('html_url', release.html_url);
        core.setOutput('upload_url', release.upload_url);
        core.setOutput('assets_url', release.assets_url);
        core.setOutput('tarball_url', release.tarball_url);
        core.setOutput('zipball_url', release.zipball_url);

        core.setOutput('tag_name', release.tag_name);
    } catch (error) {
        core.setFailed(error.message);
    }
};
