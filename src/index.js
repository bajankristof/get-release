const
    core = require('@actions/core'),
    github = require('@actions/github')

const
    getLatestRelease = async (octokit) => {
        const { owner, repo } = github.context.repo
        const { data } = await octokit.repos.getLatestRelease({ owner, repo })
        return data
    },
    getReleaseByTag = async (octokit, tag) => {
        const { owner, repo } = github.context.repo
        const { data } = await octokit.repos.getReleaseByTag({ owner, repo, tag })
        return data
    },
    outputReleaseInfo = async (octokit, tag) => {
        const { ref } = github.context
        tag = '@context' === tag ? ref.replace('refs/tags/', '') : tag

        const release = '@latest' === tag
            ? await getLatestRelease(octokit)
            : await getReleaseByTag(octokit, tag)

        core.setOutput('release_id', release.id)
        core.setOutput('release_name', release.name)

        core.setOutput('html_url', release.html_url)
        core.setOutput('upload_url', release.upload_url)
        core.setOutput('assets_url', release.assets_url)
        core.setOutput('tarball_url', release.tarball_url)
        core.setOutput('zipball_url', release.zipball_url)
    }

;(async () => {
    try {
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
        await outputReleaseInfo(octokit, core.getInput('tag'))
    } catch (error) {
        core.setFailed(error.message)
    }
})
